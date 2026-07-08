import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Per-IP submission limits (defaults: 5 submissions / hour). See .env.example.
const RATE_LIMIT = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const RATE_WINDOW_SECONDS = Number(process.env.CONTACT_RATE_WINDOW_SECONDS) || 3600;

// Input length limits
const MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254, // RFC 5321 max
  subject: 100,
  message: 5000,
};

// Escape HTML to prevent XSS in email
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

// Destination email for all contact form submissions
// Set via CONTACT_FORM_EMAIL environment variable
// Default: info@parksideharmony.org (requires domain verification in Resend)
const DESTINATION_EMAIL = process.env.CONTACT_FORM_EMAIL || "info@parksideharmony.org";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message, chorus, website } = body;

    // Honeypot: `website` is a hidden field real users never see or fill.
    // If it has a value, treat the submission as a bot and drop it silently
    // (return a success-shaped response so we don't reveal the trap).
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      });
    }

    // Rate limit per client IP before doing any work or sending email.
    const ip = getClientIp(request);
    const { allowed } = await checkRateLimit(
      `ratelimit:contact:${ip}`,
      RATE_LIMIT,
      RATE_WINDOW_SECONDS
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate types
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid field types" },
        { status: 400 }
      );
    }

    // Validate lengths
    if (
      firstName.length > MAX_LENGTHS.firstName ||
      lastName.length > MAX_LENGTHS.lastName ||
      email.length > MAX_LENGTHS.email ||
      subject.length > MAX_LENGTHS.subject ||
      message.length > MAX_LENGTHS.message
    ) {
      return NextResponse.json(
        { error: "One or more fields exceed maximum length" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Format subject line based on inquiry type
    const subjectLabels: Record<string, string> = {
      join: "Interested in Joining",
      performance: "Performance Booking Request",
      lessons: "Vocal Coaching/Lessons Inquiry",
      general: "General Inquiry",
    };
    const emailSubject = `Website Contact: ${subjectLabels[subject] || subject}`;

    // Format chorus name for the email
    const chorusNames: Record<string, string> = {
      harmony: "Parkside Harmony",
      melody: "Parkside Melody",
      voices: "Parkside (All Voices)",
    };
    const chorusName = chorusNames[chorus] || "Not specified";

    // Escape user input for safe HTML embedding
    const safeFirstName = escapeHtml(firstName);
    const safeLastName = escapeHtml(lastName);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const safeSubjectDisplay = escapeHtml(subjectLabels[subject] || subject);

    // Build the email HTML with escaped values
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeFirstName} ${safeLastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <a href="mailto:${safeEmail}">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeSubjectDisplay}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Chorus Interest:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${chorusName}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${safeMessage}</div>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #9CA3AF;">
          This message was sent from the Parkside website contact form.
          <br />
          Reply directly to this email to respond to ${safeFirstName}.
        </p>
      </div>
    `;

    // Send the email using Resend.
    // TODO(domain-verify): `onboarding@resend.dev` is Resend's shared sandbox
    // sender — on the free tier it can only deliver to the Resend account owner's
    // address. Once parksideharmony.org is verified in Resend, switch `from` to a
    // sender on that domain (e.g. "Parkside Website <noreply@parksideharmony.org>").
    const { error } = await resend.emails.send({
      from: "Parkside Website <onboarding@resend.dev>",
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

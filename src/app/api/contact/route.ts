import { NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { validateContactSubmission } from "@/lib/contact-validation";

// Lazily construct the Resend client. Doing this at module scope throws at
// build time ("Missing API key") when RESEND_API_KEY isn't set (e.g. in CI),
// so defer it until a request actually needs to send mail.
let resendClient: Resend | null = null;
function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// Per-IP submission limits (defaults: 5 submissions / hour). See .env.example.
const RATE_LIMIT = Number(process.env.CONTACT_RATE_LIMIT) || 5;
const RATE_WINDOW_SECONDS = Number(process.env.CONTACT_RATE_WINDOW_SECONDS) || 3600;

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
    const { chorus, website } = body ?? {};

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

    // Validate required fields, types, lengths, and email format
    const validation = validateContactSubmission(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const { firstName, lastName, email, subject, message } = validation.data;

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
    const { error } = await getResend().emails.send({
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

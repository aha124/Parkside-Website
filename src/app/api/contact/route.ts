import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Destination email for all contact form submissions
// Set via CONTACT_FORM_EMAIL environment variable
// Default: info@parksideharmony.org (requires domain verification in Resend)
const DESTINATION_EMAIL = process.env.CONTACT_FORM_EMAIL || "info@parksideharmony.org";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, subject, message, chorus } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    // Build the email HTML
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <a href="mailto:${email}">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Subject:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${subjectLabels[subject] || subject}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Chorus Interest:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${chorusName}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
          <div style="background-color: #F9FAFB; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #9CA3AF;">
          This message was sent from the Parkside website contact form.
          <br />
          Reply directly to this email to respond to ${firstName}.
        </p>
      </div>
    `;

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
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

    console.log("Email sent successfully:", data?.id);

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

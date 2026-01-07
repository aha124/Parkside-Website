import { NextResponse } from "next/server";

// Contact form destination emails
const CONTACT_EMAILS = {
  harmony: "parksideharmony@parksideharmony.org",
  melody: "parksidemelody@parksideharmony.org",
  general: "info@parksideharmony.org",
};

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

    // Determine destination email based on subject and chorus
    let destinationEmail = CONTACT_EMAILS.general;
    if (subject === "join" && chorus === "harmony") {
      destinationEmail = CONTACT_EMAILS.harmony;
    } else if (subject === "join" && chorus === "melody") {
      destinationEmail = CONTACT_EMAILS.melody;
    }

    // Log the contact form submission
    console.log("=== Contact Form Submission ===");
    console.log(`From: ${firstName} ${lastName} <${email}>`);
    console.log(`To: ${destinationEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Chorus: ${chorus || "Not specified"}`);
    console.log(`Message: ${message}`);
    console.log("===============================");

    // TODO: Integrate with email service (SendGrid, Resend, etc.)
    // For now, we'll just log and return success
    //
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'noreply@parksideharmony.org',
    //   to: destinationEmail,
    //   subject: `Contact Form: ${subject}`,
    //   html: `<p>From: ${firstName} ${lastName} (${email})</p><p>${message}</p>`,
    // });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      // For development, show where it would go
      debug: process.env.NODE_ENV === "development" ? { destinationEmail } : undefined,
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

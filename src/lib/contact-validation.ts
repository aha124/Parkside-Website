// Field length limits for contact form submissions.
export const CONTACT_MAX_LENGTHS = {
  firstName: 100,
  lastName: 100,
  email: 254, // RFC 5321 max
  subject: 100,
  message: 5000,
} as const;

export interface ContactFields {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactValidationResult =
  | { valid: true; data: ContactFields }
  | { valid: false; error: string };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a raw contact-form payload. Pure and side-effect-free so the branch
 * behavior can be unit-tested without spinning up the route or mocking Resend.
 * Returns the trimmed-of-nothing validated fields, or the first error message.
 */
export function validateContactSubmission(
  body: unknown
): ContactValidationResult {
  if (typeof body !== "object" || body === null) {
    return { valid: false, error: "All fields are required" };
  }

  const { firstName, lastName, email, subject, message } = body as Record<
    string,
    unknown
  >;

  // Required fields
  if (!firstName || !lastName || !email || !subject || !message) {
    return { valid: false, error: "All fields are required" };
  }

  // Types
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return { valid: false, error: "Invalid field types" };
  }

  // Lengths
  if (
    firstName.length > CONTACT_MAX_LENGTHS.firstName ||
    lastName.length > CONTACT_MAX_LENGTHS.lastName ||
    email.length > CONTACT_MAX_LENGTHS.email ||
    subject.length > CONTACT_MAX_LENGTHS.subject ||
    message.length > CONTACT_MAX_LENGTHS.message
  ) {
    return { valid: false, error: "One or more fields exceed maximum length" };
  }

  // Email format
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: "Invalid email address" };
  }

  return { valid: true, data: { firstName, lastName, email, subject, message } };
}

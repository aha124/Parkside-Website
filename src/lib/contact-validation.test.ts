import { describe, it, expect } from "vitest";
import {
  validateContactSubmission,
  CONTACT_MAX_LENGTHS,
} from "./contact-validation";

const validBody = () => ({
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@example.com",
  subject: "general",
  message: "Hello there",
});

describe("validateContactSubmission", () => {
  it("accepts a well-formed submission and returns the fields", () => {
    const result = validateContactSubmission(validBody());
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.email).toBe("ada@example.com");
    }
  });

  it("rejects non-object bodies", () => {
    expect(validateContactSubmission(null).valid).toBe(false);
    expect(validateContactSubmission("nope").valid).toBe(false);
  });

  it("rejects when a required field is missing", () => {
    const { firstName, ...rest } = validBody();
    void firstName;
    const result = validateContactSubmission(rest);
    expect(result).toEqual({ valid: false, error: "All fields are required" });
  });

  it("rejects non-string field types", () => {
    const result = validateContactSubmission({ ...validBody(), message: 42 });
    expect(result).toEqual({ valid: false, error: "Invalid field types" });
  });

  it("rejects fields that exceed the maximum length", () => {
    const result = validateContactSubmission({
      ...validBody(),
      message: "x".repeat(CONTACT_MAX_LENGTHS.message + 1),
    });
    expect(result).toEqual({
      valid: false,
      error: "One or more fields exceed maximum length",
    });
  });

  it("rejects malformed email addresses", () => {
    const result = validateContactSubmission({
      ...validBody(),
      email: "not-an-email",
    });
    expect(result).toEqual({ valid: false, error: "Invalid email address" });
  });
});

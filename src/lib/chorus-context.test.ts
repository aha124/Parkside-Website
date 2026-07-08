import { describe, it, expect } from "vitest";
import { shouldShowForChorus } from "./chorus";

describe("shouldShowForChorus", () => {
  it("shows untagged content for every selection", () => {
    expect(shouldShowForChorus(undefined, "harmony")).toBe(true);
    expect(shouldShowForChorus("", "melody")).toBe(true);
  });

  it("shows everything when the visitor selected 'voices'", () => {
    expect(shouldShowForChorus("harmony", "voices")).toBe(true);
    expect(shouldShowForChorus("melody", "voices")).toBe(true);
  });

  it("shows content tagged 'voices' or 'both' for any selection", () => {
    expect(shouldShowForChorus("voices", "harmony")).toBe(true);
    expect(shouldShowForChorus("both", "melody")).toBe(true);
  });

  it("matches the selected chorus case-insensitively", () => {
    expect(shouldShowForChorus("Harmony", "harmony")).toBe(true);
    expect(shouldShowForChorus("MELODY", "melody")).toBe(true);
  });

  it("hides content tagged for a different chorus", () => {
    expect(shouldShowForChorus("harmony", "melody")).toBe(false);
    expect(shouldShowForChorus("Melody", "harmony")).toBe(false);
  });
});

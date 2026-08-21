// Pure chorus helpers, kept free of React / "use client" so they can be
// imported anywhere (including server code and unit tests). The context
// provider in chorus-context.tsx re-exports these for existing call sites.

export type ChorusType = "harmony" | "melody" | "voices";

// Check whether a piece of content should be shown for the selected chorus.
export function shouldShowForChorus(
  contentChorus: ChorusType | string | undefined,
  selectedChorus: ChorusType
): boolean {
  // If no chorus specified on content, show it for all
  if (!contentChorus) return true;

  // If user selected "voices", show everything
  if (selectedChorus === "voices") return true;

  // Normalize contentChorus to lowercase for comparison
  const normalizedChorus = contentChorus.toLowerCase();

  // If content is tagged "voices" or "both", show it for all chorus selections
  if (normalizedChorus === "voices" || normalizedChorus === "both") return true;

  // Otherwise, only show if it matches the selected chorus (case-insensitive)
  return normalizedChorus === selectedChorus;
}

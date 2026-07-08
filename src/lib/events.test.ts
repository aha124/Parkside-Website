import { describe, it, expect } from "vitest";
import { mergeEventOverrides } from "./events";
import type { Event } from "@/components/events/EventsList";
import type { EventItem } from "@/types/admin";

const baseEvent = (over: Partial<Event> = {}): Event => ({
  id: "e1",
  title: "Spring Concert",
  date: "Mar 1, 2026",
  description: "A concert",
  imageUrl: "/images/a.jpg",
  chorus: "harmony",
  ...over,
});

const override = (over: Partial<EventItem> = {}): EventItem => ({
  id: "o1",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  location: "",
  imageUrl: "",
  chorus: "voices",
  originalId: "e1",
  ...over,
});

describe("mergeEventOverrides", () => {
  it("returns scraped events unchanged when there are no overrides", () => {
    const events = [baseEvent()];
    expect(mergeEventOverrides(events, [])).toEqual(events);
  });

  it("applies a matching override, letting truthy fields win", () => {
    const merged = mergeEventOverrides(
      [baseEvent()],
      [override({ title: "Renamed Concert", chorus: "melody" })]
    );
    expect(merged[0].title).toBe("Renamed Concert");
    expect(merged[0].chorus).toBe("melody");
  });

  it("falls back to the scraped value when an override field is blank", () => {
    const merged = mergeEventOverrides(
      [baseEvent({ title: "Original" })],
      [override({ title: "" })]
    );
    expect(merged[0].title).toBe("Original");
  });

  it("ignores overrides whose originalId matches no event", () => {
    const events = [baseEvent()];
    const merged = mergeEventOverrides(events, [
      override({ originalId: "does-not-exist", title: "Ghost" }),
    ]);
    expect(merged[0].title).toBe("Spring Concert");
  });

  it("ignores overrides that have no originalId", () => {
    const merged = mergeEventOverrides(
      [baseEvent({ title: "Original" })],
      [override({ originalId: undefined, title: "Should not apply" })]
    );
    expect(merged[0].title).toBe("Original");
  });

  it("sorts the merged events by date ascending", () => {
    const merged = mergeEventOverrides(
      [
        baseEvent({ id: "e1", date: "Mar 10, 2026", title: "Later" }),
        baseEvent({ id: "e2", date: "Jan 5, 2026", title: "Earlier" }),
      ],
      []
    );
    expect(merged.map((e) => e.title)).toEqual(["Earlier", "Later"]);
  });
});

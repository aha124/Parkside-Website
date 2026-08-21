import { describe, it, expect, beforeEach, vi } from "vitest";

const h = vi.hoisted(() => {
  const store = new Map<string, unknown>();
  let counter = 0;
  return {
    store,
    nextId: () => `id-${++counter}`,
    reset: () => {
      store.clear();
      counter = 0;
    },
  };
});

vi.mock("@vercel/kv", () => ({
  kv: {
    get: async (k: string) => h.store.get(k) ?? null,
    set: async (k: string, v: unknown) => {
      h.store.set(k, v);
    },
  },
}));

vi.mock("uuid", () => ({ v4: () => h.nextId() }));

import { createKvCollection, type KvEntity } from "./kv-collection";

interface Thing extends KvEntity {
  name: string;
}

beforeEach(() => h.reset());

describe("createKvCollection", () => {
  it("returns an empty list when the key is unset", async () => {
    const c = createKvCollection<Thing>({ key: "k" });
    expect(await c.list()).toEqual([]);
  });

  it("appends new items by default and stamps id + timestamps", async () => {
    const c = createKvCollection<Thing>({ key: "k" });
    const a = await c.create({ name: "a" });
    await c.create({ name: "b" });
    expect(a.id).toBe("id-1");
    expect(a.createdAt).toBeTruthy();
    expect(a.updatedAt).toBeTruthy();
    expect((await c.list()).map((x) => x.name)).toEqual(["a", "b"]);
  });

  it("prepends new items when prepend is set", async () => {
    const c = createKvCollection<Thing>({ key: "k", prepend: true });
    await c.create({ name: "a" });
    await c.create({ name: "b" });
    expect((await c.list()).map((x) => x.name)).toEqual(["b", "a"]);
  });

  it("merges fields on update and returns null for an unknown id", async () => {
    const c = createKvCollection<Thing>({ key: "k" });
    const a = await c.create({ name: "a" });
    const updated = await c.update(a.id, { name: "renamed" });
    expect(updated?.name).toBe("renamed");
    expect(await c.update("missing", { name: "x" })).toBeNull();
  });

  it("reports whether remove matched anything", async () => {
    const c = createKvCollection<Thing>({ key: "k" });
    const a = await c.create({ name: "a" });
    expect(await c.remove(a.id)).toBe(true);
    expect(await c.remove(a.id)).toBe(false);
    expect(await c.list()).toEqual([]);
  });

  it("keeps separate keys isolated", async () => {
    const one = createKvCollection<Thing>({ key: "one" });
    const two = createKvCollection<Thing>({ key: "two" });
    await one.create({ name: "in-one" });
    expect(await two.list()).toEqual([]);
  });
});

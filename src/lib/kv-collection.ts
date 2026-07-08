import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

/**
 * Shape every KV collection item shares. Only `id` is required — some entities
 * (e.g. event overrides) type their timestamps as optional, so the constraint
 * stays permissive while `create`/`update` always stamp them at runtime.
 */
export interface KvEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KvCollection<T extends KvEntity> {
  /** Read the whole list; returns [] on missing key or KV error. */
  list(): Promise<T[]>;
  /** Append/prepend a new item, stamping id + timestamps. */
  create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  /** Merge fields into the item with `id`, bumping updatedAt; null if absent. */
  update(id: string, data: Partial<T>): Promise<T | null>;
  /** Remove the item with `id`; false if nothing matched. */
  remove(id: string): Promise<boolean>;
}

/**
 * Factory for a Vercel-KV-backed collection of `{ id, createdAt, updatedAt }`
 * items stored as a single JSON array under `key`.
 *
 * Extracts the get/create/update/delete-by-id pattern that was copy-pasted
 * across news, videos, images, event overrides, and ad campaigns in
 * admin-data.ts. `prepend` controls whether new items go to the front of the
 * list (news/videos) or the back (images/event overrides).
 */
export function createKvCollection<T extends KvEntity>(options: {
  key: string;
  prepend?: boolean;
  /** Label used in the error log when a read fails. */
  label?: string;
}): KvCollection<T> {
  const { key, prepend = false, label = key } = options;

  async function list(): Promise<T[]> {
    try {
      const items = await kv.get<T[]>(key);
      return items || [];
    } catch (error) {
      console.error(`Error fetching ${label}:`, error);
      return [];
    }
  }

  async function create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<T> {
    const items = await list();
    const now = new Date().toISOString();
    const newItem = {
      ...data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    } as T;
    await kv.set(key, prepend ? [newItem, ...items] : [...items, newItem]);
    return newItem;
  }

  async function update(id: string, data: Partial<T>): Promise<T | null> {
    const items = await list();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await kv.set(key, items);
    return items[index];
  }

  async function remove(id: string): Promise<boolean> {
    const items = await list();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    await kv.set(key, filtered);
    return true;
  }

  return { list, create, update, remove };
}

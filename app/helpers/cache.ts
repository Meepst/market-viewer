// lib/file-cache.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const CACHE_DIR = join(process.cwd(), ".cache");

interface CachedFile<T> {
  data: T;
  expiry: number;
}

function ensureDir() {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
}

export function getFileCached<T>(key: string): T | null {
  ensureDir();
  const path = join(CACHE_DIR, `${key}.json`);
  if (!existsSync(path)) return null;

  try {
    const entry: CachedFile<T> = JSON.parse(readFileSync(path, "utf-8"));
    if (Date.now() > entry.expiry) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function setFileCache<T>(
  key: string,
  data: T,
  ttlSeconds: number,
): void {
  ensureDir();
  const path = join(CACHE_DIR, `${key}.json`);
  const entry: CachedFile<T> = {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  };
  writeFileSync(path, JSON.stringify(entry));
}

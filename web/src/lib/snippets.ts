// LocalStorage-backed snippet library.

export interface Snippet {
  id: string;
  name: string;
  text: string;
  createdAt: number;
  updatedAt: number;
}

const KEY = "wordcount:snippets:v1";

export function loadSnippets(): Snippet[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSnippet);
  } catch {
    return [];
  }
}

export function saveSnippets(snippets: Snippet[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(snippets));
  } catch {
    // Quota or disabled; silently fail (no-op).
  }
}

function isSnippet(v: unknown): v is Snippet {
  if (typeof v !== "object" || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    typeof o.text === "string" &&
    typeof o.createdAt === "number" &&
    typeof o.updatedAt === "number"
  );
}

export function newSnippetId(): string {
  // Best-effort UUID; fallback to time + random.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

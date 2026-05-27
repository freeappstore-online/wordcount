// Pure text transformation helpers.

export function toUpper(text: string): string {
  return text.toUpperCase();
}

export function toLower(text: string): string {
  return text.toLowerCase();
}

export function toTitleCase(text: string): string {
  return text.replace(/\b([\p{L}])([\p{L}']*)/gu, (_, first: string, rest: string) =>
    first.toUpperCase() + rest.toLowerCase(),
  );
}

export function toSentenceCase(text: string): string {
  const lower = text.toLowerCase();
  // Capitalize first letter overall + after sentence terminators.
  return lower.replace(/(^|[.!?…]\s+)([\p{L}])/gu, (_m, pre: string, c: string) => pre + c.toUpperCase());
}

export function toCamelCase(text: string): string {
  const parts = text.match(/[\p{L}\p{N}]+/gu);
  if (!parts || parts.length === 0) return "";
  return parts
    .map((w, i) => {
      const lw = w.toLowerCase();
      if (i === 0) return lw;
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    })
    .join("");
}

export function toSnakeCase(text: string): string {
  const parts = text.match(/[\p{L}\p{N}]+/gu);
  if (!parts || parts.length === 0) return "";
  return parts.map(w => w.toLowerCase()).join("_");
}

export function toKebabCase(text: string): string {
  const parts = text.match(/[\p{L}\p{N}]+/gu);
  if (!parts || parts.length === 0) return "";
  return parts.map(w => w.toLowerCase()).join("-");
}

export function reverseText(text: string): string {
  // Reverse code points so emoji/multi-byte chars don't shatter.
  return Array.from(text).reverse().join("");
}

export function removeExtraSpaces(text: string): string {
  // Collapse runs of spaces/tabs to one space; trim trailing spaces per line.
  return text
    .split(/\r\n|\r|\n/)
    .map(line => line.replace(/[ \t]+/g, " ").replace(/[ \t]+$/g, "").replace(/^[ \t]+/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function removeLineBreaks(text: string): string {
  return text.replace(/\r\n|\r|\n/g, " ").replace(/[ \t]+/g, " ").trim();
}

// ----------------- Line operations -----------------

function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

function joinLines(lines: string[]): string {
  return lines.join("\n");
}

export function sortLinesAsc(text: string): string {
  return joinLines(splitLines(text).slice().sort((a, b) => a.localeCompare(b)));
}

export function sortLinesDesc(text: string): string {
  return joinLines(splitLines(text).slice().sort((a, b) => b.localeCompare(a)));
}

export function sortLinesByLength(text: string): string {
  return joinLines(splitLines(text).slice().sort((a, b) => a.length - b.length));
}

export function dedupeLines(text: string): string {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of splitLines(text)) {
    if (!seen.has(line)) {
      seen.add(line);
      out.push(line);
    }
  }
  return joinLines(out);
}

export function reverseLines(text: string): string {
  return joinLines(splitLines(text).reverse());
}

// ----------------- Cleanup / extract -----------------

export function removeHtmlTags(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

const URL_RE = /\bhttps?:\/\/[^\s<>"']+/gi;
const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const NUMBER_RE = /-?\b\d+(?:[.,]\d+)?\b/g;

export function extractUrls(text: string): string[] {
  return Array.from(text.match(URL_RE) ?? []);
}

export function extractEmails(text: string): string[] {
  return Array.from(text.match(EMAIL_RE) ?? []);
}

export function extractNumbers(text: string): string[] {
  return Array.from(text.match(NUMBER_RE) ?? []);
}

// ----------------- Find & Replace -----------------

export interface FindOptions {
  caseSensitive: boolean;
  regex: boolean;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Build a global RegExp for the find query. Returns null if invalid regex. */
export function buildFindRegex(query: string, opts: FindOptions): RegExp | null {
  if (query === "") return null;
  const flags = opts.caseSensitive ? "g" : "gi";
  const pattern = opts.regex ? query : escapeRegex(query);
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

export function countMatches(text: string, query: string, opts: FindOptions): number {
  const re = buildFindRegex(query, opts);
  if (!re) return 0;
  const matches = text.match(re);
  return matches ? matches.length : 0;
}

export function replaceAll(
  text: string,
  query: string,
  replacement: string,
  opts: FindOptions,
): string {
  const re = buildFindRegex(query, opts);
  if (!re) return text;
  return text.replace(re, replacement);
}

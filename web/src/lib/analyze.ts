// Pure text-analysis helpers. No DOM, no React — easy to unit test.

import { STOP_WORDS } from "./stopwords";

export interface Stats {
  chars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeSec: number;
  speakingTimeSec: number;
  uniqueWords: number;
  avgWordLength: number;
  avgSentenceLength: number;
  longestSentence: string;
  topWords: Array<[string, number]>;
  fleschKincaid: number;
}

const WORD_RE = /[\p{L}\p{N}']+/gu;
// Splits on terminal sentence punctuation (. ! ? plus Unicode equivalents).
const SENTENCE_SPLIT_RE = /[.!?…。！？]+\s+|[.!?…。！？]+$/u;

/** Tokenize into lowercase word array. */
export function tokenize(text: string): string[] {
  const matches = text.toLowerCase().match(WORD_RE);
  return matches ? Array.from(matches) : [];
}

/** Tokenize preserving original case (for "longest sentence" display, etc.). */
export function tokenizePreservingCase(text: string): string[] {
  const matches = text.match(WORD_RE);
  return matches ? Array.from(matches) : [];
}

export function countCharacters(text: string): { chars: number; charsNoSpaces: number } {
  // Use spread to count code points, not UTF-16 units.
  const chars = Array.from(text).length;
  const charsNoSpaces = Array.from(text).filter(c => !/\s/.test(c)).length;
  return { chars, charsNoSpaces };
}

export function countSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Split on sentence terminators followed by whitespace, or at end of string.
  const parts = trimmed
    .split(SENTENCE_SPLIT_RE)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  return parts;
}

export function countParagraphs(text: string): number {
  const paragraphs = text
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  return paragraphs.length;
}

export function countLines(text: string): number {
  if (text.length === 0) return 0;
  return text.split(/\r\n|\r|\n/).length;
}

/** Count syllables in a word using a simple heuristic. Good enough for FK score. */
export function syllablesInWord(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;

  // Strip silent trailing 'e' but keep 'le' endings.
  let s = w;
  if (s.endsWith("e") && !s.endsWith("le")) {
    s = s.slice(0, -1);
  }
  // Strip trailing 'ed' if preceded by a non-d/t (rough rule).
  if (s.endsWith("ed") && s.length > 2) {
    const pre = s.charAt(s.length - 3);
    if (pre !== "d" && pre !== "t") {
      s = s.slice(0, -2);
    }
  }

  const groups = s.match(/[aeiouy]+/g);
  const count = groups ? groups.length : 0;
  return Math.max(1, count);
}

export function totalSyllables(words: string[]): number {
  let total = 0;
  for (const w of words) total += syllablesInWord(w);
  return total;
}

/**
 * Flesch Reading Ease score.
 *   206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
 * Higher = easier. ~60-70 is plain English. Below 30 is very difficult.
 */
export function fleschReadingEase(text: string): number {
  const words = tokenize(text);
  const sentences = countSentences(text);
  if (words.length === 0 || sentences.length === 0) return 0;
  const syllables = totalSyllables(words);
  const score =
    206.835 -
    1.015 * (words.length / sentences.length) -
    84.6 * (syllables / words.length);
  return Math.round(score * 10) / 10;
}

export function wordFrequency(
  words: string[],
  options: { excludeStopWords?: boolean } = {},
): Map<string, number> {
  const freq = new Map<string, number>();
  for (const w of words) {
    if (options.excludeStopWords && STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return freq;
}

export function topN(freq: Map<string, number>, n: number): Array<[string, number]> {
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n);
}

export function analyze(text: string): Stats {
  const { chars, charsNoSpaces } = countCharacters(text);
  const wordsArr = tokenize(text);
  const sentencesArr = countSentences(text);
  const words = wordsArr.length;
  const sentences = sentencesArr.length;
  const paragraphs = countParagraphs(text);
  const lines = countLines(text);

  const totalLetterCount = wordsArr.reduce((acc, w) => acc + Array.from(w).length, 0);
  const avgWordLength = words > 0 ? totalLetterCount / words : 0;
  const avgSentenceLength = sentences > 0 ? words / sentences : 0;

  let longestSentence = "";
  for (const s of sentencesArr) {
    if (s.length > longestSentence.length) longestSentence = s;
  }

  const freqAll = wordFrequency(wordsArr, { excludeStopWords: false });
  const freqContent = wordFrequency(wordsArr, { excludeStopWords: true });
  const topWords = topN(freqContent, 5);

  const readingTimeSec = words > 0 ? Math.max(1, Math.round((words / 200) * 60)) : 0;
  const speakingTimeSec = words > 0 ? Math.max(1, Math.round((words / 150) * 60)) : 0;

  return {
    chars,
    charsNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTimeSec,
    speakingTimeSec,
    uniqueWords: freqAll.size,
    avgWordLength,
    avgSentenceLength,
    longestSentence,
    topWords,
    fleschKincaid: fleschReadingEase(text),
  };
}

export function formatTime(sec: number): string {
  if (sec <= 0) return "0s";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm > 0 ? `${h}h ${mm}m` : `${h}h`;
}

/** Reading difficulty band (Flesch ease). */
export function readingLevelLabel(score: number): string {
  if (score >= 90) return "Very easy (5th grade)";
  if (score >= 80) return "Easy (6th grade)";
  if (score >= 70) return "Fairly easy (7th grade)";
  if (score >= 60) return "Plain English (8–9th grade)";
  if (score >= 50) return "Fairly difficult (10–12th grade)";
  if (score >= 30) return "Difficult (college)";
  return "Very difficult (graduate)";
}

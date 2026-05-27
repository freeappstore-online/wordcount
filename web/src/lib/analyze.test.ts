import { describe, it, expect } from "vitest";
import {
  analyze,
  countCharacters,
  countLines,
  countParagraphs,
  countSentences,
  fleschReadingEase,
  syllablesInWord,
  tokenize,
  topN,
  wordFrequency,
  formatTime,
} from "./analyze";

describe("tokenize", () => {
  it("returns empty for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });
  it("splits words and lowercases", () => {
    expect(tokenize("Hello, World!")).toEqual(["hello", "world"]);
  });
  it("keeps contractions", () => {
    expect(tokenize("don't stop")).toEqual(["don't", "stop"]);
  });
  it("handles unicode letters", () => {
    expect(tokenize("Café déjà vu")).toEqual(["café", "déjà", "vu"]);
  });
});

describe("countCharacters", () => {
  it("counts code points, not UTF-16 units", () => {
    const { chars, charsNoSpaces } = countCharacters("a😀 b");
    expect(chars).toBe(4);
    expect(charsNoSpaces).toBe(3);
  });
  it("zero on empty", () => {
    expect(countCharacters("")).toEqual({ chars: 0, charsNoSpaces: 0 });
  });
});

describe("countSentences", () => {
  it("splits on terminal punctuation", () => {
    const s = countSentences("Hi. How are you? Fine!");
    expect(s.length).toBe(3);
  });
  it("handles ellipses", () => {
    const s = countSentences("Wait… really?");
    expect(s.length).toBe(2);
  });
  it("ignores trailing whitespace", () => {
    expect(countSentences("One. Two.   ")).toHaveLength(2);
  });
  it("zero on whitespace-only", () => {
    expect(countSentences("   \n  ")).toEqual([]);
  });
});

describe("countParagraphs", () => {
  it("splits on blank lines", () => {
    expect(countParagraphs("a\n\nb\n\nc")).toBe(3);
  });
  it("treats single newlines as one paragraph", () => {
    expect(countParagraphs("line1\nline2")).toBe(1);
  });
  it("zero on empty", () => {
    expect(countParagraphs("")).toBe(0);
  });
});

describe("countLines", () => {
  it("counts one per newline", () => {
    expect(countLines("a\nb\nc")).toBe(3);
  });
  it("returns 0 on empty", () => {
    expect(countLines("")).toBe(0);
  });
  it("handles CRLF", () => {
    expect(countLines("a\r\nb")).toBe(2);
  });
});

describe("syllablesInWord", () => {
  it("short words = 1", () => {
    expect(syllablesInWord("cat")).toBe(1);
  });
  it("multi-syllable words", () => {
    expect(syllablesInWord("syllable")).toBeGreaterThanOrEqual(2);
    expect(syllablesInWord("hello")).toBeGreaterThanOrEqual(2);
  });
  it("trims trailing silent e", () => {
    expect(syllablesInWord("make")).toBe(1);
  });
  it("preserves 'le' ending", () => {
    expect(syllablesInWord("table")).toBeGreaterThanOrEqual(2);
  });
});

describe("fleschReadingEase", () => {
  it("zero on empty input", () => {
    expect(fleschReadingEase("")).toBe(0);
  });
  it("produces a numeric score for prose", () => {
    const text = "The cat sat on the mat. The dog ran fast.";
    const score = fleschReadingEase(text);
    expect(Number.isFinite(score)).toBe(true);
    expect(score).toBeGreaterThan(50); // simple prose -> easy
  });
});

describe("wordFrequency / topN", () => {
  it("counts by word", () => {
    const f = wordFrequency(["a", "b", "a", "c", "a", "b"]);
    expect(f.get("a")).toBe(3);
    expect(f.get("b")).toBe(2);
    expect(f.get("c")).toBe(1);
  });
  it("excludes stop words when asked", () => {
    const f = wordFrequency(["the", "cat", "the", "mat"], { excludeStopWords: true });
    expect(f.has("the")).toBe(false);
    expect(f.get("cat")).toBe(1);
  });
  it("topN sorts by count desc then alpha", () => {
    const f = new Map([["b", 2], ["a", 2], ["c", 1]]);
    expect(topN(f, 2)).toEqual([["a", 2], ["b", 2]]);
  });
});

describe("analyze", () => {
  it("empty text yields zero stats", () => {
    const s = analyze("");
    expect(s.words).toBe(0);
    expect(s.chars).toBe(0);
    expect(s.sentences).toBe(0);
    expect(s.paragraphs).toBe(0);
    expect(s.uniqueWords).toBe(0);
  });

  it("aggregates simple paragraph", () => {
    const text = "Hello world. Hello again.\n\nSecond paragraph here.";
    const s = analyze(text);
    expect(s.words).toBe(7);
    expect(s.sentences).toBe(3);
    expect(s.paragraphs).toBe(2);
    expect(s.uniqueWords).toBe(6); // hello, world, again, second, paragraph, here
    expect(s.readingTimeSec).toBeGreaterThan(0);
    expect(s.speakingTimeSec).toBeGreaterThan(0);
  });

  it("longest sentence is returned", () => {
    const s = analyze("Short. A much longer sentence right here.");
    expect(s.longestSentence).toContain("longer");
  });
});

describe("formatTime", () => {
  it("seconds", () => {
    expect(formatTime(30)).toBe("30s");
  });
  it("minutes", () => {
    expect(formatTime(60)).toBe("1m");
    expect(formatTime(75)).toBe("1m 15s");
  });
  it("hours", () => {
    expect(formatTime(3600)).toBe("1h");
    expect(formatTime(3725)).toBe("1h 2m");
  });
  it("zero", () => {
    expect(formatTime(0)).toBe("0s");
  });
});

import { describe, it, expect } from "vitest";
import {
  toUpper,
  toLower,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  reverseText,
  removeExtraSpaces,
  removeLineBreaks,
  sortLinesAsc,
  sortLinesDesc,
  sortLinesByLength,
  dedupeLines,
  reverseLines,
  removeHtmlTags,
  extractUrls,
  extractEmails,
  extractNumbers,
  countMatches,
  replaceAll,
} from "./transforms";

describe("case transforms", () => {
  it("upper / lower", () => {
    expect(toUpper("Hi")).toBe("HI");
    expect(toLower("HI")).toBe("hi");
  });
  it("title case", () => {
    expect(toTitleCase("hello world")).toBe("Hello World");
    expect(toTitleCase("don't stop")).toBe("Don't Stop");
  });
  it("sentence case", () => {
    expect(toSentenceCase("hello world. how are you?")).toBe("Hello world. How are you?");
  });
  it("camelCase", () => {
    expect(toCamelCase("hello world foo")).toBe("helloWorldFoo");
  });
  it("snake_case", () => {
    expect(toSnakeCase("Hello World")).toBe("hello_world");
  });
  it("kebab-case", () => {
    expect(toKebabCase("Hello World")).toBe("hello-world");
  });
});

describe("reverseText", () => {
  it("reverses ASCII", () => {
    expect(reverseText("abc")).toBe("cba");
  });
  it("preserves emoji code points", () => {
    expect(reverseText("a😀b")).toBe("b😀a");
  });
});

describe("space / linebreak cleanup", () => {
  it("collapses multiple spaces", () => {
    expect(removeExtraSpaces("hello    world")).toBe("hello world");
  });
  it("removes line breaks", () => {
    expect(removeLineBreaks("a\nb\nc")).toBe("a b c");
  });
});

describe("line ops", () => {
  it("sortLinesAsc", () => {
    expect(sortLinesAsc("b\na\nc")).toBe("a\nb\nc");
  });
  it("sortLinesDesc", () => {
    expect(sortLinesDesc("a\nc\nb")).toBe("c\nb\na");
  });
  it("sortLinesByLength", () => {
    expect(sortLinesByLength("aaa\na\naa")).toBe("a\naa\naaa");
  });
  it("dedupeLines preserves order", () => {
    expect(dedupeLines("a\nb\na\nc\nb")).toBe("a\nb\nc");
  });
  it("reverseLines", () => {
    expect(reverseLines("a\nb\nc")).toBe("c\nb\na");
  });
});

describe("cleanup / extract", () => {
  it("removes HTML tags", () => {
    expect(removeHtmlTags("<p>hi <b>there</b></p>")).toBe("hi there");
  });
  it("extracts URLs", () => {
    const urls = extractUrls("see https://example.com and http://foo.bar/path?x=1");
    expect(urls).toContain("https://example.com");
    expect(urls.length).toBe(2);
  });
  it("extracts emails", () => {
    const emails = extractEmails("a@b.com and X@Y.io plus invalid@nope");
    expect(emails).toContain("a@b.com");
    expect(emails).toContain("X@Y.io");
  });
  it("extracts numbers", () => {
    const nums = extractNumbers("buy 3 apples for 4.50 dollars, save -1.2");
    expect(nums).toEqual(["3", "4.50", "-1.2"]);
  });
});

describe("find & replace", () => {
  it("counts case-insensitive matches by default", () => {
    expect(countMatches("Foo foo FOO", "foo", { caseSensitive: false, regex: false })).toBe(3);
  });
  it("counts case-sensitive matches", () => {
    expect(countMatches("Foo foo FOO", "foo", { caseSensitive: true, regex: false })).toBe(1);
  });
  it("regex mode counts captures", () => {
    expect(countMatches("a1 b2 c3", "\\d", { caseSensitive: false, regex: true })).toBe(3);
  });
  it("replaceAll respects case", () => {
    expect(replaceAll("Foo foo", "foo", "bar", { caseSensitive: false, regex: false }))
      .toBe("bar bar");
    expect(replaceAll("Foo foo", "foo", "bar", { caseSensitive: true, regex: false }))
      .toBe("Foo bar");
  });
  it("invalid regex returns input unchanged", () => {
    expect(replaceAll("hi", "[", "X", { caseSensitive: false, regex: true })).toBe("hi");
  });
});

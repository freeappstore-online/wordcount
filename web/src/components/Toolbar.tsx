import { useState } from "react";
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
} from "../lib/transforms";
import { Button } from "./Button";
import { SectionCard } from "./SectionCard";

interface ToolbarProps {
  text: string;
  onChange: (next: string) => void;
}

type Action = { label: string; run: (t: string) => string };

const CASE_ACTIONS: readonly Action[] = [
  { label: "UPPER", run: toUpper },
  { label: "lower", run: toLower },
  { label: "Title", run: toTitleCase },
  { label: "Sentence", run: toSentenceCase },
  { label: "camelCase", run: toCamelCase },
  { label: "snake_case", run: toSnakeCase },
  { label: "kebab-case", run: toKebabCase },
  { label: "Reverse", run: reverseText },
  { label: "Trim spaces", run: removeExtraSpaces },
  { label: "No breaks", run: removeLineBreaks },
];

const LINE_ACTIONS: readonly Action[] = [
  { label: "Sort A→Z", run: sortLinesAsc },
  { label: "Sort Z→A", run: sortLinesDesc },
  { label: "By length", run: sortLinesByLength },
  { label: "Dedupe", run: dedupeLines },
  { label: "Reverse lines", run: reverseLines },
];

export function Toolbar({ text, onChange }: ToolbarProps) {
  const [extract, setExtract] = useState<string[] | null>(null);
  const [extractLabel, setExtractLabel] = useState<string>("");

  function runExtract(label: string, fn: (t: string) => string[]) {
    setExtract(fn(text));
    setExtractLabel(label);
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Text transforms">
        <div className="flex flex-wrap gap-1.5">
          {CASE_ACTIONS.map(a => (
            <Button key={a.label} onClick={() => onChange(a.run(text))} disabled={text.length === 0}>
              {a.label}
            </Button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Line tools">
        <div className="flex flex-wrap gap-1.5">
          {LINE_ACTIONS.map(a => (
            <Button key={a.label} onClick={() => onChange(a.run(text))} disabled={text.length === 0}>
              {a.label}
            </Button>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Clean up & extract"
        action={
          extract && (
            <button
              type="button"
              onClick={() => setExtract(null)}
              className="text-[11px] underline"
              style={{ color: "var(--muted)" }}
            >
              clear
            </button>
          )
        }
      >
        <div className="flex flex-wrap gap-1.5">
          <Button onClick={() => onChange(removeHtmlTags(text))} disabled={text.length === 0}>
            Strip HTML
          </Button>
          <Button onClick={() => runExtract("URLs", extractUrls)} disabled={text.length === 0}>
            Extract URLs
          </Button>
          <Button onClick={() => runExtract("Emails", extractEmails)} disabled={text.length === 0}>
            Extract emails
          </Button>
          <Button onClick={() => runExtract("Numbers", extractNumbers)} disabled={text.length === 0}>
            Extract numbers
          </Button>
        </div>
        {extract && (
          <div className="mt-3">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>
              {extractLabel} — {extract.length} found
            </div>
            {extract.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--muted)" }}>None.</p>
            ) : (
              <ul
                className="mono text-xs rounded-md p-2 max-h-40 overflow-auto"
                style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
              >
                {extract.map((item, i) => (
                  <li key={i} className="truncate" style={{ color: "var(--ink)" }}>{item}</li>
                ))}
              </ul>
            )}
            {extract.length > 0 && (
              <div className="mt-2 flex gap-1.5">
                <Button onClick={() => onChange(extract.join("\n"))}>
                  Replace text with results
                </Button>
                <Button
                  onClick={() => {
                    void navigator.clipboard?.writeText(extract.join("\n"));
                  }}
                >
                  Copy results
                </Button>
              </div>
            )}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

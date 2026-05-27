import { useState } from "react";
import type { Snippet } from "../lib/snippets";
import { Button } from "./Button";
import { SectionCard } from "./SectionCard";

interface SnippetLibraryProps {
  snippets: Snippet[];
  currentText: string;
  onSave: (name: string) => void;
  onLoad: (s: Snippet) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

export function SnippetLibrary({
  snippets,
  currentText,
  onSave,
  onLoad,
  onDelete,
  onUpdate,
}: SnippetLibraryProps) {
  const [name, setName] = useState("");

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed || currentText.length === 0) return;
    onSave(trimmed);
    setName("");
  }

  return (
    <SectionCard title={`Saved snippets (${snippets.length})`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSave();
          }}
          placeholder="Snippet name…"
          className="flex-1 rounded-md px-2.5 py-1.5 text-sm focus:outline-none"
          style={{
            background: "var(--paper)",
            color: "var(--ink)",
            border: "1px solid var(--line)",
          }}
        />
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={name.trim() === "" || currentText.length === 0}
        >
          Save
        </Button>
      </div>

      {snippets.length === 0 ? (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Save text snippets to come back to later. All stored locally in your browser.
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {snippets.map(s => (
            <li
              key={s.id}
              className="rounded-lg px-3 py-2 group"
              style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            >
              <div className="flex items-baseline justify-between gap-2">
                <button
                  type="button"
                  className="text-left text-sm font-medium truncate hover:underline"
                  style={{ color: "var(--ink)" }}
                  onClick={() => onLoad(s)}
                  title="Load into editor"
                >
                  {s.name}
                </button>
                <div className="flex shrink-0 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => onUpdate(s.id)}
                    className="hover:underline"
                    style={{ color: "var(--muted)" }}
                    title="Overwrite with current editor text"
                  >
                    update
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(s.id)}
                    className="hover:underline"
                    style={{ color: "var(--error)" }}
                  >
                    delete
                  </button>
                </div>
              </div>
              <div
                className="mt-0.5 text-[11px] truncate"
                style={{ color: "var(--muted)" }}
              >
                {s.text.slice(0, 80).replace(/\s+/g, " ") || "(empty)"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

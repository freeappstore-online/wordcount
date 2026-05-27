import { useEffect, useRef } from "react";

interface EditorProps {
  value: string;
  onChange: (next: string) => void;
  mono: boolean;
}

export function Editor({ value, onChange, mono }: EditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow to fit content (capped by parent height via overflow).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(240, el.scrollHeight)}px`;
  }, [value, mono]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Paste or type your text here…"
      spellCheck
      className={`w-full rounded-xl px-4 py-3 text-base leading-relaxed focus:outline-none resize-none ${mono ? "mono" : ""}`}
      style={{
        background: "var(--panel)",
        color: "var(--ink)",
        border: "1px solid var(--line)",
        minHeight: "240px",
      }}
    />
  );
}

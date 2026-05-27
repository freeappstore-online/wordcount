import { useCallback, useEffect, useMemo, useState } from "react";
import { Shell, type Tab } from "./components/Shell";
import { Editor } from "./components/Editor";
import { StatsPanel } from "./components/StatsPanel";
import { FrequencyTable } from "./components/FrequencyTable";
import { Toolbar } from "./components/Toolbar";
import { FindReplace } from "./components/FindReplace";
import { GoalBar, type GoalMode } from "./components/GoalBar";
import { SnippetLibrary } from "./components/SnippetLibrary";
import { Button } from "./components/Button";
import { analyze } from "./lib/analyze";
import {
  loadSnippets,
  newSnippetId,
  saveSnippets,
  type Snippet,
} from "./lib/snippets";

const TEXT_KEY = "wordcount:text:v1";
const TAB_KEY = "wordcount:tab:v1";
const MONO_KEY = "wordcount:mono:v1";
const GOAL_MODE_KEY = "wordcount:goalMode:v1";
const GOAL_TARGET_KEY = "wordcount:goalTarget:v1";

function loadString(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function loadNumber(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  } catch {
    return fallback;
  }
}

function loadBool(key: string, fallback: boolean): boolean {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "1";
  } catch {
    return fallback;
  }
}

function persist(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Quota or disabled; silently fail.
  }
}

export default function App() {
  const [text, setText] = useState<string>(() => loadString(TEXT_KEY, ""));
  const [tab, setTab] = useState<Tab>(() => {
    const raw = loadString(TAB_KEY, "stats");
    if (raw === "stats" || raw === "frequency" || raw === "tools" || raw === "snippets") {
      return raw;
    }
    return "stats";
  });
  const [mono, setMono] = useState<boolean>(() => loadBool(MONO_KEY, false));
  const [goalMode, setGoalMode] = useState<GoalMode>(() => {
    const raw = loadString(GOAL_MODE_KEY, "words");
    return raw === "chars" ? "chars" : "words";
  });
  const [goalTarget, setGoalTarget] = useState<number>(() => loadNumber(GOAL_TARGET_KEY, 500));
  const [snippets, setSnippets] = useState<Snippet[]>(loadSnippets);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");

  // Persistence.
  useEffect(() => { persist(TEXT_KEY, text); }, [text]);
  useEffect(() => { persist(TAB_KEY, tab); }, [tab]);
  useEffect(() => { persist(MONO_KEY, mono ? "1" : "0"); }, [mono]);
  useEffect(() => { persist(GOAL_MODE_KEY, goalMode); }, [goalMode]);
  useEffect(() => { persist(GOAL_TARGET_KEY, String(goalTarget)); }, [goalTarget]);
  useEffect(() => { saveSnippets(snippets); }, [snippets]);

  const stats = useMemo(() => analyze(text), [text]);

  const goalCurrent = goalMode === "words" ? stats.words : stats.chars;

  // ----- Clipboard / file actions -----
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("ok");
    } catch {
      setCopyState("err");
    }
    setTimeout(() => setCopyState("idle"), 1500);
  }, [text]);

  const handlePaste = useCallback(async () => {
    try {
      const v = await navigator.clipboard.readText();
      setText(prev => prev + v);
    } catch {
      // Permission denied; no-op.
    }
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wordcount.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [text]);

  const handleClear = useCallback(() => {
    if (text.length === 0) return;
    if (confirm("Clear all text?")) setText("");
  }, [text]);

  // ----- Snippets -----
  const handleSaveSnippet = useCallback((name: string) => {
    const now = Date.now();
    const s: Snippet = {
      id: newSnippetId(),
      name,
      text,
      createdAt: now,
      updatedAt: now,
    };
    setSnippets(prev => [s, ...prev]);
  }, [text]);

  const handleLoadSnippet = useCallback((s: Snippet) => {
    setText(s.text);
  }, []);

  const handleDeleteSnippet = useCallback((id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleUpdateSnippet = useCallback((id: string) => {
    setSnippets(prev =>
      prev.map(s => (s.id === id ? { ...s, text, updatedAt: Date.now() } : s)),
    );
  }, [text]);

  // ----- Top actions -----
  const topActions = (
    <>
      <label
        className="flex items-center gap-1.5 text-[11px] cursor-pointer select-none"
        style={{ color: "var(--muted)" }}
        title="Use a monospace font in the editor"
      >
        <input
          type="checkbox"
          checked={mono}
          onChange={e => setMono(e.target.checked)}
        />
        Mono
      </label>
      <Button onClick={handlePaste}>Paste</Button>
      <Button onClick={handleCopy}>
        {copyState === "ok" ? "Copied!" : copyState === "err" ? "Copy failed" : "Copy"}
      </Button>
      <Button onClick={handleDownload} disabled={text.length === 0}>
        Download
      </Button>
      <Button variant="danger" onClick={handleClear} disabled={text.length === 0}>
        Clear
      </Button>
    </>
  );

  // ----- Side panel content (per tab) -----
  let sideContent;
  if (tab === "stats") {
    sideContent = (
      <div className="flex flex-col gap-4">
        <GoalBar
          mode={goalMode}
          target={goalTarget}
          current={goalCurrent}
          onModeChange={setGoalMode}
          onTargetChange={setGoalTarget}
        />
        <StatsPanel stats={stats} />
      </div>
    );
  } else if (tab === "frequency") {
    sideContent = <FrequencyTable text={text} />;
  } else if (tab === "tools") {
    sideContent = (
      <div className="flex flex-col gap-4">
        <FindReplace text={text} onChange={setText} />
        <Toolbar text={text} onChange={setText} />
      </div>
    );
  } else {
    sideContent = (
      <SnippetLibrary
        snippets={snippets}
        currentText={text}
        onSave={handleSaveSnippet}
        onLoad={handleLoadSnippet}
        onDelete={handleDeleteSnippet}
        onUpdate={handleUpdateSnippet}
      />
    );
  }

  return (
    <Shell
      tab={tab}
      onTabChange={setTab}
      topActions={topActions}
      editor={<Editor value={text} onChange={setText} mono={mono} />}
      side={sideContent}
    />
  );
}

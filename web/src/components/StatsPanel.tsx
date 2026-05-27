import type { Stats } from "../lib/analyze";
import { formatTime, readingLevelLabel } from "../lib/analyze";
import { StatCard } from "./StatCard";
import { SectionCard } from "./SectionCard";

interface StatsPanelProps {
  stats: Stats;
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Live stats">
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Characters" value={stats.chars.toLocaleString()} hint="with spaces" />
          <StatCard label="Characters" value={stats.charsNoSpaces.toLocaleString()} hint="no spaces" />
          <StatCard label="Words" value={stats.words.toLocaleString()} />
          <StatCard label="Sentences" value={stats.sentences.toLocaleString()} />
          <StatCard label="Paragraphs" value={stats.paragraphs.toLocaleString()} />
          <StatCard label="Lines" value={stats.lines.toLocaleString()} />
          <StatCard label="Reading" value={formatTime(stats.readingTimeSec)} hint="200 wpm" />
          <StatCard label="Speaking" value={formatTime(stats.speakingTimeSec)} hint="150 wpm" />
          <StatCard label="Unique words" value={stats.uniqueWords.toLocaleString()} />
          <StatCard
            label="Avg word"
            value={stats.avgWordLength.toFixed(1)}
            hint="characters"
          />
          <StatCard
            label="Avg sentence"
            value={stats.avgSentenceLength.toFixed(1)}
            hint="words"
          />
          <StatCard
            label="Flesch ease"
            value={stats.fleschKincaid.toFixed(1)}
            hint={readingLevelLabel(stats.fleschKincaid)}
          />
        </div>
      </SectionCard>

      {stats.topWords.length > 0 && (
        <SectionCard title="Most common (top 5, excl. stop words)">
          <ul className="flex flex-col gap-1">
            {stats.topWords.map(([word, count]) => (
              <li
                key={word}
                className="flex items-baseline justify-between text-sm"
              >
                <span className="font-medium" style={{ color: "var(--ink)" }}>
                  {word}
                </span>
                <span className="tabular-nums" style={{ color: "var(--muted)" }}>
                  {count}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {stats.longestSentence && (
        <SectionCard title="Longest sentence">
          <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>
            {stats.longestSentence}
          </p>
          <p className="mt-1.5 text-[11px]" style={{ color: "var(--muted)" }}>
            {stats.longestSentence.length} chars
          </p>
        </SectionCard>
      )}
    </div>
  );
}

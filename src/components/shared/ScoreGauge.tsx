import type { ReactNode } from "react";

export type ScoreGaugeTone = "neutral" | "positive" | "attention" | "critical";

interface ScoreGaugeProps {
  title: string;
  value?: number;
  supportingText: ReactNode;
  tone?: ScoreGaugeTone;
  testId?: string;
}

const toneStyles: Record<ScoreGaugeTone, { stroke: string; text: string }> = {
  neutral: { stroke: "#737373", text: "text-neutral-700" },
  positive: { stroke: "#65a30d", text: "text-secondary-700" },
  attention: { stroke: "#f97316", text: "text-status-orange" },
  critical: { stroke: "#dc425f", text: "text-primary-700" },
};

/**
 * Compact, truth-agnostic gauge for a supplied score. Callers own both the
 * interpretation and tone; this primitive intentionally has no thresholds or
 * outcome language.
 */
export function ScoreGauge({
  title,
  value,
  supportingText,
  tone = "neutral",
  testId,
}: ScoreGaugeProps) {
  const resolvedValue = value === undefined ? undefined : Math.max(0, Math.min(100, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.7;
  const progress = resolvedValue === undefined ? 0 : arcLength * (resolvedValue / 100);
  const palette = toneStyles[tone];

  return (
    <article className="flex min-h-[250px] flex-col rounded-xl bg-neutral-50 p-5" data-testid={testId}>
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
      <div className="relative mx-auto mt-2 h-32 w-40" role="img" aria-label={resolvedValue === undefined ? `${title}: unavailable` : `${title}: ${Math.round(resolvedValue)}%`}>
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform="rotate(144 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={palette.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            transform="rotate(144 50 50)"
          />
        </svg>
        <div className={`absolute inset-0 flex items-center justify-center pt-5 text-3xl font-semibold ${palette.text}`}>
          {resolvedValue === undefined ? "—" : `${Math.round(resolvedValue)}%`}
        </div>
      </div>
      <p className="mt-auto text-xs leading-5 text-neutral-600">{supportingText}</p>
    </article>
  );
}

export default ScoreGauge;

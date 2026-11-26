import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Grid3X3,
  Layers3,
  LineChart as LineChartIcon,
  Radar,
  WalletCards,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type {
  ComparisonBarsVisual,
  HeatmapCell,
  HeatmapVisual,
  InsightVisualSelection,
  InsightVisualSpec,
  InsightVisualTone,
  PriorityEvidenceVisual,
  SignalWatchlistRow,
  SignalWatchlistVisual,
  StageFunnelVisual,
  TrendLineVisual,
  TrendSeries,
  ValueBridgeVisual,
} from "@/types/insightVisual";

interface InsightVisualProps {
  spec: InsightVisualSpec;
  className?: string;
  compact?: boolean;
  showHeader?: boolean;
  onSelect?: (selection: InsightVisualSelection) => void;
}

const toneClasses: Record<
  InsightVisualTone,
  {
    text: string;
    soft: string;
    bar: string;
    border: string;
    ring: string;
  }
> = {
  critical: {
    text: "text-primary-600",
    soft: "bg-primary-50",
    bar: "bg-primary-500",
    border: "border-primary-200",
    ring: "ring-primary-100",
  },
  attention: {
    text: "text-amber-700",
    soft: "bg-amber-50",
    bar: "bg-amber-500",
    border: "border-amber-200",
    ring: "ring-amber-100",
  },
  positive: {
    text: "text-secondary-700",
    soft: "bg-secondary-50",
    bar: "bg-secondary-500",
    border: "border-secondary-200",
    ring: "ring-secondary-100",
  },
  info: {
    text: "text-blue-700",
    soft: "bg-blue-50",
    bar: "bg-blue-500",
    border: "border-blue-200",
    ring: "ring-blue-100",
  },
  neutral: {
    text: "text-neutral-700",
    soft: "bg-neutral-100",
    bar: "bg-neutral-700",
    border: "border-neutral-200",
    ring: "ring-neutral-100",
  },
};

function resolvedTone(tone?: InsightVisualTone) {
  return toneClasses[tone ?? "neutral"];
}

function visualIcon(type: InsightVisualSpec["type"]) {
  switch (type) {
    case "signal_watchlist":
      return <Radar className="h-5 w-5" />;
    case "priority_evidence":
      return <Gauge className="h-5 w-5" />;
    case "comparison_bars":
      return <BarChart3 className="h-5 w-5" />;
    case "trend_line":
      return <LineChartIcon className="h-5 w-5" />;
    case "heatmap":
      return <Grid3X3 className="h-5 w-5" />;
    case "stage_funnel":
      return <Layers3 className="h-5 w-5" />;
    case "value_bridge":
      return <WalletCards className="h-5 w-5" />;
  }
}

function formatValue(value: number, unit?: string, currency = "USD") {
  if (unit === "currency" || unit === "$" || unit === "money") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) < 10 && value % 1 !== 0 ? 1 : 0,
  }).format(value);
  if (!unit || unit === "count" || unit === "score") return formatted;
  if (unit === "%") return `${formatted}%`;
  return `${formatted}${unit}`;
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function Sparkline({
  values,
  tone = "neutral",
}: {
  values: number[];
  tone?: InsightVisualTone;
}) {
  const points = values.length > 1 ? values : [values[0] ?? 0, values[0] ?? 0];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = Math.max(1, max - min);
  const path = points
    .map((value, index) => {
      const x = (index / Math.max(1, points.length - 1)) * 112;
      const y = 34 - ((value - min) / range) * 28;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 112 40"
      className={cn("h-10 w-28", resolvedTone(tone).text)}
      role="img"
      aria-label={`Trend from ${points[0]} to ${points.at(-1)}`}
    >
      <path d={path} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle
        cx="112"
        cy={34 - ((points.at(-1)! - min) / range) * 28}
        r="3.5"
        fill="currentColor"
      />
    </svg>
  );
}

function VisualHeader({ spec, compact }: { spec: InsightVisualSpec; compact: boolean }) {
  const palette = resolvedTone(spec.tone);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl",
            compact ? "h-9 w-9" : "h-11 w-11",
            palette.soft,
            palette.text,
          )}
        >
          {visualIcon(spec.type)}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">
            {spec.type.replace(/_/g, " ")}
          </p>
          <h4 className={cn("mt-1 font-semibold text-neutral-900", compact ? "text-sm" : "text-base")}>
            {spec.title}
          </h4>
          {spec.subtitle && (
            <p className="mt-1 text-xs leading-5 text-neutral-600">{spec.subtitle}</p>
          )}
        </div>
      </div>
      {spec.metadata?.maturity && (
        <span className="w-fit rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-semibold text-neutral-600">
          {spec.metadata.maturity.replace(/_/g, " ")}
        </span>
      )}
    </div>
  );
}

function MetadataFooter({ spec }: { spec: InsightVisualSpec }) {
  const metadata = spec.metadata;
  if (!metadata) return null;
  const hasContent =
    metadata.formula ||
    metadata.denominator ||
    metadata.source ||
    (metadata.limitations?.length ?? 0) > 0;
  if (!hasContent) return null;
  return (
    <div className="mt-4 border-t border-neutral-100 pt-3 text-[11px] leading-5 text-neutral-500">
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {metadata.denominator && <span>Scope: {metadata.denominator}</span>}
        {metadata.source && <span>Source: {metadata.source.replace(/_/g, " ")}</span>}
        {metadata.formula && <span>Method: {metadata.formula}</span>}
      </div>
      {metadata.limitations?.length ? (
        <p className="mt-1">Limit: {metadata.limitations.join(" ")}</p>
      ) : null}
    </div>
  );
}

function SignalRow({
  row,
  selected,
  onSelect,
}: {
  row: SignalWatchlistRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const palette = resolvedTone(row.tone);
  const maximum = Math.max(row.max ?? 100, row.value, row.target ?? 0, row.baseline ?? 0, 1);
  const valueWidth = clampPercent((row.value / maximum) * 100);
  const targetPosition = row.target == null ? null : clampPercent((row.target / maximum) * 100);
  const trendIcon =
    row.trend === "up" ? (
      <ArrowUpRight className="h-3.5 w-3.5" />
    ) : row.trend === "down" ? (
      <ArrowDownRight className="h-3.5 w-3.5" />
    ) : (
      <ArrowRight className="h-3.5 w-3.5" />
    );
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-2xl border bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4",
        selected ? cn(palette.border, palette.ring) : "border-neutral-100 focus-visible:ring-neutral-100",
      )}
      data-visual-row={row.id}
    >
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-neutral-900">{row.label}</p>
            {row.status && (
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", palette.soft, palette.text)}>
                {row.status}
              </span>
            )}
          </div>
          {row.detail && <p className="mt-1 text-xs leading-5 text-neutral-600">{row.detail}</p>}
          <div className="relative mt-3 h-2 overflow-visible rounded-full bg-neutral-100">
            <div className={cn("h-full rounded-full", palette.bar)} style={{ width: `${valueWidth}%` }} />
            {targetPosition != null && (
              <span
                className="absolute -top-1 h-4 w-0.5 rounded bg-neutral-900"
                style={{ left: `${targetPosition}%` }}
                title={`Target ${formatValue(row.target!, row.unit)}`}
              />
            )}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-neutral-400">
            <span>{row.baseline != null ? `Baseline ${formatValue(row.baseline, row.unit)}` : "Current scope"}</span>
            {row.target != null && <span>Target {formatValue(row.target, row.unit)}</span>}
          </div>
        </div>
        {row.series?.length ? <Sparkline values={row.series} tone={row.tone} /> : <div />}
        <div className="min-w-[88px] text-right">
          <p className={cn("text-2xl font-semibold", palette.text)}>{formatValue(row.value, row.unit)}</p>
          <div className={cn("mt-1 inline-flex items-center gap-1 text-[10px] font-semibold", palette.text)}>
            {trendIcon}
            {row.evidenceCount != null ? `${row.evidenceCount} evidence` : row.trend ?? "observed"}
          </div>
        </div>
      </div>
    </button>
  );
}

function SignalWatchlist({
  spec,
  selectedId,
  onSelect,
}: {
  spec: SignalWatchlistVisual;
  selectedId: string | null;
  onSelect: (row: SignalWatchlistRow) => void;
}) {
  return (
    <div className="space-y-3">
      {spec.rows.map((row) => (
        <SignalRow
          key={row.id}
          row={row}
          selected={selectedId === row.id}
          onSelect={() => onSelect(row)}
        />
      ))}
    </div>
  );
}

function RadialGauge({ score, tone }: { score: number; tone?: InsightVisualTone }) {
  const palette = resolvedTone(tone);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progress = clampPercent(score);
  const dashOffset = circumference - (progress / 100) * circumference;
  return (
    <div className={cn("relative flex h-36 w-36 items-center justify-center", palette.text)}>
      <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90" aria-label={`Priority score ${progress} out of 100`}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-bold text-neutral-950">{progress}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">priority</p>
      </div>
    </div>
  );
}

function PriorityEvidence({ spec }: { spec: PriorityEvidenceVisual }) {
  const palette = resolvedTone(spec.tone);
  const affectedPercent = spec.totalCount
    ? Math.round((spec.affectedCount / spec.totalCount) * 100)
    : 0;
  const metrics = [
    { label: "Affected", value: `${spec.affectedCount}/${spec.totalCount}`, detail: `${affectedPercent}% of scope` },
    { label: "Direct evidence", value: String(spec.evidenceCount), detail: "linked interactions" },
    { label: "Teams", value: String(spec.teamCount), detail: "represented owners" },
    { label: "Resolved", value: String(spec.resolvedCount ?? 0), detail: "journeys in scope" },
  ];
  return (
    <div className="grid gap-5 lg:grid-cols-[180px_minmax(0,1fr)]">
      <div className={cn("flex flex-col items-center justify-center rounded-2xl border p-4", palette.soft, palette.border)}>
        <RadialGauge score={spec.priorityScore} tone={spec.tone} />
        <p className={cn("mt-1 text-center text-sm font-semibold", palette.text)}>
          {spec.priorityLabel ?? "Evidence priority"}
        </p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">{metric.label}</p>
              <p className="mt-1 text-xl font-semibold text-neutral-950">{metric.value}</p>
              <p className="mt-1 text-[10px] text-neutral-500">{metric.detail}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Evidence prevalence</span>
            <span>{affectedPercent}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
            <div className={cn("h-full rounded-full", palette.bar)} style={{ width: `${clampPercent(affectedPercent)}%` }} />
          </div>
        </div>
        {spec.steps?.length ? (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {spec.steps.map((step) => {
              const stateTone: InsightVisualTone =
                step.state === "complete" ? "positive" : step.state === "active" ? "attention" : "neutral";
              const statePalette = resolvedTone(stateTone);
              return (
                <div key={step.id} className={cn("rounded-xl border p-3", statePalette.soft, statePalette.border)}>
                  <div className="flex items-center gap-2">
                    {step.state === "complete" ? (
                      <CheckCircle2 className={cn("h-4 w-4", statePalette.text)} />
                    ) : step.state === "active" ? (
                      <Activity className={cn("h-4 w-4", statePalette.text)} />
                    ) : (
                      <CircleAlert className={cn("h-4 w-4", statePalette.text)} />
                    )}
                    <p className="text-xs font-semibold text-neutral-900">{step.label}</p>
                  </div>
                  {step.detail && <p className="mt-1 text-[10px] leading-4 text-neutral-600">{step.detail}</p>}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ComparisonBars({
  spec,
  selectedId,
  onSelect,
}: {
  spec: ComparisonBarsVisual;
  selectedId: string | null;
  onSelect: (row: ComparisonBarsVisual["rows"][number]) => void;
}) {
  const maximum = Math.max(
    1,
    ...spec.rows.flatMap((row) => [row.current, row.comparison ?? 0, row.target ?? 0]),
  );
  return (
    <div className="space-y-4">
      {spec.rows.map((row) => {
        const palette = resolvedTone(row.tone ?? spec.tone);
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelect(row)}
            aria-pressed={selectedId === row.id}
            className={cn(
              "w-full rounded-2xl border bg-white p-4 text-left transition hover:shadow-md focus-visible:outline-none focus-visible:ring-4",
              selectedId === row.id ? cn(palette.border, palette.ring) : "border-neutral-100 focus-visible:ring-neutral-100",
            )}
            data-visual-row={row.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-neutral-900">{row.label}</p>
                {row.detail && <p className="mt-1 text-xs leading-5 text-neutral-600">{row.detail}</p>}
              </div>
              <div className="text-right">
                <p className={cn("text-xl font-semibold", palette.text)}>{formatValue(row.current, row.unit)}</p>
                {row.comparison != null && (
                  <p className="text-[10px] text-neutral-500">
                    {row.comparisonLabel ?? "Comparison"}: {formatValue(row.comparison, row.unit)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div>
                <div className="mb-1 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{row.currentLabel ?? "Current"}</span>
                  <span>{formatValue(row.current, row.unit)}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div className={cn("h-full rounded-full", palette.bar)} style={{ width: `${clampPercent((row.current / maximum) * 100)}%` }} />
                </div>
              </div>
              {row.comparison != null && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-[10px] text-neutral-500">
                    <span>{row.comparisonLabel ?? "Reference"}</span>
                    <span>{formatValue(row.comparison, row.unit)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-neutral-400" style={{ width: `${clampPercent((row.comparison / maximum) * 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function seriesPath(series: TrendSeries, minimum: number, maximum: number) {
  const range = Math.max(1, maximum - minimum);
  return series.points
    .map((point, index) => {
      const x = 24 + (index / Math.max(1, series.points.length - 1)) * 312;
      const y = 118 - ((point.value - minimum) / range) * 88;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function TrendLine({ spec }: { spec: TrendLineVisual }) {
  const values = spec.series.flatMap((series) => series.points.map((point) => point.value));
  const minimum = spec.min ?? Math.min(...values, 0);
  const maximum = spec.max ?? Math.max(...values, 100);
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {spec.series.map((series) => {
          const palette = resolvedTone(series.tone ?? spec.tone);
          return (
            <span key={series.id} className="inline-flex items-center gap-2 text-xs text-neutral-600">
              <span className={cn("h-2.5 w-2.5 rounded-full", palette.bar)} />
              {series.label}
            </span>
          );
        })}
      </div>
      <svg viewBox="0 0 360 140" className="mt-3 h-44 w-full" role="img" aria-label={spec.title}>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="24" x2="336" y1={30 + line * 29} y2={30 + line * 29} stroke="currentColor" className="text-neutral-100" strokeWidth="1" />
        ))}
        {spec.series.map((series) => {
          const palette = resolvedTone(series.tone ?? spec.tone);
          const path = seriesPath(series, minimum, maximum);
          return (
            <g key={series.id} className={palette.text}>
              <path d={path} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              {series.points.map((point, index) => {
                const x = 24 + (index / Math.max(1, series.points.length - 1)) * 312;
                const y = 118 - ((point.value - minimum) / Math.max(1, maximum - minimum)) * 88;
                return <circle key={`${series.id}-${point.label}`} cx={x} cy={y} r="4" fill="currentColor" />;
              })}
            </g>
          );
        })}
      </svg>
      <div className="grid gap-1 text-[10px] text-neutral-400" style={{ gridTemplateColumns: `repeat(${Math.max(1, spec.series[0]?.points.length ?? 1)}, minmax(0, 1fr))` }}>
        {(spec.series[0]?.points ?? []).map((point) => (
          <span key={point.label} className="truncate text-center" title={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}

function cellPalette(cell: HeatmapCell, value: number, min: number, max: number) {
  if (cell.tone) return resolvedTone(cell.tone);
  const ratio = (value - min) / Math.max(1, max - min);
  if (ratio >= 0.75) return resolvedTone("positive");
  if (ratio >= 0.5) return resolvedTone("info");
  if (ratio >= 0.25) return resolvedTone("attention");
  return resolvedTone("critical");
}

function Heatmap({
  spec,
  selectedId,
  onSelect,
}: {
  spec: HeatmapVisual;
  selectedId: string | null;
  onSelect: (rowId: string, rowLabel: string, cell: HeatmapCell) => void;
}) {
  const values = spec.rows.flatMap((row) => row.cells.map((cell) => cell.value));
  const min = spec.min ?? Math.min(...values, 0);
  const max = spec.max ?? Math.max(...values, 100);
  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm">
      <div
        className="grid min-w-[560px] gap-2"
        style={{ gridTemplateColumns: `minmax(130px, 1.2fr) repeat(${spec.columns.length}, minmax(72px, 1fr))` }}
      >
        <div />
        {spec.columns.map((column) => (
          <div key={column} className="px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-neutral-400">
            {column}
          </div>
        ))}
        {spec.rows.flatMap((row) => [
          <div key={`${row.id}-label`} className="flex items-center rounded-lg bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-700">
            {row.label}
          </div>,
          ...spec.columns.map((column) => {
            const cell = row.cells.find((candidate) => candidate.column === column) ?? { column, value: 0 };
            const palette = cellPalette(cell, cell.value, min, max);
            const cellId = `${row.id}:${column}`;
            const highlighted =
              spec.highlightedCell?.rowId === row.id && spec.highlightedCell.column === column;
            return (
              <button
                key={cellId}
                type="button"
                onClick={() => onSelect(row.id, row.label, cell)}
                aria-pressed={selectedId === cellId}
                className={cn(
                  "rounded-lg border px-2 py-3 text-center text-xs font-bold transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4",
                  palette.soft,
                  palette.text,
                  highlighted || selectedId === cellId ? cn(palette.border, palette.ring) : "border-transparent focus-visible:ring-neutral-100",
                )}
                title={cell.detail ?? `${row.label} · ${column}: ${formatValue(cell.value, spec.unit)}`}
                data-visual-cell={cellId}
              >
                {formatValue(cell.value, spec.unit)}
              </button>
            );
          }),
        ])}
      </div>
    </div>
  );
}

function StageFunnel({
  spec,
  selectedId,
  onSelect,
}: {
  spec: StageFunnelVisual;
  selectedId: string | null;
  onSelect: (row: StageFunnelVisual["rows"][number]) => void;
}) {
  const maximum = Math.max(1, ...spec.rows.map((row) => Math.max(row.value, row.target ?? 0)));
  return (
    <div className="space-y-3">
      {spec.rows.map((row, index) => {
        const palette = resolvedTone(row.tone ?? spec.tone);
        const width = 58 + clampPercent((row.value / maximum) * 42);
        return (
          <button
            key={row.id}
            type="button"
            onClick={() => onSelect(row)}
            aria-pressed={selectedId === row.id}
            className="group flex w-full justify-center text-left focus-visible:outline-none"
            data-visual-row={row.id}
          >
            <div
              className={cn(
                "relative rounded-2xl border bg-white px-5 py-4 shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-4",
                selectedId === row.id ? cn(palette.border, palette.ring) : "border-neutral-100 group-focus-visible:ring-neutral-100",
              )}
              style={{ width: `${width}%` }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-400">Stage {index + 1}</p>
                  <p className="mt-1 truncate font-semibold text-neutral-900">{row.label}</p>
                  {row.detail && <p className="mt-1 line-clamp-2 text-xs text-neutral-600">{row.detail}</p>}
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", palette.text)}>{formatValue(row.value, row.unit)}</p>
                  {row.total != null && <p className="text-[10px] text-neutral-500">of {row.total}</p>}
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-neutral-100">
                <div className={cn("h-full rounded-full", palette.bar)} style={{ width: `${clampPercent((row.value / maximum) * 100)}%` }} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ValueBridge({ spec }: { spec: ValueBridgeVisual }) {
  const total = Math.max(1, spec.represented);
  const capturedPercent = clampPercent((spec.captured / total) * 100);
  const gapPercent = clampPercent((spec.opportunityGap / total) * 100);
  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Represented", value: spec.represented, tone: "neutral" as const },
          { label: "Captured", value: spec.captured, tone: "positive" as const },
          { label: "Opportunity gap", value: spec.opportunityGap, tone: "critical" as const },
        ].map((item) => {
          const palette = resolvedTone(item.tone);
          return (
            <div key={item.label} className={cn("rounded-xl p-4", palette.soft)}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{item.label}</p>
              <p className={cn("mt-1 text-xl font-semibold", palette.text)}>{formatValue(item.value, "currency", spec.currency)}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-5 overflow-hidden rounded-full bg-neutral-100">
        <div className="flex h-5">
          <div className="bg-secondary-500" style={{ width: `${capturedPercent}%` }} title={`Captured ${capturedPercent}%`} />
          <div className="bg-primary-500" style={{ width: `${gapPercent}%` }} title={`Opportunity gap ${gapPercent}%`} />
        </div>
      </div>
      {spec.detail && <p className="mt-3 text-xs leading-5 text-neutral-600">{spec.detail}</p>}
    </div>
  );
}

export function InsightVisual({
  spec,
  className,
  compact = false,
  showHeader = true,
  onSelect,
}: InsightVisualProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedDetail = useMemo(() => {
    if (!selectedId) return null;
    if (spec.type === "signal_watchlist") return spec.rows.find((row) => row.id === selectedId)?.detail;
    if (spec.type === "comparison_bars" || spec.type === "stage_funnel") {
      return spec.rows.find((row) => row.id === selectedId)?.detail;
    }
    if (spec.type === "heatmap") {
      const [rowId, column] = selectedId.split(":");
      return spec.rows.find((row) => row.id === rowId)?.cells.find((cell) => cell.column === column)?.detail;
    }
    return null;
  }, [selectedId, spec]);

  const select = (selection: InsightVisualSelection) => {
    setSelectedId(selection.id);
    onSelect?.(selection);
  };

  return (
    <section
      className={cn("rounded-2xl", className)}
      data-visual-type={spec.type}
      data-visual-schema={spec.schemaVersion}
    >
      {showHeader && <VisualHeader spec={spec} compact={compact} />}
      <div className={cn(showHeader ? "mt-4" : "", compact ? "space-y-3" : "space-y-4")}>
        {spec.type === "signal_watchlist" && (
          <SignalWatchlist
            spec={spec}
            selectedId={selectedId}
            onSelect={(row) =>
              select({
                visualType: spec.type,
                id: row.id,
                label: row.label,
                value: row.value,
                route: row.route,
                callIds: row.callIds,
                detail: row.detail,
              })
            }
          />
        )}
        {spec.type === "priority_evidence" && <PriorityEvidence spec={spec} />}
        {spec.type === "comparison_bars" && (
          <ComparisonBars
            spec={spec}
            selectedId={selectedId}
            onSelect={(row) =>
              select({
                visualType: spec.type,
                id: row.id,
                label: row.label,
                value: row.current,
                route: row.route,
                callIds: row.callIds,
                detail: row.detail,
              })
            }
          />
        )}
        {spec.type === "trend_line" && <TrendLine spec={spec} />}
        {spec.type === "heatmap" && (
          <Heatmap
            spec={spec}
            selectedId={selectedId}
            onSelect={(rowId, rowLabel, cell) =>
              select({
                visualType: spec.type,
                id: `${rowId}:${cell.column}`,
                label: `${rowLabel} · ${cell.column}`,
                value: cell.value,
                detail: cell.detail,
              })
            }
          />
        )}
        {spec.type === "stage_funnel" && (
          <StageFunnel
            spec={spec}
            selectedId={selectedId}
            onSelect={(row) =>
              select({
                visualType: spec.type,
                id: row.id,
                label: row.label,
                value: row.value,
                route: row.route,
                callIds: row.callIds,
                detail: row.detail,
              })
            }
          />
        )}
        {spec.type === "value_bridge" && <ValueBridge spec={spec} />}
      </div>
      {selectedDetail && (
        <p
          className="mt-3 rounded-xl bg-neutral-50 px-3 py-2 text-xs leading-5 text-neutral-600"
          data-visual-selected={selectedId ?? undefined}
        >
          {selectedDetail}
        </p>
      )}
      <MetadataFooter spec={spec} />
    </section>
  );
}

export default InsightVisual;

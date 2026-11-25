export const INSIGHT_VISUAL_SCHEMA_VERSION = "insight_visual.v1" as const;

export type InsightVisualType =
  | "signal_watchlist"
  | "priority_evidence"
  | "comparison_bars"
  | "trend_line"
  | "heatmap"
  | "stage_funnel"
  | "value_bridge";

export type InsightVisualTone =
  | "critical"
  | "attention"
  | "positive"
  | "neutral"
  | "info";

export type InsightVisualTrend = "up" | "down" | "flat";

export interface InsightVisualMetadata {
  formula?: string;
  denominator?: string;
  maturity?: string;
  source?: string;
  limitations?: string[];
}

export interface InsightVisualBase {
  schemaVersion: typeof INSIGHT_VISUAL_SCHEMA_VERSION;
  type: InsightVisualType;
  title: string;
  subtitle?: string;
  tone?: InsightVisualTone;
  metadata?: InsightVisualMetadata;
}

export interface SignalWatchlistRow {
  id: string;
  label: string;
  value: number;
  unit?: string;
  baseline?: number;
  target?: number;
  max?: number;
  tone?: InsightVisualTone;
  trend?: InsightVisualTrend;
  status?: string;
  detail?: string;
  evidenceCount?: number;
  series?: number[];
  route?: string;
  callIds?: string[];
}

export interface SignalWatchlistVisual extends InsightVisualBase {
  type: "signal_watchlist";
  rows: SignalWatchlistRow[];
}

export interface PriorityEvidenceStep {
  id: string;
  label: string;
  state: "complete" | "active" | "pending";
  detail?: string;
}

export interface PriorityEvidenceVisual extends InsightVisualBase {
  type: "priority_evidence";
  priorityScore: number;
  priorityLabel?: string;
  affectedCount: number;
  totalCount: number;
  evidenceCount: number;
  teamCount: number;
  resolvedCount?: number;
  representedValue?: number;
  capturedValue?: number;
  currency?: string;
  callIds?: string[];
  steps?: PriorityEvidenceStep[];
}

export interface ComparisonBarRow {
  id: string;
  label: string;
  current: number;
  comparison?: number;
  target?: number;
  currentLabel?: string;
  comparisonLabel?: string;
  unit?: string;
  tone?: InsightVisualTone;
  detail?: string;
  route?: string;
  callIds?: string[];
}

export interface ComparisonBarsVisual extends InsightVisualBase {
  type: "comparison_bars";
  rows: ComparisonBarRow[];
}

export interface TrendPoint {
  label: string;
  value: number;
}

export interface TrendSeries {
  id: string;
  label: string;
  unit?: string;
  tone?: InsightVisualTone;
  points: TrendPoint[];
}

export interface TrendLineVisual extends InsightVisualBase {
  type: "trend_line";
  series: TrendSeries[];
  min?: number;
  max?: number;
}

export interface HeatmapCell {
  column: string;
  value: number;
  detail?: string;
  tone?: InsightVisualTone;
}

export interface HeatmapRow {
  id: string;
  label: string;
  cells: HeatmapCell[];
}

export interface HeatmapVisual extends InsightVisualBase {
  type: "heatmap";
  columns: string[];
  rows: HeatmapRow[];
  unit?: string;
  min?: number;
  max?: number;
  highlightedCell?: {
    rowId: string;
    column: string;
    label: string;
  };
}

export interface StageFunnelRow {
  id: string;
  label: string;
  value: number;
  total?: number;
  target?: number;
  unit?: string;
  tone?: InsightVisualTone;
  detail?: string;
  route?: string;
  callIds?: string[];
}

export interface StageFunnelVisual extends InsightVisualBase {
  type: "stage_funnel";
  rows: StageFunnelRow[];
}

export interface ValueBridgeVisual extends InsightVisualBase {
  type: "value_bridge";
  represented: number;
  captured: number;
  opportunityGap: number;
  currency?: string;
  detail?: string;
}

export type InsightVisualSpec =
  | SignalWatchlistVisual
  | PriorityEvidenceVisual
  | ComparisonBarsVisual
  | TrendLineVisual
  | HeatmapVisual
  | StageFunnelVisual
  | ValueBridgeVisual;

export interface InsightVisualSelection {
  visualType: InsightVisualType;
  id: string;
  label: string;
  value?: number;
  route?: string;
  callIds?: string[];
  detail?: string;
}

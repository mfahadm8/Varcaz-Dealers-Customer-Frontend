/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

export type SortDirection = "asc" | "desc" | null;
export type TableRow = Record<string, any>;

export type CellProps<T> = {
  value: any;
  row: T;
  rowIndex: number;
  colIndex: number;
};

export type ColumnDef<T> = {
  accessor: keyof T | ((row: T) => any);
  header: ReactNode;
  id?: string;
  cell?: (props: CellProps<T>) => ReactNode;
  className?: string;
  headerClassName?: string;
  enableSorting?: boolean;
  width?: string;
};

export interface TableProps<T> {
  tableLabel?: string;
  columns: ColumnDef<T>[];
  data: T[];
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  headerRowClassName?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  defaultSortColumn?: string;
  defaultSortDirection?: SortDirection;
  pagination?: boolean;
  pageSize?: number;
  initialPage?: number;
}

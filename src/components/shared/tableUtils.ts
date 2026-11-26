import type { ColumnDef, SortDirection } from "./tableTypes";

export function getTableValue<T>(row: T, accessor: ColumnDef<T>["accessor"]) {
  if (typeof accessor === "function") return accessor(row);
  return row[accessor];
}

export function getColumnId<T>(column: ColumnDef<T>, index: number) {
  return column.id || (typeof column.accessor === "string" ? column.accessor : `column-${index}`);
}

export function getGridTemplateColumns<T>(columns: ColumnDef<T>[]) {
  const hasDefinedWidths = columns.some((column) => column.width);
  if (hasDefinedWidths) return columns.map((column) => column.width || "1fr").join(" ");
  return `repeat(${columns.length}, minmax(0, 1fr))`;
}

export function sortTableRows<T>(
  data: T[],
  columns: ColumnDef<T>[],
  sortConfig: { key: string; direction: SortDirection },
) {
  if (!sortConfig.direction) return [...data];

  return [...data].sort((a, b) => {
    const columnToSort = columns.find((column, index) => getColumnId(column, index) === sortConfig.key);
    if (!columnToSort) return 0;

    const aValue = getTableValue(a, columnToSort.accessor);
    const bValue = getTableValue(b, columnToSort.accessor);
    if (aValue === bValue) return 0;

    const valueA = aValue === null || aValue === undefined ? "" : aValue;
    const valueB = bValue === null || bValue === undefined ? "" : bValue;
    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortConfig.direction === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (sortConfig.direction === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1;
  });
}

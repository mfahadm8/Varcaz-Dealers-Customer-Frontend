import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils/cn";
import { TablePagination } from "./TablePagination";
import { getColumnId, getGridTemplateColumns, getTableValue, sortTableRows } from "./tableUtils";
import type { SortDirection, TableProps, TableRow } from "./tableTypes";
export type { CellProps, ColumnDef, SortDirection, TableProps } from "./tableTypes";

export function Table<T extends TableRow>({
  tableLabel,
  columns,
  data,
  className,
  rowClassName,
  headerRowClassName,
  emptyMessage = "No data available",
  onRowClick,
  defaultSortColumn,
  defaultSortDirection = null,
  pagination = false,
  pageSize = 10,
  initialPage = 1,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: SortDirection }>({
    key: defaultSortColumn || "",
    direction: defaultSortDirection,
  });
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const sortedData = useMemo(
    () => sortTableRows(data, columns, sortConfig),
    [data, columns, sortConfig],
  );

  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [pagination, sortedData.length, pageSize]);

  const requestSort = (columnId: string) => {
    setSortConfig((previous) => {
      if (previous.key !== columnId) return { key: columnId, direction: "asc" };
      const nextDirection = previous.direction === null ? "asc" : previous.direction === "asc" ? "desc" : null;
      return { key: nextDirection === null ? "" : columnId, direction: nextDirection };
    });
  };

  const renderSortIndicator = (columnId: string) => {
    if (sortConfig.key !== columnId) return null;
    if (sortConfig.direction === "asc") return <ChevronUp className="ml-1 inline-block h-4 w-4" />;
    if (sortConfig.direction === "desc") return <ChevronDown className="ml-1 inline-block h-4 w-4" />;
    return null;
  };

  const gridTemplateColumns = getGridTemplateColumns(columns);

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white">
        <div className="w-full" role="table" aria-label={tableLabel}>
          <div
            role="row"
            className={cn("grid h-[52px] items-center rounded-md bg-neutral-50 px-4", headerRowClassName)}
            style={{ gridTemplateColumns }}
          >
            {columns.map((column, index) => {
              const columnId = getColumnId(column, index);
              const isSortable = column.enableSorting !== false;
              return (
                <div
                  key={columnId}
                  role="columnheader"
                  className={cn("text-xs font-semibold uppercase tracking-wider text-neutral-500", isSortable && "cursor-pointer hover:text-neutral-700", column.headerClassName)}
                  onClick={() => isSortable && requestSort(columnId)}
                >
                  <div className={cn("flex items-center", column.className?.includes("justify-") ? column.className : index === 0 ? "justify-start" : "justify-center")}>
                    <div>
                      {column.header}
                      {isSortable && renderSortIndicator(columnId)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div role="rowgroup">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => {
                const resolvedRowClass = typeof rowClassName === "function" ? rowClassName(row, rowIndex) : rowClassName;
                return (
                  <div
                    key={rowIndex}
                    role="row"
                    className={cn("grid h-[52px] items-center rounded-md px-4 transition-colors hover:bg-neutral-100", rowIndex % 2 === 0 ? "bg-white" : "bg-neutral-50", onRowClick && "cursor-pointer", resolvedRowClass)}
                    style={{ gridTemplateColumns }}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column, colIndex) => {
                      const value = getTableValue(row, column.accessor);
                      const columnId = getColumnId(column, colIndex);
                      return (
                        <div
                          key={columnId}
                          role="cell"
                          className={cn("flex items-center text-sm", column.className?.includes("justify-") ? "" : colIndex === 0 ? "justify-start text-neutral-800" : "justify-center text-neutral-600", column.className)}
                        >
                          {column.cell ? column.cell({ value, row, rowIndex, colIndex }) : value}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-neutral-500">{emptyMessage}</div>
            )}
          </div>

          {pagination && (
            <TablePagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={sortedData.length}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

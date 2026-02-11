import { CSSProperties } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  negativeStatus,
  neutralityStatus,
  positiveStatus,
} from "@/constants/status";

interface Props<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  minHeight?: CSSProperties["minHeight"];
}

export const SmallTable = <TData,>({
  data,
  columns,
  minHeight = "400px",
}: Props<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative overflow-x-scroll" style={{ minHeight }}>
      <table className="min-w-full text-sm text-left table-fixed">
        <thead className="text-gray5 text-[14px] font-medium bg-white border-b border-b-line whitespace-nowrap">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = table
                  .getState()
                  .sorting.find((s) => s.id === header.column.id);

                const sortDirection = isSorted
                  ? isSorted.desc
                    ? "desc"
                    : "asc"
                  : null;

                return (
                  <th
                    key={header.id}
                    className="px-[32px] h-[56px] select-none bg-white z-10"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {sortDirection ? (
                      <span> {sortDirection === "desc" ? "↓" : "↑"}</span>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="text-black text-[14px]">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-[#F2F2FD]">
              {row.getVisibleCells().map((cell) => {
                const value = cell.getValue() as string;

                let textColor = "text-black";

                if (positiveStatus.includes(value)) {
                  textColor = "text-green";
                } else if (neutralityStatus.includes(value)) {
                  textColor = "text-gray5";
                } else if (negativeStatus.includes(value)) {
                  textColor = "text-red";
                }

                const fontWeight =
                  cell.column.id === "status" ? "font-semibold" : "font-normal";

                return (
                  <td
                    key={cell.id}
                    className={`px-[32px] h-[56px] whitespace-nowrap ${textColor} ${fontWeight}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

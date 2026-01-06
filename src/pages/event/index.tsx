import { useMemo, useState } from "react";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import { NoticeListItem } from "@/api/models";
import { useNoticeControllerGetNoticeList } from "@/api/notice/notice";
import { Table } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";

export default function NoticeList() {
  const [page, setPage] = useState<number>(0);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  // 이벤트 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useNoticeControllerGetNoticeList({
      take: 20,
      skip: 20 * page,
      sortBy: sorting[0]?.id ?? undefined,
      sortOrder: sorting[0]?.desc
        ? "desc"
        : !sorting[0]?.desc
        ? "asc"
        : undefined,
    });

  const columns = useMemo<ColumnDef<NoticeListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "등록일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<NoticeListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
        size: 0,
      },
      {
        id: "title",
        header: "제목",
        accessorFn: (row) => row.title,
        cell: (info: CellContext<NoticeListItem, unknown>) => {
          const text = info.getValue() as string;
          return text.length > 20 ? text.slice(0, 20) + "..." : text;
        },
        size: 0,
        enableSorting: false,
      },
      {
        id: "content",
        header: "내용",
        accessorFn: (row) => row.content,
        cell: (info: CellContext<NoticeListItem, unknown>) => {
          const html = info.getValue() as string;

          const text =
            typeof window !== "undefined"
              ? new DOMParser().parseFromString(html, "text/html").body
                  .textContent || ""
              : "";

          return text.length > 30 ? text.slice(0, 30) + "..." : text;
        },
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px] md:px-[40px] md:pt-[0px] md:pb-[40px] overflow-y-auto">
      {/* 테이블 */}
      <Table
        basePath="notice"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
        registrable
        clickable
      />

      {/* 페이지네이션 */}
      <Pagination
        totalCount={data?.meta.totalCount ?? 0}
        take={20}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

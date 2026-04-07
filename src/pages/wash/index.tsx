import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import { formatProductType, formatServiceType } from "@/utils";
import { ConditionBar } from "@/components/layout/ConditionBar";
import { List } from "@/components/layout/List";
import {
  HourServiceChart,
  ServiceSummary,
  WeekdayServiceChart,
  ComplimentaryServiceList,
} from "@/components/wash";

export default function Wash() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState<number>(0);

  // 세차 내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useServiceHistoryControllerGetServiceHistoryList({
      storeIds: storeId ? [storeId] : [],
      startDate,
      endDate,
      take: 10,
      skip: 10 * page,
    });

  const columns = useMemo<ColumnDef<ServiceHistoryListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "방문일시",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "storeName",
        header: "매장",
        accessorFn: (row) => row.store.name,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline cursor-pointer"
          >
            {row.original.store.name}
          </a>
        ),
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          info.getValue() ?? "-",
      },
      {
        id: "serviceType",
        header: "서비스 종류",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
      },
      {
        id: "serviceOptions",
        header: "서비스 옵션",
        accessorFn: (row) => row.serviceOptions,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          info.getValue() ?? "-",
      },
      {
        id: "passType",
        header: "이용권 종류",
        accessorFn: (row) => row.passType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatProductType(info.getValue() as string),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col w-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px]">
      <ConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <div className="flex flex-col xl:flex-row xl:h-[298px] gap-[24px]">
        <ServiceSummary
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
        <ComplimentaryServiceList
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 w-full mt-[24px] gap-[24px]">
        <WeekdayServiceChart storeId={storeId} />
        <HourServiceChart storeId={storeId} />
      </div>

      <List
        title="세차 내역"
        data={data?.data ?? []}
        columns={columns}
        isLoading={isLoading}
        totalCount={data?.meta.totalCount}
        take={10}
        page={page}
        setPage={setPage}
        emptyMessage="세차 내역이 조회되지 않습니다."
      />
    </div>
  );
}

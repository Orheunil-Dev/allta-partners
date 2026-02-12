import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSalesControllerGetSalesStatByProductType } from "@/api/sales/sales";
import { ProductTypeSalesStatItem } from "@/api/models";
import { ConditionBar } from "@/components/layout/ConditionBar";
import { List } from "@/components/layout/List";
import {
  SalesByPassTypeChart,
  SalesByPaymentMethod,
  SalesByProductTypeChart,
  SalesSummary,
} from "@/components/sales-report";

export default function Dashboard() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState<number>(0);

  // 매출 통계 조회 API
  const { data, isLoading, isError } =
    useSalesControllerGetSalesStatByProductType({
      storeIds: storeId ? [storeId] : [],
      startDate,
      endDate,
    });

  const tableData = useMemo(() => {
    if (!data?.data) return [];

    const start = page * 10;
    const end = start + 10;

    return data.data.slice(start, end);
  }, [data?.data, page]);

  const columns = useMemo<ColumnDef<ProductTypeSalesStatItem>[]>(
    () => [
      {
        id: "date",
        header: "일자",
        accessorFn: (row) => row.date,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD"),
      },
      {
        id: "totalSales",
        header: "전체 매출",
        accessorFn: (row) => row.totalSales,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "premiumSales",
        header: "프리미엄",
        accessorFn: (row) => row.premiumSales,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "standardSales",
        header: "스탠다드",
        accessorFn: (row) => row.standardSales,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "ticketSales",
        header: "일회권",
        accessorFn: (row) => row.ticketSales,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "offlineTicketSales",
        header: "현장결제",
        accessorFn: (row) => row.offlineTicketSales,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "dailyChangeRate",
        header: "전일대비",
        accessorFn: (row) => row.dailyChangeRate,
        cell: (info: CellContext<ProductTypeSalesStatItem, unknown>) => {
          const value = info.getValue() as number;

          switch (true) {
            case value > 0:
              return (
                <p className="text-[14px] font-medium text-green">+{value}%</p>
              );

            case value < 0:
              return (
                <p className="text-[14px] font-medium text-red">{value}%</p>
              );

            default:
              return <p className="text-[14px] font-medium text-gray5">-</p>;
          }
        },
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

      <SalesSummary storeId={storeId} startDate={startDate} endDate={endDate} />

      <div className="flex flex-col xl:flex-row gap-x-[24px]">
        <SalesByPassTypeChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
        <SalesByProductTypeChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <SalesByPaymentMethod
        storeId={storeId}
        startDate={startDate}
        endDate={endDate}
      />

      <List
        title="일자별 매출 내역"
        data={tableData ?? []}
        columns={columns}
        totalCount={data?.data.length}
        take={20}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

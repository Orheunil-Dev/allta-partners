import { useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useFuelSalesControllerGetFuelSalesStatByFuelType } from "@/api/fuel-sales/fuel-sales";
import { FuelTypeFuelSalesStatItem } from "@/api/models";
import { ConditionBar } from "@/components/layout/ConditionBar";
import { List } from "@/components/layout/List";
import {
  FuelSalesByFuelTypeChart,
  FuelSalesDoughnutChart,
  FuelSalesSummary,
} from "@/components/fuel-report";

export default function Dashboard() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [page, setPage] = useState<number>(0);

  // 유종별 주유 매출 통계 조회 API
  const { data, isLoading, isError } =
    useFuelSalesControllerGetFuelSalesStatByFuelType({
      storeId,
      startDate,
      endDate,
    });

  const tableData = useMemo(() => {
    if (!data?.data) return [];

    const start = page * 10;
    const end = start + 10;

    return data.data.slice(start, end);
  }, [data?.data, page]);

  const columns = useMemo<ColumnDef<FuelTypeFuelSalesStatItem>[]>(
    () => [
      {
        id: "date",
        header: "일자",
        accessorFn: (row) => row.date,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD"),
      },
      {
        id: "totalSales",
        header: "전체 매출",
        accessorFn: (row) => row.totalSales,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "gasSales",
        header: "휘발유",
        accessorFn: (row) => row.gasSales,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "dieselSales",
        header: "경유",
        accessorFn: (row) => row.dieselSales,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "premiumGasSales",
        header: "고급유",
        accessorFn: (row) => row.premiumGasSales,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) =>
          (info.getValue() as number).toLocaleString(),
      },
      {
        id: "dailyChangeRate",
        header: "전일대비",
        accessorFn: (row) => row.dailyChangeRate,
        cell: (info: CellContext<FuelTypeFuelSalesStatItem, unknown>) => {
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

      <FuelSalesSummary
        storeId={storeId}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="flex flex-col xl:flex-row gap-x-[24px]">
        <FuelSalesByFuelTypeChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
        <FuelSalesDoughnutChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <List
        title="일자별 매출 내역"
        data={tableData ?? []}
        columns={columns}
        totalCount={data?.data.length}
        take={10}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

import { useMemo, useState } from "react";
import Image from "next/image";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useSalesControllerGetSalesStatByProductType } from "@/api/sales/sales";
import { ProductTypeSalesStatItem } from "@/api/models";
import { Callout } from "../ui/Callout";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { downloadIcon } from "../../../public/images";

interface Props {
  storeId: string | null;
  startDate: string;
  endDate: string;
}

export const SalesList = ({ storeId, startDate, endDate }: Props) => {
  const [page, setPage] = useState<number>(0);

  // 매출 통계 조회 API
  const {
    data: salesStatData,
    isLoading: salesStatLoading,
    isError: salesStatError,
  } = useSalesControllerGetSalesStatByProductType({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
  });

  const tableData = useMemo(() => {
    if (!salesStatData?.data) return [];

    const start = page * 10;
    const end = start + 10;

    return salesStatData.data.slice(start, end);
  }, [salesStatData?.data, page]);

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
    <Callout margin="24px 0 0 0" padding="24px">
      <div className="relative flex flex-col">
        <div className="flex justify-between mb-[24px]">
          <p className="text-[18px] font-semibold">일자별 매출 내역</p>

          <button
            onClick={() => {}}
            className="flex justify-center items-center w-[84px] h-[30px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
          >
            <Image
              src={downloadIcon}
              alt="다운로드"
              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[4px]"
            />
            <p className="text-[12px] md:text-[13px]">다운로드</p>
          </button>
        </div>

        <SmallTable data={tableData ?? []} columns={columns} />
        <Pagination
          totalCount={salesStatData?.data.length ?? 0}
          take={10}
          page={page}
          setPage={setPage}
        />

        {!salesStatLoading && !salesStatData?.data.length && (
          <p className="absolute top-[250px] self-center text-center text-gray5 text-[18px] font-semibold">
            매출 내역이 없습니다.
          </p>
        )}
      </div>
    </Callout>
  );
};

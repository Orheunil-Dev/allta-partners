import { useEffect, useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetComplimentaryServiceHistoryList } from "@/api/service-history/service-history";
import { ComplimentaryServiceHistoryListItem } from "@/api/models";
import { formatFreeWashReason } from "@/utils";
import { List } from "@/components/layout/List";
import { ConditionBar } from "@/components/layout/ConditionBar";

export default function FreeWashListist() {
  const [page, setPage] = useState<number>(0);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 무료세차 내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useServiceHistoryControllerGetComplimentaryServiceHistoryList({
      storeIds: storeId ? [storeId] : [],
      ...(carNumber && { carNumber }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      take: 10,
      skip: 10 * page,
    });

  const columns = useMemo<ColumnDef<ComplimentaryServiceHistoryListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "방문일시",
        accessorFn: (row) => row.createdAt,
        cell: (
          info: CellContext<ComplimentaryServiceHistoryListItem, unknown>,
        ) => dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
        enableSorting: false,
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.storeName,
        enableSorting: false,
      },
      {
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.userName ?? "-",
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },
      {
        id: "reason",
        header: "무료세차 사유",
        accessorFn: (row) => row.paymentMethod,
        cell: (
          info: CellContext<ComplimentaryServiceHistoryListItem, unknown>,
        ) => formatFreeWashReason(info.getValue() as string),
        enableSorting: false,
      },
    ],
    [],
  );

  // 필터 적용
  const handleSearch = () => {
    setCarNumber(draftCarNumber);
    setPage(0);

    refetch();
  };

  useEffect(() => {
    if (draftCarNumber === carNumber) return;

    const timer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [draftCarNumber]);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <ConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <List
        title="무료세차 내역"
        data={data?.data ?? []}
        columns={columns}
        totalCount={data?.meta.totalCount}
        take={10}
        page={page}
        setPage={setPage}
        draftCarNumber={draftCarNumber}
        setDraftCarNumber={setDraftCarNumber}
      />
    </div>
  );
}

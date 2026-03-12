import { useEffect, useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useFreeWashControllerGetFreeWashHistoryList } from "@/api/free-wash/free-wash";
import { FreeWashHistoryListItem } from "@/api/models";
import { formatFreeWashReason } from "@/utils";
import { List } from "@/components/layout/List";
import { ConditionBar } from "@/components/layout/ConditionBar";

export default function FreeWashList() {
  const [page, setPage] = useState<number>(0);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 무료세차 내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useFreeWashControllerGetFreeWashHistoryList({
      storeIds: storeId ? [storeId] : [],
      ...(carNumber && { carNumber }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      take: 10,
      skip: 10 * page,
    });

  const columns = useMemo<ColumnDef<FreeWashHistoryListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "방문일시",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<FreeWashHistoryListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
        enableSorting: false,
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.storeName,
        enableSorting: false,
      },
      // {
      //   id: "userName",
      //   header: "회원명",
      //   accessorFn: (row) => row.userName ?? "-",
      //   enableSorting: false,
      // },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },
      {
        id: "memo",
        header: "메모",
        accessorFn: (row) => row.memo ?? "-",
        enableSorting: false,
      },
      {
        id: "reason",
        header: "무료세차 사유",
        accessorFn: (row) => row.paymentMethod,
        cell: (info: CellContext<FreeWashHistoryListItem, unknown>) =>
          formatFreeWashReason(info.getValue() as string),
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

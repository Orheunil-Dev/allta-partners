import { useEffect, useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import { formatPassType, formatServiceType } from "@/utils";
import { List } from "@/components/layout/List";
import { ConditionBar } from "@/components/layout/ConditionBar";

export default function ServiceHistoryList() {
  const [page, setPage] = useState<number>(0);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 이용내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    useServiceHistoryControllerGetServiceHistoryList({
      storeIds: storeId ? [storeId] : [],
      ...(carNumber && { carNumber }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
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
        enableSorting: false,
      },
      {
        id: "passType",
        header: "이용권",
        accessorFn: (row) => row.passType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatPassType(info.getValue() as string),
        enableSorting: false,
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
        id: "serviceType",
        header: "서비스 종류",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "serviceOptions",
        header: "서비스 옵션",
        accessorFn: (row) => row.serviceOptions,
        cell: (info: CellContext<ServiceHistoryListItem, unknown>) =>
          info.getValue() ?? "-",
      },
      {
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.user?.name ?? "-",
        enableSorting: false,
      },
      {
        id: "userPhoneNumber",
        header: "회원 전화번호",
        accessorFn: (row) => row.user?.phoneNumber ?? "-",
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
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

  // 엑셀 파일 추출
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/service-history/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            storeIds: storeId ? [storeId] : [],
            ...(carNumber && { carNumber }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          }),
        },
      );

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `이용내역목록_${dayjs().format("YYYYMMDD")}.xlsx`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
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
        title="이용 내역"
        data={data?.data ?? []}
        columns={columns}
        totalCount={data?.meta.totalCount}
        take={10}
        page={page}
        setPage={setPage}
        draftCarNumber={draftCarNumber}
        setDraftCarNumber={setDraftCarNumber}
        onDownload={handleDownload}
      />
    </div>
  );
}

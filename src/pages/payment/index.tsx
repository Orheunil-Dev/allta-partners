import { useEffect, useMemo, useState } from "react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { usePaymentControllerGetPaymentList } from "@/api/payment/payment";
import { PaymentListItem } from "@/api/models";
import {
  formatPaymentMethod,
  formatPaymentStatus,
  formatProductType,
  formatServiceType,
} from "@/utils";
import { List } from "@/components/layout/List";
import { ConditionBar } from "@/components/layout/ConditionBar";

export default function PaymentList() {
  const [page, setPage] = useState<number>(0);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // 결제내역 목록 조회 API
  const { data, isLoading, isError, refetch } =
    usePaymentControllerGetPaymentList({
      storeIds: storeId ? [storeId] : [],
      ...(carNumber && { carNumber }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      take: 10,
      skip: 10 * page,
    });

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "승인일시",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
      {
        id: "storeName",
        header: "매장명",
        accessorFn: (row) => row.storeName,
        cell: ({ row }) => (
          <a
            href={`/store/${row.original.store.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="hover:underline cursor-pointer"
          >
            {row.original.storeName}
          </a>
        ),
        enableSorting: false,
        size: 220,
      },
      {
        id: "productType",
        header: "상품종류",
        accessorFn: (row) => row.productType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatProductType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "amount",
        header: "승인금액",
        accessorFn: (row) => row.amount,
        cell: (info: CellContext<PaymentListItem, unknown>) => {
          const row = info.row.original;
          const amount = info.getValue() as number;
          const formattedAmount = amount.toLocaleString();

          return row.status !== "APPROVED" && amount > 0
            ? `-${formattedAmount}`
            : `${formattedAmount}`;
        },
        enableSorting: false,
      },
      {
        id: "status",
        header: "결제상태",
        accessorFn: (row) => row.status,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatPaymentStatus(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "paymentMethod",
        header: "결제수단",
        accessorFn: (row) => row.paymentMethod,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatPaymentMethod(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "serviceType",
        header: "서비스",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "serviceOptions",
        header: "서비스 옵션",
        accessorFn: (row) => row.serviceOptions ?? "-",
        enableSorting: false,
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.purchase.carNumber,
        enableSorting: false,
      },
      {
        id: "userName",
        header: "회원명",
        accessorFn: (row) => row.user?.name,
        cell: ({ row }) =>
          row.original.user ? (
            <a
              href={`/user/${row.original.user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:underline cursor-pointer"
            >
              {row.original.user.name}
            </a>
          ) : (
            "-"
          ),
        enableSorting: false,
      },
      {
        id: "userPhoneNumber",
        header: "회원 전화번호",
        accessorFn: (row) => row.user?.phoneNumber ?? "-",
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
        `${process.env.NEXT_PUBLIC_API_URL}/payment/export`,
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
      a.download = `결제내역목록_${dayjs().format("YYYYMMDD")}.xlsx`;

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
        title="결제 내역"
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

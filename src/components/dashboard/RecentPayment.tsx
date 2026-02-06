import { useMemo } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { usePaymentControllerGetPaymentList } from "@/api/payment/payment";
import { PaymentListItem } from "@/api/models";
import {
  formatEllipsis,
  formatPaymentMethod,
  formatPaymentStatus,
  formatProductType,
  formatServiceType,
  getDateBeforeDays,
} from "@/utils";
import { Callout } from "../ui/Callout";
import { SmallTable } from "../ui/Table";
import { grayRightArrowIcon } from "../../../public/images";

interface Props {}

export const RecentPayment = ({}: Props) => {
  const router = useRouter();

  // 결제 내역 조회 API
  const { data, isLoading, isError, refetch } =
    usePaymentControllerGetPaymentList({
      storeIds: storeId ? [storeId] : [],
      startDate: getDateBeforeDays(0),
      take: 10,
      skip: 0,
    });

  const columns = useMemo<ColumnDef<PaymentListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "결제시간",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          dayjs(info.getValue() as string).format("HH:mm"),
      },
      {
        id: "storeName",
        header: "매장",
        accessorFn: (row) => row.storeName,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatEllipsis(info.getValue() as string, 20),
      },
      {
        id: "serviceType",
        header: "서비스 종류",
        accessorFn: (row) => row.serviceType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
      },
      {
        id: "productType",
        header: "이용권 종류",
        accessorFn: (row) => row.productType,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatProductType(info.getValue() as string),
      },
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.purchase.carNumber,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          info.getValue() ?? "-",
      },
      {
        id: "paymentMethod",
        header: "결제방법",
        accessorFn: (row) => row.paymentMethod,
        cell: (info: CellContext<PaymentListItem, unknown>) =>
          formatPaymentMethod(info.getValue() as string),
      },
      {
        id: "amount",
        header: "결제금액",
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
    ],
    [],
  );

  return (
    <Callout margin="24px 0 0 0" padding="24px">
      <div className="relative flex flex-col">
        <div className="flex justify-between mb-[24px]">
          <p className="text-[18px] font-semibold">금일 매출 발생 내역</p>

          <button
            onClick={() => router.push("/payment")}
            type="button"
            className="flex items-center cursor-pointer"
          >
            <p className="text-gray5 text-[14px]">더보기</p>
            <Image
              src={grayRightArrowIcon}
              alt="더보기"
              className="w-[20px] h-[20px]"
            />
          </button>
        </div>

        <SmallTable
          data={data?.data ?? []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage=""
        />

        {!isLoading && !data?.data.length && (
          <p className="absolute top-[250px] self-center text-center text-gray5 text-[18px] font-semibold">
            금일 매출 내역이 없습니다.
          </p>
        )}
      </div>
    </Callout>
  );
};

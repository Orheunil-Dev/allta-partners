import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useServiceHistoryControllerGetServiceHistoryList } from "@/api/service-history/service-history";
import { ServiceHistoryListItem } from "@/api/models";
import {
  formatEllipsis,
  formatPaymentMethod,
  formatProductType,
  formatServiceType,
} from "@/utils";
import { Callout } from "../ui/Callout";
import { SmallTable } from "../ui/Table";
import { grayRightArrowIcon } from "../../../public/images";
import { Pagination } from "../ui/Pagination";

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const ServiceHistoryList = ({ storeId, startDate, endDate }: Props) => {
  const router = useRouter();

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
    <Callout margin="24px 0 0 0" padding="24px">
      <div className="relative flex flex-col">
        <div className="flex justify-between mb-[24px]">
          <p className="text-[18px] font-semibold">세차 내역</p>

          {/* <button
            onClick={() => router.push("/service-history")}
            type="button"
            className="flex items-center cursor-pointer"
          >
            <p className="text-gray5 text-[14px]">더보기</p>
            <Image
              src={grayRightArrowIcon}
              alt="더보기"
              className="w-[20px] h-[20px]"
            />
          </button> */}
        </div>

        <SmallTable data={data?.data ?? []} columns={columns} />
        <Pagination
          totalCount={data?.meta.totalCount ?? 0}
          take={10}
          page={page}
          setPage={setPage}
        />

        {!isLoading && !data?.data.length && (
          <p className="absolute top-[250px] self-center text-center text-gray5 text-[18px] font-semibold">
            금일 세차 내역이 없습니다.
          </p>
        )}
      </div>
    </Callout>
  );
};

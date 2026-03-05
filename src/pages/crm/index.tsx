import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { useCrmControllerGetCrmLogList } from "@/api/crm/crm";
import { CrmLogListItem } from "@/api/models";
import { formatServiceType } from "@/utils";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import { List } from "@/components/layout/List";
import { LockedContent } from "@/components/layout/LockedContent";
import { CrmAutomationSection } from "@/components/crm";

export default function Crm() {
  const router = useRouter();

  const [page, setPage] = useState<number>(0);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  // CRM 로그 목록 조회 API
  const { data, isLoading, isError, refetch } = useCrmControllerGetCrmLogList(
    {
      storeId: storeId!,
      take: 10,
      skip: 10 * page,
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  const columns = useMemo<ColumnDef<CrmLogListItem>[]>(
    () => [
      {
        id: "createdAt",
        header: "실행일시",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<CrmLogListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
        enableSorting: false,
      },
      {
        id: "category",
        header: "구분",
        accessorFn: (row) => row.category,
        cell: (info: CellContext<CrmLogListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "actionType",
        header: "유형",
        accessorFn: (row) => row.actionType,
        cell: (info: CellContext<CrmLogListItem, unknown>) =>
          formatServiceType(info.getValue() as string),
        enableSorting: false,
      },
      {
        id: "successCount",
        header: "실행 건수",
        accessorFn: (row) => row.successCount,
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <SimpleConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        setStoreName={setStoreName}
        showEntireStore={false}
      />

      <div className="mt-[24px] p-[24px] text-white bg-gradient-to-br from-[#37349F] to-[#5F5CE5] rounded-[16px]">
        <p className="text-[22px] font-semibold">AI 자동화 CRM 프로세스</p>
        <p className="mt-[4px] text-[16px]">
          고객 행동 패턴을 분석하여 최적의 타이밍에 맞춤 메시지를 발송합니다.
        </p>
      </div>

      <CrmAutomationSection
        storeId={storeId}
        storeName={storeName}
        isLocked={data?.ok ? false : true}
      />

      <List
        title="최근 CRM 자동 실행 내역"
        data={data?.data ?? []}
        columns={columns}
        totalCount={data?.meta.totalCount}
        take={10}
        page={page}
        setPage={setPage}
        lockMessage={
          !data?.ok && (
            <LockedContent
              title="Pro 전용"
              content="자동 실행 내역은 유료 플랜에서 제공됩니다."
              buttonText="멤버쉽 업그레이드"
              onClick={() => router.push("price")}
            />
          )
        }
      />
    </div>
  );
}

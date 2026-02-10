import { useMemo, useState } from "react";
import {
  useStaffControllerDisconnectStaff,
  useStaffControllerGetStaffList,
  useStaffControllerRegisterStaff,
} from "@/api/staff/staff";
import { Callout } from "../ui/Callout";
import { Pagination } from "../ui/Pagination";
import { SmallTable } from "../ui/Table";
import { ColumnDef } from "@tanstack/react-table";
import { StaffListItem } from "@/api/models";

interface Props {
  storeId: string;
}

export const StaffInfo = ({ storeId }: Props) => {
  const [page, setPage] = useState<number>(0);

  // 직원 목록 조회 API
  const { data, isLoading, isError } = useStaffControllerGetStaffList({
    storeIds: [storeId],
    take: 20,
    skip: 20 * page,
  });

  // 직원 등록 API
  const {
    mutate: registerStaff,
    isPending: registerStaffLoading,
    isError: registerStaffError,
  } = useStaffControllerRegisterStaff();

  // 직원 삭제 API
  const {
    mutate: disconnectStaff,
    isPending: disconnectStaffLoading,
    isError: disconnectStaffError,
  } = useStaffControllerDisconnectStaff();

  const columns = useMemo<ColumnDef<StaffListItem>[]>(
    () => [
      {
        id: "name",
        header: "이름",
        accessorFn: (row) => row.name,
      },
      {
        id: "phoneNumber",
        header: "전화번호",
        accessorFn: (row) => row.phoneNumber,
        enableSorting: false,
      },
      {
        id: "email",
        header: "이메일",
        accessorFn: (row) => row.email,
        enableSorting: false,
      },
      {
        id: "disconnect",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={() => {}}
            className="px-[8px] py-[5px] bg-[#FEF1F1] text-red text-[13px] font-semibold rounded-[6px] cursor-pointer"
          >
            삭제하기
          </button>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <Callout margin="20px 0 0 0" padding="20px 32px">
      <p className="text-[16px] font-semibold">직원 관리</p>

      {/* 테이블 */}
      <SmallTable data={data?.data ?? []} columns={columns} />

      {/* 페이지네이션 */}
      <Pagination
        totalCount={data?.meta.totalCount ?? 0}
        take={20}
        page={page}
        setPage={setPage}
      />
    </Callout>
  );
};

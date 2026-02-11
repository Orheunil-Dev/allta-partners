import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  useStaffControllerGetStaffList,
  useStaffControllerRegisterStaff,
} from "@/api/staff/staff";
import { StaffListItem } from "@/api/models";
import { Callout } from "../ui/Callout";
import { SmallTable } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { StaffDisconnectModal } from "./StaffDisconnectModal";
import { StaffRegisterModal } from "./StaffRegisterModal";
import Image from "next/image";
import { plusIcon } from "../../../public/images";

interface Props {
  storeId: string;
}

export const StaffInfo = ({ storeId }: Props) => {
  const [page, setPage] = useState<number>(0);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [staffId, setStaffId] = useState<string | null>(null);

  // 직원 목록 조회 API
  const { data, isLoading, isError, refetch } = useStaffControllerGetStaffList({
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

  // 직원 등록 모달 제어
  const handleOpenRegisterModal = () => {
    setShowRegisterModal(true);
  };
  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  // 직원 삭제 모달 제어
  const handleOpenDisconnectModal = (id: string) => () => {
    setStaffId(id);
  };
  const handleCloseDisconnectModal = () => {
    setStaffId(null);
  };

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
            onClick={handleOpenDisconnectModal(row.original.id)}
            className="px-[8px] py-[5px] bg-[#FEF1F1] text-red text-[13px] font-semibold rounded-[6px] cursor-pointer"
          >
            삭제
          </button>
        ),
        enableSorting: false,
      },
    ],
    [],
  );

  return (
    <>
      {/* 직원 등록 모달 */}
      <StaffRegisterModal
        visible={showRegisterModal}
        storeId={storeId}
        onClose={handleCloseRegisterModal}
        refetch={refetch}
      />

      {/* 직원 삭제 모달 */}
      <StaffDisconnectModal
        staffId={staffId}
        storeId={storeId}
        onClose={handleCloseDisconnectModal}
        refetch={refetch}
      />

      <Callout margin="20px 0 0 0" padding="20px 32px">
        <div className="flex justify-between">
          <div className="flex items-center">
            <p className="text-[16px] font-semibold">직원 리스트</p>
            <div className="flex justify-center items-center ml-[12px] px-[6px] py-[2px] bg-gray1 rounded-[4px]">
              <p className="text-gray7 font-semibold">
                {data?.meta.totalCount}명
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenRegisterModal}
            className="flex justify-center items-center w-[84px] h-[32px] border border-line rounded-[8px] cursor-pointer"
          >
            <Image
              src={plusIcon}
              alt="직원 등록"
              className="size-[20px] mr-[2px]"
            />
            <span className="text-[13px]">직원 등록</span>
          </button>
        </div>

        {/* 테이블 */}
        <SmallTable data={data?.data ?? []} columns={columns} minHeight="0" />

        {!data?.data.length && (
          <div className="flex justify-center py-[80px]">
            <p className="text-gray5"> 해당 매장에 등록된 직원이 없습니다.</p>
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination
          totalCount={data?.meta.totalCount ?? 0}
          take={20}
          page={page}
          setPage={setPage}
        />
      </Callout>
    </>
  );
};

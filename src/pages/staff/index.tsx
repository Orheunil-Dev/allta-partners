import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CellContext, ColumnDef, SortingState } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  useStaffControllerGetStaffList,
  useStaffControllerRegisterStaff,
} from "@/api/staff/staff";
import { RegisterStaffRequest, StaffListItem } from "@/api/models";
import { formatPhoneNumber } from "@/utils";
import { SearchKey } from "@/types";
import { Table } from "@/components/ui/Table";
import { Filter } from "@/components/ui/Filter";
import { Pagination } from "@/components/ui/Pagination";
import { CustomModal } from "@/components/ui/Modal";
import { StoreSelect } from "@/components/ui/Select";
import { CustomButton } from "@/components/ui/Button";
import { colors } from "@/styles";

type SearchTerms = {
  name?: string;
  phoneNumber?: string;
};

export default function StoreList() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(0);
  const [searchTerms, setSearchTerms] = useState<SearchTerms>({
    name: undefined,
    phoneNumber: undefined,
  });
  const [draftSearchTerms, setDraftSearchTerms] =
    useState<SearchTerms>(searchTerms);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [registerForm, setRegisterForm] = useState<RegisterStaffRequest>({
    phoneNumber: "",
    storeId: "",
  });

  // 직원 목록 조회 API
  const { data, isLoading, isError, refetch } = useStaffControllerGetStaffList(
    {
      take: 20,
      skip: 20 * page,
      name: searchTerms.name,
      phoneNumber: searchTerms.phoneNumber,
    },
    {
      query: {
        queryKey: [
          "staffs",
          {
            take: 20,
            skip: 20 * page,
            name: searchTerms.name,
            phoneNumber: searchTerms.phoneNumber,
          },
        ],
      },
    },
  );

  // 직원 등록 API
  const {
    mutate: registerStaff,
    isPending: registerStaffLoading,
    isError: registerStaffError,
  } = useStaffControllerRegisterStaff();

  const searchKeys = useMemo<SearchKey[]>(
    () => [
      {
        key: "name",
        label: "이름",
        width: "120px",
      },
      {
        key: "phoneNumber",
        label: "전화번호",
        width: "140px",
        maxLength: 13,
      },
    ],
    [],
  );

  // const selectKeys = useMemo<SelectKey[]>(
  //   () => [
  //     {
  //       key: "isDeleted",
  //       label: "탈퇴 여부",
  //       options: userDeletedOptions,
  //     },
  //     {
  //       key: "isBanned",
  //       label: "정지 여부",
  //       options: userBannedOptions,
  //     },
  //     {
  //       key: "isMarketing",
  //       label: "마케팅 수신 여부",
  //       options: userMarketingOptions,
  //     },
  //   ],
  //   []
  // );

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
        id: "store",
        header: "매장",
        accessorFn: (row) => row.stores,
        cell: ({ getValue }) => {
          const stores = getValue() as { id: string; name: string }[];

          if (stores.length === 1) {
            return stores[0].name;
          }

          return `${stores[0].name} 외 ${stores.length - 1}개`;
        },
        enableSorting: false,
      },
      {
        id: "email",
        header: "이메일",
        accessorFn: (row) => row.email,
        enableSorting: false,
      },
      {
        id: "createdAt",
        header: "가입일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<StaffListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
    ],
    [],
  );

  // 필터 적용
  const handleSearch = () => {
    setSearchTerms(draftSearchTerms);
    setPage(0);

    refetch();
  };

  // 필터 초기화
  const handleReset = () => {
    setSearchTerms({});
    setDraftSearchTerms({});
    setPage(0);
  };

  const handleCloseModal = () => {
    setRegisterForm({
      phoneNumber: "",
      storeId: "",
    });
    setShowModal(false);
  };

  // 직원 등록
  const handleRegisterStaff = () => {
    if (!registerForm.phoneNumber.trim() || !registerForm.storeId.trim())
      return;

    registerStaff(
      {
        data: { ...registerForm },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["staffs"] });
          alert("등록이 완료되었습니다.");

          return handleCloseModal();
        },
        onError: (error: any) => {
          alert(error.message ?? "등록 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px]  md:p-[40px] overflow-y-auto">
      <CustomModal
        visible={showModal}
        onClose={handleCloseModal}
        width="382px"
        padding="24px"
      >
        <p className="w-full text-[20px] font-semibold">직원 등록</p>

        <div className="grid grid-cols-[80px_1fr] w-full items-center mt-[32px] px-[24px] gap-y-[20px]">
          <p className="text-[14px] font-semibold">매장 선택</p>
          <StoreSelect
            value={registerForm.storeId}
            setValue={(storeId) =>
              setRegisterForm((prev) => ({
                ...prev,
                storeId,
              }))
            }
          />

          <p className="text-[14px] font-semibold">전화번호</p>
          <input
            value={registerForm.phoneNumber}
            onChange={(e) =>
              setRegisterForm((prev) => ({
                ...prev,
                phoneNumber: formatPhoneNumber(e.target.value),
              }))
            }
            maxLength={13}
            placeholder="전화번호 입력"
            className="h-[34px] px-[12px] text-[14px] border border-gray2 rounded-[6px]"
          />
        </div>

        <div className="flex mt-[32px] gap-x-[12px]">
          <CustomButton
            onClick={handleCloseModal}
            borderWidth="1px"
            borderColor={colors.gray2}
          >
            취소
          </CustomButton>

          <CustomButton
            onClick={handleRegisterStaff}
            disabled={registerStaffLoading}
            color={colors.white}
            backgroundColor={colors.partner}
          >
            추가
          </CustomButton>
        </div>
      </CustomModal>

      {/* 검색 필터 */}
      <Filter
        searchKeys={searchKeys}
        searchTerms={draftSearchTerms}
        setSearchTerms={setDraftSearchTerms}
        // selectKeys={selectKeys}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 테이블 */}
      <Table
        basePath="staff"
        data={data?.data ?? []}
        totalCount={data?.meta.totalCount ?? 0}
        page={page}
        columns={columns}
        onRegister={() => setShowModal(true)}
      />

      {/* 페이지네이션 */}
      <Pagination
        totalCount={data?.meta.totalCount ?? 0}
        take={20}
        page={page}
        setPage={setPage}
      />
    </div>
  );
}

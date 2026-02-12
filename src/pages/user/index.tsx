import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  useUserControllerGetUserList,
  useUserControllerGetUsersCount,
} from "@/api/user/user";
import { UserListItem } from "@/api/models";
import { RangeKey, SearchKey } from "@/types";
import { Callout } from "@/components/ui/Callout";
import { SmallTable } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";
import { downloadIcon, graySearchIcon } from "../../../public/images";

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function UserList() {
  const [page, setPage] = useState<number>(0);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [rangeFilter, setRangeFilter] = useState<RangeFilter>({
    key: "createdAt",
    gte: undefined,
    lte: undefined,
  });
  const [draftRangeFilter, setDraftRangeFilter] =
    useState<RangeFilter>(rangeFilter);

  // 가입자 수 조회 API
  const {
    data: usersCountData,
    isLoading: usersCountLoading,
    isError: usersCountError,
  } = useUserControllerGetUsersCount();

  // 회원 목록 조회 API
  const { data, isLoading, isError, refetch } = useUserControllerGetUserList({
    take: 20,
    skip: 20 * page,
    ...(carNumber && { carNumber }),
    ...(rangeFilter.gte && { startDate: rangeFilter.gte }),
    ...(rangeFilter.lte && { endDate: rangeFilter.lte }),
  });

  const rangeKeys = useMemo<RangeKey[]>(
    () => [
      {
        key: "createdAt",
        label: "가입일",
      },
    ],
    [],
  );

  const columns = useMemo<ColumnDef<UserListItem>[]>(
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
        id: "mainCarNumber",
        header: "대표차량번호",
        accessorFn: (row) => row.mainCarNumber,
        cell: (info: CellContext<UserListItem, unknown>) =>
          info.getValue() ?? "-",
        enableSorting: false,
      },
      {
        id: "email",
        header: "이메일",
        accessorFn: (row) => row.email,
        enableSorting: false,
      },
      {
        id: "address",
        header: "주소",
        accessorFn: (row) => row.address,
        enableSorting: false,
      },
      {
        id: "status",
        header: "계정 상태",
        cell: ({ row }) => (
          <p
            className={`text-center text-[13px] font-semibold rounded-[6px] cursor-pointer
              ${
                row.original.isBanned
                  ? `text-red`
                  : row.original.isDeleted
                    ? `text-gray5`
                    : `text-green`
              }`}
          >
            {row.original.isBanned
              ? "정지"
              : row.original.isDeleted
                ? "탈퇴"
                : "가입"}
          </p>
        ),
        enableSorting: false,
      },
      {
        id: "createdAt",
        header: "가입일",
        accessorFn: (row) => row.createdAt,
        cell: (info: CellContext<UserListItem, unknown>) =>
          dayjs(info.getValue() as string).format("YYYY.MM.DD HH:mm"),
      },
    ],
    [],
  );

  // 필터 적용
  const handleSearch = () => {
    setCarNumber(draftCarNumber);
    setRangeFilter(draftRangeFilter);
    setPage(0);

    refetch();
  };

  // // 엑셀 파일 추출
  // const handleDownload = async () => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/user/export`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({
  //           name: searchTerms.name,
  //           phoneNumber: searchTerms.phoneNumber,
  //           carNumber: searchTerms.carNumber,
  //           address: searchTerms.address,
  //           ...(searchTerms.isDeleted !== undefined
  //             ? { isDeleted: searchTerms.isDeleted }
  //             : {}),
  //           ...(searchTerms.isMarketing !== undefined
  //             ? { isMarketing: searchTerms.isMarketing }
  //             : {}),
  //           ...(rangeFilter.key &&
  //             rangeFilter.gte &&
  //             rangeFilter.lte && {
  //               [rangeFilter.key]: `${rangeFilter.gte} ~ ${rangeFilter.lte}`,
  //             }),
  //           sortBy: sorting[0]?.id ?? undefined,
  //           sortOrder: sorting[0]?.desc ? "desc" : "asc",
  //         }),
  //       }
  //     );

  //     const blob = await res.blob();

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");

  //     a.href = url;
  //     a.download = `회원목록_${dayjs().format("YYYYMMDD")}.xlsx`;

  //     document.body.appendChild(a);

  //     a.click();
  //     a.remove();

  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error(err);
  //     alert("다운로드 중 오류가 발생했습니다.");
  //   }
  // };

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
      <div className="flex justify-between items-center gap-[24px]">
        <Callout>
          <p className="text-gray5 text-[16px] font-medium">전체 가입자 수</p>
          <p className="mt-[12px] text-[20px] font-semibold">
            {usersCountData?.data.totalUsersCount.toLocaleString() ?? 0} 명
          </p>
        </Callout>

        <Callout>
          <p className="text-gray5 text-[16px] font-medium">신규 가입</p>
          <p className="mt-[12px] text-[20px] font-semibold">
            {usersCountData?.data.totalUsersCount.toLocaleString() ?? 0} 명
          </p>
        </Callout>

        <Callout>
          <p className="text-gray5 text-[16px] font-medium">VIP 회원</p>
          <p className="mt-[12px] text-[20px] font-semibold">
            {usersCountData?.data.totalUsersCount.toLocaleString() ?? 0} 명
          </p>
        </Callout>
      </div>

      <Callout margin="24px 0 0 0">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <p className="text-[16px] font-semibold">회원 리스트</p>
            <div className="flex justify-center items-center ml-[12px] px-[6px] py-[2px] bg-gray1 rounded-[4px]">
              <p className="text-gray7 text-[16px] font-semibold">
                {data?.meta.totalCount.toLocaleString() ?? 0}명
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative flex items-center">
              <input
                value={draftCarNumber}
                onChange={(e) => setDraftCarNumber(e.target.value)}
                maxLength={12}
                placeholder="차량번호 검색"
                className="flex items-center w-[160px] h-[32px] pl-[32px] pr-[8px] text-[13px] border border-line rounded-[8px]"
              />

              <Image
                src={graySearchIcon}
                alt="검색"
                className="absolute size-[20px] left-[8px] z-[1]"
              />
            </div>

            <button className="flex justify-center items-center w-[84px] h-[32px] ml-[12px] border border-line rounded-[8px] cursor-pointer">
              <Image
                src={downloadIcon}
                alt="다운로드"
                className="size-[16px] mr-[4px]"
              />
              <span className="text-[13px]">다운로드</span>
            </button>
          </div>
        </div>

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
    </div>
  );
}

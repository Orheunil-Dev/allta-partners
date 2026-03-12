import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { useCarControllerGetStoreCarList } from "@/api/car/car";
import { StoreCarListItem } from "@/api/models";
import { List } from "@/components/layout/List";
import { CarDeleteModal, CarRegisterModal } from "@/components/car";
import { plusIcon, trashCanIcon } from "../../../public/images";

export default function CarList() {
  const [page, setPage] = useState<number>(0);
  const [carNumber, setCarNumber] = useState<string>("");
  const [draftCarNumber, setDraftCarNumber] = useState<string>("");
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [deleteCarId, setDeleteCarId] = useState<string | undefined>(undefined);

  // 차량메모 내역 목록 조회 API
  const { data, isLoading, isError, refetch } = useCarControllerGetStoreCarList(
    {
      ...(carNumber && { carNumber }),
      take: 10,
      skip: 10 * page,
    },
    {
      query: {
        queryKey: ["cars"],
      },
    },
  );

  const columns = useMemo<ColumnDef<StoreCarListItem>[]>(
    () => [
      {
        id: "carNumber",
        header: "차량번호",
        accessorFn: (row) => row.carNumber,
        enableSorting: false,
      },

      {
        id: "memo",
        header: "메모",
        accessorFn: (row) => row.memo,
        enableSorting: false,
      },
      {
        id: "delete",
        header: "삭제",
        cell: ({ row }) => (
          <button
            onClick={() => setDeleteCarId(row.original.id)}
            className="[6px] cursor-pointer"
          >
            <Image src={trashCanIcon} alt="삭제" className="size-[28px]" />
          </button>
        ),
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
    <div className="flex flex-col max-w-[1000px] h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <CarRegisterModal
        visible={showRegister}
        onClose={() => setShowRegister(false)}
      />

      <CarDeleteModal
        id={deleteCarId}
        onClose={() => setDeleteCarId(undefined)}
      />

      <List
        title="등록 차량"
        data={data?.data ?? []}
        columns={columns}
        totalCount={data?.meta.totalCount}
        take={10}
        page={page}
        setPage={setPage}
        draftCarNumber={draftCarNumber}
        setDraftCarNumber={setDraftCarNumber}
        totalCountUnit="대"
        extraButton={
          <button
            onClick={() => setShowRegister(true)}
            className="flex justify-center items-center w-[84px] h-[32px] ml-[12px] border border-line rounded-[8px] cursor-pointer"
          >
            <Image
              src={plusIcon}
              alt="차량추가"
              className="size-[20px] mr-[2px]"
            />
            <p className="text-[13px]">차량추가</p>
          </button>
        }
      />
    </div>
  );
}

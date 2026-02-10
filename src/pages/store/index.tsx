import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useStoreControllerGetStoreList } from "@/api/store/store";
import { Callout } from "@/components/ui/Callout";
import { Pagination } from "@/components/ui/Pagination";
import { addressIcon, phoneIcon } from "../../../public/images";

export default function StoreList() {
  const router = useRouter();

  const [page, setPage] = useState<number>(0);

  // 매장 목록 조회 API
  const { data, isLoading, isError, refetch } = useStoreControllerGetStoreList({
    take: 20,
    skip: 20 * page,
  });

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[24px]">
        {data?.data.map((value, index) => (
          <Callout
            key={value.id}
            onClick={() => router.push(`/store/${value.id}`)}
          >
            <p className="text-[16px] font-semibold">{value.name}</p>

            <div className="mt-[12px] flex items-center">
              <Image
                src={addressIcon}
                alt="주소"
                className="size-[16px] mr-[6px]"
              />
              <p className="text-gray5 text-[14px]">{value.address}</p>
            </div>

            <div className="mt-[4px] flex items-center">
              <Image
                src={phoneIcon}
                alt="전화번호"
                className="size-[16px] mr-[6px]"
              />
              <p className="text-gray5 text-[14px]">{value.phoneNumber}</p>
            </div>
          </Callout>
        ))}
      </div>

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

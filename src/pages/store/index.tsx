import { useMemo, useState } from "react";

import { useStoreControllerGetStoreList } from "@/api/store/store";

import { Pagination } from "@/components/ui/Pagination";
import { useRouter } from "next/router";

type SearchTerms = {
  name?: string;
  phoneNumber?: string;
  address?: string;
  serviceType?: string;
};

type RangeFilter = {
  key?: string;
  gte?: string;
  lte?: string;
};

export default function StoreList() {
  const router = useRouter();

  const [page, setPage] = useState<number>(0);

  // 매장 목록 조회 API
  const { data, isLoading, isError, refetch } = useStoreControllerGetStoreList({
    take: 20,
    skip: 20 * page,
  });

  return (
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px]  md:p-[40px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-x-[24px]">
        {data?.data.map((value, index) => (
          <div
            key={index}
            onClick={() => router.push(`/store/${value.id}`)}
            className="flex flex-col p-[16px]  bg-white rounded-[20px] cursor-pointer"
          >
            <div
              className="w-full h-[200px] rounded-[8px]"
              style={{
                backgroundImage: `url(${value?.mainImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <p>{value.name}</p>
            <p>{value.phoneNumber}</p>
            <p>{value.address}</p>
          </div>
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

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
    <div className="flex flex-col h-full px-[20px] pt-[60px] pb-[40px] md:px-[80px] md:py-[40px] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-[24px]">
        {data?.data.map((value, index) => (
          <div
            key={`store_${index}`}
            onClick={() => router.push(`/store/${value.id}`)}
            className="flex flex-col p-[20px] bg-white rounded-[20px] cursor-pointer"
          >
            <div
              className="w-full h-[160px] lg:h-[198px] rounded-[12px]"
              style={{
                backgroundImage: `url(${value?.mainImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
            <p className="mt-[20px] text-[16px] font-semibold">{value.name}</p>
            <p className="mt-[4px] text-[14px]">{value.address}</p>
            <p className="text-[14px]">{value.phoneNumber}</p>
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

import { useStoreControllerGetManagedStoreList } from "@/api/store/store";
import {
  DashboardSalesChart,
  StoreSummary,
  Summary,
  WeeklySales,
} from "@/components/dashboard";

export default function Dashboard() {
  //  관리자 권한 있는 매장 목록 조회 API
  const { data } = useStoreControllerGetManagedStoreList({
    query: {
      staleTime: 1000 * 60 * 30, // 30분 동안 캐시 신선
      gcTime: 1000 * 60 * 60, // 1시간 동안 메모리에 데이터 캐싱
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 막기
      queryKey: ["managedStoreList"],
    },
  });

  return (
    <div className="flex flex-col w-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px]">
      <p className="mb-[12px] text-[20px] font-semibold">전체 매출 현황</p>

      <Summary />

      <div className="flex flex-col mt-[40px]">
        <p className="text-[20px] font-semibold">매장별 매출 현황</p>

        <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 mt-[12px] gap-[24px]">
          {data?.data.map((value, index) => (
            <StoreSummary
              key={value.id}
              storeId={value.id}
              storeName={value.name}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row mt-[40px] gap-[24px]">
        <DashboardSalesChart />
        <WeeklySales />
      </div>
    </div>
  );
}

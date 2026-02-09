import { useGetManagedStoreList } from "@/hooks";
import {
  DashboardSalesChart,
  StoreSummary,
  Summary,
  WeeklySales,
} from "@/components/dashboard";

export default function Dashboard() {
  // 관리자 권한 있는 매장 목록
  const managedStoreList = useGetManagedStoreList();

  return (
    <div className="flex flex-col w-full py-[40px] px-[20px] md:px-[80px]">
      <p className="mb-[12px] text-[20px] font-semibold">전체 매출 현황</p>

      <Summary />

      <div className="flex flex-col mt-[40px]">
        <p className="text-[20px] font-semibold">매장별 매출 현황</p>

        <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 mt-[12px] gap-[24px]">
          {managedStoreList.map((value, index) => (
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

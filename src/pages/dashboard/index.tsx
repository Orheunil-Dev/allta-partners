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
    <div className="flex flex-col w-full px-[120px] py-[40px]">
      <p className="mb-[12px] text-[20px] font-semibold">전체 매출 현황</p>

      <Summary />

      <div className="flex flex-col xl:flex-row gap-x-[24px]">
        <DashboardSalesChart />
        <WeeklySales />
      </div>

      <div className="flex flex-col mt-[40px]">
        <p className="text-[20px] font-semibold">매장별 매출 현황</p>

        <div className="flex flex-col mt-[12px] gap-x-[24px] gap-y-[24px]">
          {managedStoreList.map((value, index) => (
            <StoreSummary storeId={value.id} storeName={value.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

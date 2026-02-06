import { useState } from "react";
import dayjs from "dayjs";
import { useSalesControllerGetSalesStatByPassType } from "@/api/sales/sales";
import { ConditionBar } from "@/components/layout/ConditionBar";
import {
  SalesByPassTypeChart,
  SalesByProductTypeChart,
  SalesList,
  SalesSummary,
} from "@/components/sales-report";

export default function Dashboard() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

  // 매출 통계 조회 API
  const {
    data: salesStatData,
    isLoading: salesStatLoading,
    isError: salesStatError,
  } = useSalesControllerGetSalesStatByPassType({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
  });

  return (
    <div className="flex flex-col w-full px-[120px] py-[40px]">
      <ConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <SalesSummary storeId={storeId} startDate={startDate} endDate={endDate} />

      <div className="flex flex-col xl:flex-row gap-x-[24px]">
        <SalesByPassTypeChart
          data={salesStatData}
          isLoading={salesStatLoading}
          isError={salesStatError}
        />
        <SalesByProductTypeChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <SalesList storeId={storeId} startDate={startDate} endDate={endDate} />
    </div>
  );
}

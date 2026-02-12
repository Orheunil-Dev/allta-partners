import { useState } from "react";
import dayjs from "dayjs";
import { ConditionBar } from "@/components/layout/ConditionBar";
import {
  SalesByPassTypeChart,
  SalesByPaymentMethod,
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

  return (
    <div className="flex flex-col w-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px]">
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
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
        <SalesByProductTypeChart
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <SalesByPaymentMethod
        storeId={storeId}
        startDate={startDate}
        endDate={endDate}
      />

      <SalesList storeId={storeId} startDate={startDate} endDate={endDate} />
    </div>
  );
}

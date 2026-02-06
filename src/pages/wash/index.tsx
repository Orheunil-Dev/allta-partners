import { useState } from "react";
import dayjs from "dayjs";
import {
  HourServiceChart,
  ServiceHistoryList,
  ServiceSummary,
  WeekdayServiceChart,
} from "@/components/wash";
import { ConditionBar } from "@/components/layout/ConditionBar";
import { ComplimentaryServiceList } from "@/components/wash/ComplimentaryServiceList";

export default function Wash() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(29, "day").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));

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

      <div className="flex flex-col xl:flex-row xl:h-[298px] gap-[24px]">
        <ServiceSummary
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
        <ComplimentaryServiceList
          storeId={storeId}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-2 w-full mt-[24px] gap-[24px]">
        <WeekdayServiceChart storeId={storeId} />
        <HourServiceChart storeId={storeId} />
      </div>

      <ServiceHistoryList
        storeId={storeId}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
}

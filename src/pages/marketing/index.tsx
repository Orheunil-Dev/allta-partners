import { useEffect, useState } from "react";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import {
  MarketingRoiChart,
  MarketingSummary,
  VisitCohortChart,
} from "@/components/marketing";

export default function Setting() {
  const [storeId, setStoreId] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px]">
      <SimpleConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        showEntireStore={false}
      />

      <MarketingSummary storeId={storeId} />

      <div className="flex flex-col xl:flex-row gap-x-[24px]">
        <MarketingRoiChart storeId={storeId} />

        <VisitCohortChart storeId={storeId} />
      </div>
    </div>
  );
}

import { useState } from "react";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import { ExpectedSalesChart } from "@/components/sales-trend";

export default function Weather() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] gap-y-[24px] overflow-y-auto">
      <SimpleConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        setStoreName={setStoreName}
        showEntireStore={false}
      />

      <ExpectedSalesChart storeId={storeId} />
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  useStoreOperationControllerGetMonthlyStoreOperationList,
  useStoreOperationControllerGetDailyStoreOperation,
} from "@/api/store-operation/store-operation";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import { Calendar } from "@/components/ui/Calendar";
import {
  CashHistoryModal,
  PettyCash,
  StoreOperationSummary,
} from "@/components/store-operation";

export default function StoreOperation() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  // 오늘 매장 운영 정보 조회 API
  const {
    data: dailydata,
    isLoading: dailyLoading,
    isError: dailyError,
    refetch: dailyRefetch,
  } = useStoreOperationControllerGetDailyStoreOperation(
    { storeId: storeId! },
    { query: { enabled: !!storeId } },
  );

  // 월별 매장 운영 정보 목록 조회 API
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
    refetch: monthlyRefetch,
  } = useStoreOperationControllerGetMonthlyStoreOperationList(
    {
      storeId: storeId!,
      period: `${year}-${month.toString().padStart(2, "0")}`,
    },
    { query: { enabled: !!storeId } },
  );

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <CashHistoryModal
        storeId={storeId}
        storeName={storeName}
        date={date}
        onClose={() => setDate(null)}
      />

      <SimpleConditionBar
        storeId={storeId}
        setStoreId={setStoreId}
        setStoreName={setStoreName}
        showEntireStore={false}
      />

      <div className="flex flex-col xl:flex-row mt-[24px] gap-[24px]">
        <PettyCash
          storeId={storeId}
          data={dailydata?.data}
          dailyRefetch={dailyRefetch}
          monthlyRefetch={monthlyRefetch}
        />

        <div className="flex flex-col flex-1">
          <StoreOperationSummary data={dailydata?.data} />

          <Calendar
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            onClick={(d) => setDate(d)}
            item={(date) => {
              if (!monthlyData?.data) return;

              const operationMap = new Map(
                monthlyData.data.map((value) => [
                  dayjs(value.date).format("YYYY-MM-DD"),
                  value,
                ]),
              );

              const key = date.format("YYYY-MM-DD");
              const operation = operationMap.get(key);

              if (!operation) return null;

              return (
                <div className="flex flex-col px-[8px] gap-y-[4px] text-[14px]">
                  <div className="flex items-center mt-[12px] gap-x-[6px]">
                    <p className="text-gray5">오픈</p>
                    <p className="font-semibold">
                      {dayjs(operation.openedAt).format("HH:mm")}
                    </p>
                  </div>

                  <div className="flex items-center gap-x-[6px]">
                    <p className="text-gray5">마감</p>
                    <p className="font-semibold">
                      {operation.closedAt
                        ? dayjs(operation.closedAt).format("HH:mm")
                        : "-"}
                    </p>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

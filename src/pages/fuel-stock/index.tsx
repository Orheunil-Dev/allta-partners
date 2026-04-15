import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import dayjs from "dayjs";
import { useFuelStockControllerGetMonthlyFuelStockSummaryList } from "@/api/fuel-stock/fuel-stock";
import { useFuelSalesControllerGetFuelSalesByFuelType } from "@/api/fuel-sales/fuel-sales";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import { Calendar } from "@/components/ui/Calendar";
import {
  FuelStockHistoryModal,
  FuleStockSummary,
} from "@/components/fuel-stock";

export default function FuelStock() {
  const router = useRouter();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  // 오늘 주유 매출 요약 조회 API
  const {
    data: dailydata,
    isLoading: dailyLoading,
    isError: dailyError,
    refetch: dailyRefetch,
  } = useFuelSalesControllerGetFuelSalesByFuelType(
    { storeId: storeId!, startDate: dayjs().format("YYYY-MM-DD") },
    { query: { enabled: !!storeId } },
  );

  // 월별 매장 운영 정보 목록 조회 API
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
    refetch: monthlyRefetch,
  } = useFuelStockControllerGetMonthlyFuelStockSummaryList(
    {
      storeId: storeId!,
      period: `${year}-${month.toString().padStart(2, "0")}`,
    },
    {
      query: {
        enabled: !!storeId,
        queryKey: ["monthlyFuelStockSummary", storeId, year, month],
      },
    },
  );

  useEffect(() => {
    const queryStoreId = router.query.storeId;
    const queryYear = router.query.year;
    const queryMonth = router.query.month;

    if (typeof queryStoreId === "string") {
      setStoreId(queryStoreId);
    }

    if (typeof queryYear === "string" && typeof queryMonth === "string") {
      const yearNum = Number(queryYear);
      const monthNum = Number(queryMonth);

      const isValidYear = Number.isInteger(yearNum) && queryYear.length === 4;

      const isValidMonth =
        Number.isInteger(monthNum) && monthNum >= 1 && monthNum <= 12;

      if (isValidYear && isValidMonth) {
        setYear(yearNum);
        setMonth(monthNum);
      }
    }
  }, [router.query.storeId, router.query.year, router.query.month]);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <FuelStockHistoryModal
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
        <div className="flex flex-col flex-1">
          <FuleStockSummary data={dailydata?.data} />

          <Calendar
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            onClick={(d) => setDate(d)}
            item={(date) => {
              if (!monthlyData?.data) return;

              const summaryMap = new Map(
                monthlyData.data.map((value) => [
                  dayjs(value.date).format("YYYY-MM-DD"),
                  value,
                ]),
              );

              const key = date.format("YYYY-MM-DD");
              const summary = summaryMap.get(key);

              if (!summary) return null;

              return (
                <div className="flex flex-col mt-[2px] px-[8px] gap-y-[2px] text-[14px] font-medium">
                  <div className="flex items-center gap-[6px]">
                    <p className="text-[#EB8723]">휘</p>
                    <p>{summary.gasolineIncomeVolume.toLocaleString()}L</p>
                  </div>

                  <div className="flex items-center gap-[6px]">
                    <p className="text-[#3B67D7]">경</p>
                    <p>{summary.gasolineIncomeVolume.toLocaleString()}L</p>
                  </div>

                  <div className="flex items-center gap-[6px]">
                    <p className="text-[#4BD168]">고</p>
                    <p>{summary.gasolineIncomeVolume.toLocaleString()}L</p>
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

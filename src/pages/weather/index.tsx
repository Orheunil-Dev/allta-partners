import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import { useWeatherControllerGetMonthlyWeatherHistoryList } from "@/api/weather/weather";
import { normalizeWeather } from "@/utils";
import { SimpleConditionBar } from "@/components/layout/ConditionBar";
import { Calendar } from "@/components/ui/Calendar";
import { WeatherHistoryModal } from "@/components/weather";
import {
  rainIcon,
  rainSnowIcon,
  snowIcon,
  sunnyIcon,
} from "../../../public/images";

export default function Weather() {
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  // 월별 매장 운영 정보 목록 조회 API
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
    refetch: monthlyRefetch,
  } = useWeatherControllerGetMonthlyWeatherHistoryList(
    {
      storeId: storeId!,
      period: `${year}-${month.toString().padStart(2, "0")}`,
    },
    { query: { enabled: !!storeId } },
  );

  const renderWeatherIcon = (weather: string | null) => {
    const normalized = normalizeWeather(weather);

    switch (normalized) {
      case "Rain":
        return rainIcon;
      case "Snow":
        return snowIcon;
      case "Mixed":
        return rainSnowIcon;
      default:
        return sunnyIcon;
    }
  };

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] gap-y-[24px] overflow-y-auto">
      <WeatherHistoryModal
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

      <Calendar
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        onClick={(d) => setDate(d)}
        item={(date) => {
          if (!monthlyData?.data) return;

          const weatherMap = new Map(
            monthlyData.data.map((value) => [
              dayjs(value.date).format("YYYY-MM-DD"),
              value,
            ]),
          );

          const key = date.format("YYYY-MM-DD");
          const weather = weatherMap.get(key);

          if (!weather) return null;

          return (
            <div className="flex flex-col px-[8px] gap-y-[4px] text-[14px]">
              <div className="flex items-center mt-[12px] gap-x-[4px]">
                <Image
                  src={renderWeatherIcon(weather.precipitationType ?? null)}
                  alt={weather.precipitationType ?? "맑음"}
                  className="size-[24px]"
                />

                <p className="text-gray5">
                  <strong className="text-blue font-medium">
                    {weather.averageTemperatureToday}°
                  </strong>
                  /
                  <strong className="text-red font-medium">
                    {weather.averageTemperatureToday}°
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-x-[6px]">
                <p className="text-gray5">매출</p>
                <p className="font-semibold">
                  {weather.totalSales.toLocaleString()}원
                </p>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

import { useMemo } from "react";
import Image from "next/image";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useServiceControllerGetServiceStatByWeekday } from "@/api/service/service";
import { Callout } from "../ui/Callout";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

interface Props {
  storeId?: string | null;
}

export const WeekdayServiceChart = ({ storeId }: Props) => {
  // 매출 통계 조회 API
  const {
    data: weekdayStatData,
    isLoading: weekdayStatLoading,
    isError: weekdayStatError,
  } = useServiceControllerGetServiceStatByWeekday({
    storeIds: storeId ? [storeId] : [],
  });

  const chartData = useMemo(() => {
    const rawData = weekdayStatData?.data ?? [];

    return {
      labels: WEEKDAYS,
      datasets: [
        {
          label: "세차 횟수",
          data: WEEKDAYS.map((day) => {
            const item = rawData.find((d) => d.weekday === day);
            return item ? Number(item.service) : 0;
          }),
          maxBarThickness: 36,
          backgroundColor: "#5E5CE5",
          borderRadius: 4,
        },
      ],
    };
  }, [weekdayStatData]);

  return (
    <Callout>
      <p className="text-[18px] font-semibold">요일별 세차 통계</p>

      <div className="h-[278px] mt-[24px]">
        <Chart
          type="bar"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
              mode: "index",
              intersect: false,
            },
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                type: "linear",
                position: "left",
                stacked: true,
                beginAtZero: true,
                grace: "10%",
                ticks: { maxTicksLimit: 8 },
                border: { dash: [4, 4] },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
          }}
        />
      </div>
    </Callout>
  );
};

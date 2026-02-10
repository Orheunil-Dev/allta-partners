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
  Filler,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import {
  useServiceControllerGetServiceStatByHour,
  useServiceControllerGetServiceStatByWeekday,
} from "@/api/service/service";
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
  Filler,
);

interface Props {
  storeId?: string | null;
}

export const HourServiceChart = ({ storeId }: Props) => {
  // 매출 통계 조회 API
  const {
    data: hourStatData,
    isLoading: hourStatLoading,
    isError: hourStatError,
  } = useServiceControllerGetServiceStatByHour({
    storeIds: storeId ? [storeId] : [],
  });

  const chartData = useMemo(() => {
    const rawData = hourStatData?.data ?? [];

    return {
      labels: rawData.map((item) => item.hour),
      datasets: [
        {
          label: "세차 횟수",
          data: rawData.map((item) => Number(item.service)),
          borderColor: "#FFA425",
          borderWidth: 2,
          backgroundColor: "rgba(255, 164, 37, 0.25)",
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    };
  }, [hourStatData]);

  return (
    <Callout>
      <p className="text-[16px] font-semibold">시간대별 세차 통계</p>

      <div className="h-[278px] mt-[24px]">
        <Chart
          type="line"
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

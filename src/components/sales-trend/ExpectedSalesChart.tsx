import { useMemo, useState } from "react";
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
import { useExpectControllerGetExpectedSales } from "@/api/expect/expect";
import { ExpectedSalesItem } from "@/api/models";
import { Period } from "@/types";
import { Callout } from "../ui/Callout";
import { PeriodSelect } from "../ui/Select";

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
  storeId: string | null;
}

export const ExpectedSalesChart = ({ storeId }: Props) => {
  if (!storeId) return;

  const [period, setPeriod] = useState<Period>("MONTH");

  // 예상 매출 조회 API
  const { data, isLoading, isError } = useExpectControllerGetExpectedSales(
    { storeId, period },
    { query: { enabled: !!storeId } },
  );

  console.log(data);

  const chartData = useMemo(() => {
    const rawData = data?.data ?? [];

    const labels = rawData.map((item: ExpectedSalesItem) => {
      return item.date;
    });

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "실제 매출",
          data: rawData.map((item) => Number(item.actualSales)),
          backgroundColor: (context: any) => {
            const { ctx, chartArea } = context.chart;
            if (!chartArea) return;

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom,
            );

            gradient.addColorStop(0, "rgba(181, 180, 232, 0.1)");
            gradient.addColorStop(1, "rgba(94,92,229,0.4)");

            return gradient;
          },
          borderWidth: 2,
          borderColor: "#5E5CE5",
          tension: 0.3,
          fill: true,
          order: 1,
        },
        {
          type: "line" as const,
          label: "예상 매출",
          data: rawData.map((item) => Number(item.expectedSales)),
          backgroundColor: "#FFA425",
          borderColor: "#FFA425",
          tension: 0.3,
          borderDash: [6, 6],
          order: 0,
        },
      ],
    };
  }, [data]);

  return (
    <Callout height="680px" padding="20px 20px 80px 20px">
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center w-full mb-[20px] gap-[12px]">
        <div className="flex items-center">
          <p className="text-[16px] font-semibold">매출 트렌드</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">실제 매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#FFA425] rounded-full" />
            <p>예상 매출</p>
          </div>
        </div>

        <PeriodSelect period={period} setPeriod={setPeriod} />
      </div>

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
              grid: {
                display: false,
              },
            },
            y: {
              type: "linear",
              position: "left",
              beginAtZero: true,
              grace: "10%",
              ticks: { maxTicksLimit: 10 },
              border: { dash: [4, 4] },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              callbacks: {
                labelColor: (context) => {
                  if (context.dataset.label === "실제 매출") {
                    return {
                      borderColor: "#5E5CE5",
                      backgroundColor: "#5E5CE5",
                    };
                  }

                  return {
                    borderColor: "#FFA425",
                    backgroundColor: "#FFA425",
                  };
                },
              },
            },
          },
        }}
      />

      {!data ||
        (!data.data.length && (
          <p className="absolute top-[50%] self-center text-gray5 text-[18px] font-semibold">
            매출 데이터가 부족해 분석에 실패했습니다.
          </p>
        ))}
    </Callout>
  );
};

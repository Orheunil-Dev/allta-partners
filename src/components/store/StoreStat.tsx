import { useMemo, useState } from "react";
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
import dayjs from "dayjs";
import { useStatControllerGetSalesStat } from "@/api/stat/stat";
import { SalesStatItem } from "@/api/models";
import { Period } from "@/types";
import { Callout } from "../ui/Callout";
import { downloadIcon } from "../../../public/images";
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
);

interface Props {
  storeId: string;
}

export const StoreStat = ({ storeId }: Props) => {
  const [period, setPeriod] = useState<Period>("DAY");

  // 매출 통계 조회 API
  const {
    data: salesStatData,
    isLoading: salesStatLoading,
    isError: salesStatError,
  } = useStatControllerGetSalesStat({
    period,
    storeIds: [storeId],
  });

  // 매출 통계 추출
  const handleDownload = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/stat/sales/export`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ period, storeIds: [storeId] }),
        },
      );

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `매출통계_${dayjs().format("YYYYMMDD")}.xlsx`;

      document.body.appendChild(a);

      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const chartData = useMemo(() => {
    const rawData = salesStatData?.data ?? [];

    const labels = rawData.map((item: SalesStatItem) => {
      const dateObj = dayjs(item.date);
      if (period === "DAY") {
        return dateObj.format("MM.DD");
      } else if (period === "WEEK") {
        const month = dateObj.month() + 1;
        const weekOfMonth = Math.ceil(dateObj.date() / 7);
        return `${month}월 ${weekOfMonth}주`;
      } else {
        return dateObj.format("YYYY-MM");
      }
    });

    const newSales = rawData.map((item: SalesStatItem) =>
      Number(item.newSales),
    );
    const totalSales = rawData.map((item: SalesStatItem) =>
      Number(item.totalSales),
    );

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "누적 매출",
          data: totalSales,
          borderColor: "#F69713",
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          fill: false,
          yAxisID: "y",
          tension: 0.4,
        },
        {
          type: "bar" as const,
          label: "신규 매출",
          data: newSales,
          backgroundColor: "#5E5CE5",
          borderRadius: 4,
          yAxisID: "y1",
        },
      ],
    };
  }, [salesStatData, period]);

  return (
    <Callout flex={1}>
      <div className="flex justify-between items-center w-full mb-[20px] gap-x-[12px]">
        <div className="flex items-center">
          <p className="text-[16px] font-semibold">매장 매출 통계</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">신규 매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#F69713] rounded-full" />
            <p>누적 매출</p>
          </div>
        </div>

        <div className="flex items-center gap-x-[12px]">
          <PeriodSelect period={period} setPeriod={setPeriod} />

          <button
            onClick={handleDownload}
            className="flex justify-center items-center w-[88px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
          >
            <Image
              src={downloadIcon}
              alt="다운로드"
              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[6px]"
            />
            <span className="text-[12px] md:text-[13px]">다운로드</span>
          </button>
        </div>
      </div>

      <div className="flex h-full justify-center items-center">
        <Chart
          type="bar"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: {
              mode: "nearest",
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
                position: "right",
                beginAtZero: true,
                grace: "10%",
                ticks: { maxTicksLimit: 8 },
                border: { dash: [4, 4] },
              },
              y1: {
                type: "linear",
                position: "left",
                beginAtZero: true,
                grid: { drawOnChartArea: false },
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

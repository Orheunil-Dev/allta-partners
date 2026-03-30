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
} from "chart.js";
import { Chart } from "react-chartjs-2";
import dayjs from "dayjs";
import { useSalesControllerGetSalesStatByMarketingSpend } from "@/api/sales/sales";
import { MarketingSpendSalesStatItem } from "@/api/models";
import { Period } from "@/types";
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
  storeId?: string | null;
}

export const MarketingRoiChart = ({ storeId }: Props) => {
  if (!storeId) return;

  const [period, setPeriod] = useState<Period>("DAY");

  // 매출 대비 마케팅 지출 통계 조회 API
  const { data, isLoading, isError } =
    useSalesControllerGetSalesStatByMarketingSpend(
      { storeId, period },
      { query: { enabled: !!storeId } },
    );

  const chartData = useMemo(() => {
    const rawData = data?.data ?? [];

    const labels = rawData.map((item: MarketingSpendSalesStatItem) => {
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

    return {
      labels,
      datasets: [
        {
          label: "매출",
          data: rawData.map((item) => Number(item.sales)),
          backgroundColor: "#5E5CE5",
          borderRadius: 4,
          grouped: false,
          order: 1,
        },
        {
          label: "마케팅 비용",
          data: rawData.map((item) => Number(item.marketingSpend)),
          backgroundColor: "#FFA425",
          borderRadius: 4,
          stack: "total",
        },
        {
          label: "순매출",
          data: rawData.map((item) => Number(item.netSales)),
          backgroundColor: "transparent",
          borderRadius: 4,
          stack: "total",
        },
      ],
    };
  }, [data, period]);

  return (
    <div
      className="flex flex-col justify-center items-center xl:flex-1 min-w-0 h-[376px] mt-[24px] px-[24px] pt-[60px] lg:pt-[50px] pb-[50px] lg:pb-[40px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center w-full mb-[20px] gap-[12px]">
        <div className="flex items-center">
          <p className="text-[16px] font-semibold">비용 대비 매출 통계</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#FFA425] rounded-full" />
            <p className="mr-[16px]">마케팅 비용</p>
          </div>
        </div>

        <div className="flex items-center gap-x-[12px]">
          <PeriodSelect period={period} setPeriod={setPeriod} />

          {/* <button
            onClick={() => {}}
            className="flex justify-center items-center w-[88px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
          >
            <Image
              src={downloadIcon}
              alt="다운로드"
              className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[6px]"
            />
            <span className="text-[12px] md:text-[13px]">다운로드</span>
          </button> */}
        </div>
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
              ticks: { maxTicksLimit: 8 },
              border: { dash: [4, 4] },
              min: 0,
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              itemSort: (a, b) => {
                const order = ["매출", "마케팅 비용", "순매출"];
                return (
                  order.indexOf(a.dataset.label as string) -
                  order.indexOf(b.dataset.label as string)
                );
              },
            },
          },
        }}
      />
    </div>
  );
};

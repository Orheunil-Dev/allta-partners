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
import dayjs from "dayjs";
import {
  GetSalesStatByPassTypeResponse,
  PassTypeSalesStatItem,
} from "@/api/models";
import { downloadIcon } from "../../../public/images";

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
  data: GetSalesStatByPassTypeResponse | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const SalesByPassTypeChart = ({ data, isLoading, isError }: Props) => {
  // // 매출 통계 추출
  // const handleDownload = async () => {
  //   try {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/stat/sales/export`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include",
  //         body: JSON.stringify({ period }),
  //       },
  //     );

  //     const blob = await res.blob();

  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");

  //     a.href = url;
  //     a.download = `매출통계_${dayjs().format("YYYYMMDD")}.xlsx`;

  //     document.body.appendChild(a);

  //     a.click();
  //     a.remove();

  //     window.URL.revokeObjectURL(url);
  //   } catch (err) {
  //     console.error(err);
  //     alert("다운로드 중 오류가 발생했습니다.");
  //   }
  // };

  const chartData = useMemo(() => {
    const rawData = data?.data ?? [];

    const labels = rawData.map((item: PassTypeSalesStatItem) => {
      const dateObj = dayjs(item.date);
      return dateObj.format("MM.DD");
    });

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "전체 매출",
          data: rawData.map((item) => Number(item.totalSales)),
          borderColor: "transparent",
          backgroundColor: "transparent",
          fill: false,
        },
        {
          label: "구독권",
          data: rawData.map((item) => Number(item.subscriptionSales)),
          backgroundColor: "#5E5CE5",
          borderRadius: 4,
        },
        {
          label: "일회권",
          data: rawData.map((item) => Number(item.ticketSales)),
          backgroundColor: "#F69713",
          borderRadius: 4,
        },
        {
          label: "현장결제",
          data: rawData.map((item) => Number(item.offlineTicketSales)),
          backgroundColor: "#E2F14E",
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  return (
    <div
      className="flex flex-col justify-center items-center xl:flex-[5] min-w-0 h-[376px] mt-[24px] px-[24px] pt-[50px] pb-[40px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      {isError && (
        <p className="text-gray7 font-semibold">데이터 조회에 실패했습니다.</p>
      )}

      <div className="flex justify-between items-center w-full mb-[20px] gap-x-[12px]">
        <div className="flex items-center">
          <p className="text-[18px] font-semibold">매출 통계</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">구독권 매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5CA2E6] rounded-full" />
            <p className="mr-[16px]">일회권 매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#E2F14E] rounded-full" />
            <p>현장결제 매출</p>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="flex justify-center items-center w-[84px] h-[30px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
        >
          <Image
            src={downloadIcon}
            alt="다운로드"
            className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[4px]"
          />
          <p className="text-[12px] md:text-[13px]">다운로드</p>
        </button>
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
  );
};

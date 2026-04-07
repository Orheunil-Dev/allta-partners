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
import { useSalesControllerGetSalesStatByPassType } from "@/api/sales/sales";
import {
  FuelTypeSalesStatItem,
  GetSalesStatByPassTypeResponse,
  PassTypeSalesStatItem,
} from "@/api/models";
import { downloadIcon } from "../../../public/images";
import { useFuelSalesControllerGetSalesStatByFuelType } from "@/api/fuel-sales/fuel-sales";

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
  startDate: string;
  endDate: string;
}

export const FuelSalesByFuelTypeChart = ({
  storeId,
  startDate,
  endDate,
}: Props) => {
  // 매출 통계 조회 API
  const { data, isLoading, isError } =
    useFuelSalesControllerGetSalesStatByFuelType({
      storeId,
      startDate,
      endDate,
    });

  console.log(data);

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

    const labels = rawData.map((item: FuelTypeSalesStatItem) => {
      const dateObj = dayjs(item.date);
      return dateObj.format("MM.DD");
    });

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "전체",
          data: rawData.map((item) => Number(item.totalSales)),
          borderColor: "transparent",
          backgroundColor: "transparent",
          fill: false,
        },
        {
          label: "휘발유",
          data: rawData.map((item) => Number(item.gasSales)),
          backgroundColor: "#5E5CE5",
          borderRadius: 4,
        },
        {
          label: "경유",
          data: rawData.map((item) => Number(item.dieselSales)),
          backgroundColor: "#FFA425",
          borderRadius: 4,
        },
        {
          label: "고급유",
          data: rawData.map((item) => Number(item.premiumGasSales)),
          backgroundColor: "#E2F14E",
          borderRadius: 4,
        },
      ],
    };
  }, [data]);

  return (
    <div
      className="flex flex-col justify-center items-center xl:flex-[5] min-w-0 h-[376px] mt-[24px] px-[24px] pt-[60px] lg:pt-[50px] pb-[50px] lg:pb-[40px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center w-full mb-[20px] gap-[12px]">
        <div className="flex items-center">
          <p className="text-[16px] font-semibold">매출 통계</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">휘발유</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#FFA425] rounded-full" />
            <p className="mr-[16px]">경유</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#E2F14E] rounded-full" />
            <p className="mr-[16px]">고급유</p>
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
          <span className="text-[12px] md:text-[13px]">다운로드</span>
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

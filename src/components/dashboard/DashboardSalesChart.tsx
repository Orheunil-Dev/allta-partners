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
import Select, { StylesConfig } from "react-select";
import { useStatControllerGetSalesStat } from "@/api/stat/stat";
import { SalesStatItem } from "@/api/models";
import { SelectOption } from "@/types";
import { periodOptions } from "@/constants";
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

interface Props {}

export const DashboardSalesChart = ({}: Props) => {
  const [period, setPeriod] = useState<"DAY" | "WEEK" | "MONTH">("DAY");

  // 매출 통계 조회 API
  const {
    data: salesStatData,
    isLoading: salesStatLoading,
    isError: salesStatError,
  } = useStatControllerGetSalesStat({
    period,
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
          body: JSON.stringify({ period }),
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
    <div
      className="flex flex-col justify-center items-center xl:flex-[5] min-w-0 h-[358px] px-[24px] pt-[50px] pb-[40px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      {salesStatError && (
        <p className="text-gray7 font-semibold">데이터 조회에 실패했습니다.</p>
      )}

      <div className="flex justify-between items-center w-full mb-[20px] gap-x-[12px]">
        <div className="flex items-center">
          <p className="text-[18px] font-semibold">전체 매출 통계</p>

          <div className="flex items-center ml-[20px] text-gray5 text-[14px]">
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
            <p className="mr-[16px]">신규 매출</p>
            <div className="w-[8px] h-[8px] mr-[6px] bg-[#F69713] rounded-full" />
            <p>누적 매출</p>
          </div>
        </div>

        <div className="flex items-center gap-x-[12px]">
          <Select<SelectOption>
            options={periodOptions}
            value={periodOptions.find((option) => option.value === period)}
            onChange={(option) => {
              if (option && typeof option.value === "string") {
                setPeriod(option.value as "DAY" | "WEEK" | "MONTH");
              }
            }}
            components={{
              IndicatorSeparator: () => null,
            }}
            isSearchable={false}
            styles={selectStyles}
          />

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
  );
};

const selectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "13px",
  }),
  control: (provided) => ({
    ...provided,
    width: "60px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    width: "60px",
    padding: 0,
  }),
  menu: (provided) => ({
    ...provided,
    width: "60px",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "13px",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#262627",
    fontWeight: "600",
    fontSize: "13px",
    padding: 0,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

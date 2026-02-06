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
import Select, { StylesConfig } from "react-select";
import dayjs from "dayjs";
import {
  useSalesControllerGetMoMSales,
  useSalesControllerGetTotalSales,
  useSalesControllerGetYoYSales,
} from "@/api/sales/sales";
import { useStatControllerGetSalesStat } from "@/api/stat/stat";
import { SalesStatItem } from "@/api/models";
import { getChangedRate, getDateBeforeDays } from "@/utils";
import { SelectOption } from "@/types";
import { Callout } from "../ui/Callout";
import { CustomButton } from "../ui/Button";
import { periodOptions } from "@/constants";
import {
  decreaseIcon,
  downloadIcon,
  increaseIcon,
} from "../../../public/images";
import { colors } from "@/styles";

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
  storeName: string;
}

export const StoreSummary = ({ storeId, storeName }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [period, setPeriod] = useState<"DAY" | "WEEK" | "MONTH">("DAY");

  // 금일 매출 조회 API
  const {
    data: todaySalesData,
    isLoading: todaySalesLoading,
    isError: todaySalesError,
  } = useSalesControllerGetTotalSales({
    storeIds: [storeId],
    startDate: getDateBeforeDays(0),
  });

  // 이번달 누적 매출 조회 API
  const {
    data: monthSalesData,
    isLoading: monthSalesLoading,
    isError: monthSalesError,
  } = useSalesControllerGetTotalSales({
    storeIds: [storeId],
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  });

  // 전월 대비 매출 조회 API
  const {
    data: momSalesData,
    isLoading: momSalesLoading,
    isError: momSalesError,
  } = useSalesControllerGetMoMSales({
    storeIds: [storeId],
  });

  // 전년 대비 매출 조회 API
  const {
    data: yoySalesData,
    isLoading: yoySalesLoading,
    isError: yoySalesError,
  } = useSalesControllerGetYoYSales({
    storeIds: [storeId],
  });

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

  // 증감률 표시
  const renderChangedRate = (curSales: number, prevSales: number) => {
    const { percent, direction } = getChangedRate(curSales, prevSales);

    return (
      <div className="flex items-center text-gray5 text-[14px] font-medium">
        {direction === "UP" ? (
          <>
            <Image
              src={increaseIcon}
              alt="증가"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p className="text-green">{Math.abs(percent).toFixed(1)}%</p>
          </>
        ) : direction === "DOWN" ? (
          <>
            <Image
              src={decreaseIcon}
              alt="감소"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p className="text-red">-{Math.abs(percent).toFixed(1)}%</p>
          </>
        ) : (
          <p>-</p>
        )}
      </div>
    );
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
    <Callout>
      <div className="flex flex-col">
        <p className="text=[18px] font-semibold">{storeName}</p>

        <div className="flex items-center mt-[12px]">
          <div className="flex flex-col flex-1 p-[12px]">
            <p className="text-gray5 text-[14px] font-medium">금일 매출</p>
            <p className="mt-[12px] text-[20px] font-semibold">
              {todaySalesData?.data.totalSales
                ? todaySalesData.data.totalSales.toLocaleString()
                : 0}{" "}
              원
            </p>
          </div>

          <div className="w-[1px] h-[40px] mx-[4px] bg-line" />

          <div className="flex flex-col flex-1 p-[12px]">
            <p className="text-gray5 text-[14px] font-medium">
              이번달 누적 매출
            </p>
            <p className="mt-[12px] text-[20px] font-semibold">
              {monthSalesData?.data.totalSales
                ? monthSalesData.data.totalSales.toLocaleString()
                : 0}{" "}
              원
            </p>
          </div>

          <div className="w-[1px] h-[40px] mx-[4px] bg-line" />

          <div className="flex flex-col flex-1 p-[12px]">
            <p className="text-gray5 text-[14px] font-medium">전월 동기 매출</p>

            {momSalesData && (
              <div className="flex items-center mt-[12px]">
                <p className="mr-[8px] text-[20px] font-semibold">
                  {momSalesData?.data.currentSales
                    ? momSalesData.data.currentSales.totalSales.toLocaleString()
                    : 0}{" "}
                  원
                </p>

                {momSalesData.data.previousSales.totalSales > 0 ? (
                  renderChangedRate(
                    momSalesData.data.currentSales.totalSales,
                    momSalesData.data.previousSales.totalSales,
                  )
                ) : (
                  <p className="text-gray5 text-[16px] font-medium">-</p>
                )}
              </div>
            )}
          </div>

          <div className="w-[1px] h-[40px] mx-[4px] bg-line" />

          <div className="flex flex-col flex-1 p-[12px]">
            <p className="text-gray5 text-[14px] font-medium">전년 동기 매출</p>

            {yoySalesData && (
              <div className="flex items-center mt-[12px]">
                <p className="mr-[8px] text-[20px] font-semibold">
                  {yoySalesData?.data.currentSales
                    ? yoySalesData.data.currentSales.totalSales.toLocaleString()
                    : 0}{" "}
                  원
                </p>

                {yoySalesData.data.previousSales.totalSales > 0 ? (
                  renderChangedRate(
                    yoySalesData.data.currentSales.totalSales,
                    yoySalesData.data.previousSales.totalSales,
                  )
                ) : (
                  <p className="text-gray5 text-[16px] font-medium">-</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col items-center duration-300 overflow-hidden ${isOpen ? "h-[340px]" : "h-0"}`}
        >
          <div className="flex justify-between items-center w-full max-w-[920px] mt-[32px] mb-[8px]">
            <div className="flex items-center text-gray5 text-[14px]">
              <div className="w-[8px] h-[8px] mr-[6px] bg-[#5E5CE5] rounded-full" />
              <p className="mr-[16px]">신규 매출</p>
              <div className="w-[8px] h-[8px] mr-[6px] bg-[#F69713] rounded-full" />
              <p>누적 매출</p>
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
                className="flex justify-center items-center w-[84px] h-[36px] bg-white text-gray7 text-[14px] font-semibold rounded-[8px] border border-gray2 cursor-pointer"
              >
                <Image
                  src={downloadIcon}
                  alt="다운로드"
                  className="w-[14px] h-[14px] md:w-[16px] md:h-[16px] mr-[4px]"
                />
                <p className="text-[12px] md:text-[13px]">다운로드</p>
              </button>
            </div>
          </div>

          <div className="w-full max-w-[920px] h-[300px]">
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
        </div>

        <CustomButton
          onClick={() => setIsOpen(!isOpen)}
          width="100%"
          margin="20px 0 0 0"
          backgroundColor={colors.gray1}
        >
          매출 통계 {isOpen ? "접기" : "열기"}
        </CustomButton>
      </div>
    </Callout>
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

import { useMemo } from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useFuelSalesControllerGetSalesByFuelType } from "@/api/fuel-sales/fuel-sales";
import { formatFuelType, getPercent } from "@/utils";
import { colors } from "@/styles";

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

const fuelTypeColorMap: Record<string, string> = {
  GASOLINE: "#5F5CE5",
  DIESEL: "#FFA425",
  PREMIUM_GASOLINE: "#E2F14E",
};

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const FuelSalesDoughnutChart = ({
  storeId,
  startDate,
  endDate,
}: Props) => {
  // 유종별 매출 조회 API
  const { data, isLoading, isError } = useFuelSalesControllerGetSalesByFuelType(
    {
      storeId,
      startDate,
      endDate,
    },
  );

  const chartData = useMemo(() => {
    const rawData = data?.data?.fuelTypeSales ?? [];

    return {
      labels: rawData.map((item) => formatFuelType(item.fuelType)),
      datasets: [
        {
          data: rawData.map((item) => item.salesAmount),
          backgroundColor: rawData.map(
            (item) => fuelTypeColorMap[item.fuelType] ?? colors.gray5,
          ),
          borderWidth: 0,
        },
      ],
    };
  }, [data, startDate, endDate]);

  return (
    <div
      className="flex flex-col flex-[2] min-w-0 h-[376px] mt-[24px] p-[24px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <p className="text-[16px] font-semibold">매출 구성비</p>

      <div className="relative flex justify-center items-center mt-[24px] h-[178px]">
        <Chart
          type="doughnut"
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            cutout: "60%",
            interaction: {
              mode: "index",
              intersect: false,
            },
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
          }}
        />

        {data && data.data.totalSalesAmount > 0 ? (
          <div className="absolute flex flex-col items-center">
            <p className="text-[13px]">Total</p>
            <p className="font-medium">100%</p>
          </div>
        ) : (
          <div className="absolute flex flex-col items-center">
            <p className="text-gray5 text-[16px]">매출 내역이 없습니다.</p>
          </div>
        )}
      </div>

      <div className="flex flex-col mt-[16px] gap-y-[4px]">
        {data &&
          data.data.fuelTypeSales.map((value, index) => (
            <div
              key={index}
              className="flex justify-between text-gray7 text-[14px]"
            >
              <div className="flex items-center">
                <div
                  className="size-[8px] mr-[8px] rounded-full"
                  style={{
                    backgroundColor:
                      fuelTypeColorMap[value.fuelType] ?? colors.gray5,
                  }}
                />
                <p>{formatFuelType(value.fuelType)}</p>
              </div>

              <p>
                {getPercent(
                  value.salesAmount,
                  data.data.totalSalesAmount,
                ).toFixed(0)}
                %
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

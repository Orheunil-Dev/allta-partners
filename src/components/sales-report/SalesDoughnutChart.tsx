import { useMemo } from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useSalesControllerGetSalesByProductType } from "@/api/sales/sales";
import { formatProductType, getPercent } from "@/utils";
import { colors } from "@/styles";

ChartJS.register(ArcElement, DoughnutController, Tooltip, Legend);

const productTypeColorMap: Record<string, string> = {
  PREMIUM: "#5E5CE5",
  STANDARD: "#5CA2E6",
  TICKET: "#FFA425",
  OFFLINE_TICKET: "#E2F14E",
};

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const SalesDoughnutChart = ({ storeId, startDate, endDate }: Props) => {
  // 상품별 매출 조회 API
  const { data, isLoading, isError } = useSalesControllerGetSalesByProductType({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
  });

  const chartData = useMemo(() => {
    const rawData = data?.data?.productTypeSales ?? [];

    return {
      labels: rawData.map((item) => formatProductType(item.productType)),
      datasets: [
        {
          data: rawData.map((item) => item.salesAmount),
          backgroundColor: rawData.map(
            (item) => productTypeColorMap[item.productType] ?? colors.gray5,
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
          data.data.productTypeSales.map((value, index) => (
            <div
              key={index}
              className="flex justify-between text-gray7 text-[14px]"
            >
              <div className="flex items-center">
                <div
                  className="size-[8px] mr-[8px] rounded-full"
                  style={{
                    backgroundColor:
                      productTypeColorMap[value.productType] ?? colors.gray5,
                  }}
                />
                <p>{formatProductType(value.productType)}</p>
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

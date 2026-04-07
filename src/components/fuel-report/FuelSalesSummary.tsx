import { useFuelSalesControllerGetSalesByFuelType } from "@/api/fuel-sales/fuel-sales";

const fuelTypeMap: Record<string, string> = {
  GASOLINE: "휘발유",
  DIESEL: "경유",
  PREMIUM_GASOLINE: "고급유",
  LPG: "LPG",
};

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const FuelSalesSummary = ({ storeId, startDate, endDate }: Props) => {
  // 유종별 매출 조회 API
  const { data, isLoading, isError } = useFuelSalesControllerGetSalesByFuelType(
    {
      storeId,
      startDate,
      endDate,
    },
  );

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 xl:flex xl:flex-row items-center gap-x-[24px] gap-y-[16px] overflow-x-auto">
      <div
        className="flex md:flex-1 w-full px-[24px] py-[20px] bg-white rounded-[16px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">전체 매출</p>
          <p className="mt-[12px] text-[24px] font-semibold">
            {data ? data.data.totalSalesAmount.toLocaleString() : 0}원
          </p>
        </div>
      </div>

      {data &&
        data.data.fuelTypeSales.map((value, index) => (
          <div
            key={value.fuelType}
            className="flex md:flex-1 w-full px-[24px] py-[20px] bg-white rounded-[16px]"
            style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
          >
            <div className="flex flex-col">
              <p className="text-gray5 text-[16px] font-medium">
                {fuelTypeMap[value.fuelType] || value.fuelType}
              </p>
              <p className="mt-[12px] text-[24px] font-semibold">
                {value.salesAmount.toLocaleString()}원
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

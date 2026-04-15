import { FuelTypeFuelSalesResult } from "@/api/models";
import { Callout } from "../ui/Callout";

interface Props {
  data?: FuelTypeFuelSalesResult | null;
}

export const FuleStockSummary = ({ data }: Props) => {
  const totalSales = data?.totalSalesAmount;
  const gasolineSales = data?.fuelTypeSales.find(
    (value) => value.fuelType === "GASOLINE",
  );
  const dieselSales = data?.fuelTypeSales.find(
    (value) => value.fuelType === "DIESEL",
  );
  const premiumSales = data?.fuelTypeSales.find(
    (value) => value.fuelType === "PREMIUM_GASOLINE",
  );

  return (
    <Callout margin="0 0 24px 0">
      <p className="text-[16px] font-semibold">금일 유류 매출 현황</p>

      <div className="grid grid-cols-2 lg:flex lg:justify-between lg:items-center w-full mt-[20px] gap-[24px]">
        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">총 매출액</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {totalSales ? `${totalSales.toLocaleString()}원` : "0원"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">휘발유</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {gasolineSales
              ? `${gasolineSales.salesAmount.toLocaleString()}원`
              : "0원"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">경유</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {dieselSales
              ? `${dieselSales.salesAmount.toLocaleString()}원`
              : "0원"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">고급유</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {premiumSales
              ? `${premiumSales.salesAmount.toLocaleString()}원`
              : "0원"}
          </p>
        </div>
      </div>
    </Callout>
  );
};

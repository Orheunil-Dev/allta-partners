import Image from "next/image";
import { useSalesControllerGetSalesByPassType } from "@/api/sales/sales";
import { todaySalesIcon } from "../../../public/images";

const passTypeMap: Record<string, string> = {
  SUBSCRIPTION: "구독권 매출",
  TICKET: "일회권 매출",
  OFFLINE_TICKET: "현장결제 매출",
};

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const SalesSummary = ({ storeId, startDate, endDate }: Props) => {
  // 이용권별 매출 조회 API
  const {
    data: salesByPassTypeData,
    isLoading: salesByPassTypeLoading,
    isError: salesByPassTypeError,
  } = useSalesControllerGetSalesByPassType({
    storeIds: storeId ? [storeId] : [],
    startDate,
  });

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 xl:flex xl:flex-row items-center gap-x-[24px] gap-y-[16px] overflow-x-auto">
      <div
        className="flex md:flex-1 w-full px-[24px] py-[20px] bg-white rounded-[16px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">전체 매출</p>
          <p className="mt-[12px] text-[24px] font-semibold">
            {salesByPassTypeData
              ? salesByPassTypeData.data.totalSalesAmount.toLocaleString()
              : 0}
            원
          </p>
        </div>
      </div>

      {salesByPassTypeData &&
        salesByPassTypeData.data.passTypeSales.map((value, index) => (
          <div
            key={value.passType}
            className="flex md:flex-1 w-full px-[24px] py-[20px] bg-white rounded-[16px]"
            style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
          >
            <div className="flex flex-col">
              <p className="text-gray5 text-[16px] font-medium">
                {passTypeMap[value.passType] || value.passType}
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

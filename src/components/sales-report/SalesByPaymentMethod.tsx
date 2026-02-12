import { useSalesControllerGetSalesByPaymentMethod } from "@/api/sales/sales";
import { formatPaymentMethod, getPercent } from "@/utils";
import { Callout } from "../ui/Callout";

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const SalesByPaymentMethod = ({
  storeId,
  startDate,
  endDate,
}: Props) => {
  // 결제수단별 매출 조회 API
  const { data, isLoading, isError } =
    useSalesControllerGetSalesByPaymentMethod({
      storeIds: storeId ? [storeId] : [],
      startDate,
      endDate,
    });

  return (
    <Callout margin="24px 0 0 0">
      <p className="text-[16px] font-semibold">결제수단별 매출</p>

      <div className="flex flex-col md:grid md:grid-cols-2 xl:flex xl:flex-row xl:justify-between mt-[24px] gap-[24px]">
        {data?.data.paymentMethodSales.map((value, index) => (
          <div
            key={value.paymentMethod}
            className="w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]"
          >
            <p className="text-gray7 text-[14px] font-medium">
              {formatPaymentMethod(value.paymentMethod)}
            </p>

            <div className="flex justify-between items-center mt-[8px]">
              <p className="text-[20px] font-semibold">
                {value.salesAmount.toLocaleString()} 원
              </p>
              <p className="text-[16px] font-medium">
                {getPercent(data.data.totalSalesAmount, value.salesAmount)}%
              </p>
            </div>
          </div>
        ))}

        <div className="w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px] font-medium">간편결제</p>

          <div className="flex justify-between items-center mt-[8px]">
            <p className="text-[20px] font-semibold">0 원</p>
            <p className="text-[16px] font-medium">0%</p>
          </div>
        </div>
      </div>
    </Callout>
  );
};

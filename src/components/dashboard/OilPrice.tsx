import { useOilPriceControllerGetStoreOilPrice } from "@/api/oil-price/oil-price";
import { colors } from "@/styles";
import { getFuelTypeColor } from "@/utils";

interface Props {
  storeId?: string | null;
}

export const OilPrice = ({ storeId }: Props) => {
  // 매장 유가 정보 조회 API
  const {
    data: oilPriceData,
    isLoading: oilPriceLoading,
    isError: oilPriceError,
  } = useOilPriceControllerGetStoreOilPrice(
    {
      storeId: storeId ?? "",
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  const formatPriceDateTime = (date: string, time: string) => {
    const yy = date.slice(2, 4);
    const mm = date.slice(4, 6);
    const dd = date.slice(6, 8);

    const hh = time.slice(0, 2);
    const min = time.slice(2, 4);

    return `${yy}.${mm}.${dd} ${hh}:${min}`;
  };

  return (
    <div
      className="flex flex-col flex-[2] min-w-0 mt-[24px] p-[24px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <div className="flex items-center">
        <p className="text-[18px] font-semibold">실시간 유가 정보</p>

        {oilPriceData && (
          <p className="ml-[8px] text-gray5 text-[13px]">
            (
            {formatPriceDateTime(
              oilPriceData.data[0].priceDate,
              oilPriceData.data[0].priceTime,
            )}{" "}
            기준)
          </p>
        )}
      </div>

      <div className="flex flex-col w-full mt-[32px] gap-x-[24px] gap-y-[16px]">
        {oilPriceData &&
          oilPriceData.data.map((value, index) => (
            <div
              key={value.oilType}
              className="relative flex flex-col flex-1 px-[16px] py-[12px] bg-gray1 rounded-[12px]"
            >
              <p className="text-gray5 text-[16px]">{value.oilType}</p>
              <p className="mt-[6px] text-[20px] font-semibold">
                {value.price.toLocaleString()}원
              </p>

              <div
                className="absolute w-[10px] h-[10px] right-[16px] top-[16px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor(value.oilType) }}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

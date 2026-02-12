import { useServiceControllerGetServiceStatByPassType } from "@/api/service/service";
import { formatPassType } from "@/utils";
import { Callout } from "../ui/Callout";

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const ServiceSummary = ({ storeId, startDate, endDate }: Props) => {
  // 매출 통계 조회 API
  const {
    data: servcieStatData,
    isLoading: servcieStatLoading,
    isError: servcieStatError,
  } = useServiceControllerGetServiceStatByPassType({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
  });

  return (
    <Callout flex={2}>
      <p className="text-[16px] font-semibold">세차 이용 건수</p>

      <div className="grid grid-cols-3 mt-[20px] px-[8px] gap-[24px]">
        <div className="flex flex-col px-[20px] py-[16px] text-white bg-point2 rounded-[8px]">
          <p className="text-[14px] font-medium">총 세차 차량</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {servcieStatData?.data.totalServices ?? 0}건
          </p>
        </div>

        {servcieStatData?.data.passTypeServiceStat.map((value, index) => (
          <div
            key={index}
            className="flex flex-col px-[20px] py-[16px] bg-gray1 rounded-[8px]"
          >
            <p className="text-gray7 text-[14px] font-medium">
              {formatPassType(value.passType)}
            </p>
            <p className="mt-[8px] text-[20px] font-semibold">
              {value.count ?? 0}건
            </p>
          </div>
        ))}
      </div>
    </Callout>
  );
};

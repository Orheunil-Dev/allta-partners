import { useServiceHistoryControllerGetComplimentaryServiceHistoryList } from "@/api/service-history/service-history";
import dayjs from "dayjs";
import { Callout } from "../ui/Callout";
import { formatPaymentMethod } from "@/utils";

interface Props {
  storeId?: string | null;
  startDate: string;
  endDate: string;
}

export const ComplimentaryServiceList = ({
  storeId,
  startDate,
  endDate,
}: Props) => {
  // 무료세차 내역 목록 조회 API
  const {
    data: complimentaryServiceListData,
    isLoading: complimentaryServiceListLoading,
    isError: complimentaryServiceListErro,
  } = useServiceHistoryControllerGetComplimentaryServiceHistoryList({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
  });

  return (
    <Callout flex={1}>
      <p className="text-[18px] font-semibold">무료 세차 내역</p>

      <div className="flex flex-col flex-1 min-h-[160px] mt-[20px] px-[8px] gap-y-[8px] overflow-y-auto">
        {complimentaryServiceListData?.data.map((value, index) => (
          <div className="flex justify-between px-[16px] py-[12px] border border-line rounded-[8px]">
            <div className="flex flex-col">
              <p className="text-[14px] font-medium">
                {value.carNumber ?? "-"}
              </p>

              <div className="mt-[4px] flex items-center text-gray5 text-[12px]">
                <p className="text-[14px] font-medium">
                  {formatPaymentMethod(value.paymentMethod)}
                </p>
                <div className="w-[1px] h-[8px] mx-[4px] bg-gray3" />
                <p className="text-[14px] font-medium">
                  {dayjs(value.createdAt).format("YY.MM.DD HH:mm")}
                </p>
              </div>
            </div>

            <p className="text-gray7 text-[12px]">{value.storeName}</p>
          </div>
        ))}

        {!complimentaryServiceListLoading &&
          !complimentaryServiceListData?.data.length && (
            <div className="flex flex-1 justify-center items-center text-gray5">
              <p>무료세차 내역이 존재하지 않습니다.</p>
            </div>
          )}
      </div>
    </Callout>
  );
};

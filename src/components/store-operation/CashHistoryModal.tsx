import Image from "next/image";
import dayjs from "dayjs";
import { useStoreOperationControllerGetDailyStoreOperation } from "@/api/store-operation/store-operation";
import { useResizeHandler } from "@/hooks";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import { closeIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  storeId: string | null;
  storeName: string | null;
  date: dayjs.Dayjs | null;
  onClose: () => void;
}

export const CashHistoryModal = ({
  storeId,
  storeName,
  date,
  onClose,
}: Props) => {
  if (!storeId || !date) return;

  const { isDesktop, isTablet, isMobile } = useResizeHandler();

  // 오늘 매장 운영 정보 조회 API
  const {
    data,
    isLoading,
    isError,
    refetch: dailyRefetch,
  } = useStoreOperationControllerGetDailyStoreOperation(
    { storeId: storeId!, date: date.format("YYYY-MM-DD")! },
    { query: { enabled: !!storeId && !!date } },
  );

  const formatCashHistoryType = (value: string) => {
    switch (value) {
      case "OPEN":
        return "오픈 시재";

      case "CLOSE":
        return "마감 시재";

      case "DEPOSIT":
        return "중간 입금";

      default:
        return value;
    }
  };

  return (
    <CustomModal
      visible={!!date}
      onClose={onClose}
      width={isTablet || isDesktop ? "708px" : "90%"}
      padding="24px"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">시재 내역</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[20px]" />
          </button>
        </div>

        <p className="mt-[4px] text-[16px]">
          {dayjs(date).format("YYYY년 MM월 DD일 (ddd)")} - {storeName}
        </p>

        {data?.data ? (
          <div className="flex flex-col md:grid md:grid-cols-2 max-h-[60vh] md:max-h-[90vh] my-[32px] px-[24px] gap-[40px] overflow-y-auto">
            <div className="flex flex-col gap-[40px]">
              {/* 영업 정보 */}
              <div className="flex flex-col text-[14px]">
                <div className="p-[12px] text-[16px] font-semibold bg-gray1">
                  영업 정보
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>오픈 시간</p>
                  <p>{dayjs(data.data.openedAt).format("HH:mm:ss")}</p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>마감 시간</p>
                  <p>
                    {data.data.closedAt
                      ? dayjs(data.data.closedAt).format("HH:mm:ss")
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>세차 횟수(수기)</p>
                  <p>
                    {data.data.expectedServiceCount !== null
                      ? `${data.data.expectedServiceCount}회`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>세차 횟수(자동)</p>
                  <p>
                    {data.data.serviceCount !== null
                      ? `${data.data.serviceCount}회`
                      : "-"}
                  </p>
                </div>
              </div>

              {/* 매출 요약 */}
              <div className="flex flex-col text-[14px]">
                <div className="p-[12px] text-[16px] font-semibold bg-gray1">
                  매출 요약
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>총 매출</p>
                  <p className="font-semibold">
                    {data.data.totalSales !== null
                      ? `${data.data.totalSales.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>카드 매출</p>
                  <p className="font-semibold">
                    {data.data.cardSales !== null
                      ? `${data.data.cardSales.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>현금 매출</p>
                  <p className="font-semibold">
                    {data.data.cashSales !== null
                      ? `${data.data.cashSales.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>기타 매출</p>
                  <p className="font-semibold">
                    {data.data.otherSales !== null
                      ? `${data.data.otherSales.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[40px]">
              {/* 시재금 내역 */}
              <div className="flex flex-col text-[14px]">
                <div className="p-[12px] text-[16px] font-semibold bg-gray1">
                  시재금 내역
                </div>

                {data.data.cashHistories.map((value, index) => (
                  <div className="flex justify-between items-center px-[12px] py-[8px] border-b border-b-line">
                    <div key={index} className="flex items-center">
                      <p className="w-[80px]">
                        {formatCashHistoryType(value.type)}
                      </p>
                      <p>{dayjs(value.createdAt).format("HH:mm")}</p>
                    </div>

                    <p className="font-semibold">
                      {value.amount.toLocaleString()}원
                    </p>
                  </div>
                ))}
              </div>

              {/* 시재금 비교 */}
              <div className="flex flex-col text-[14px]">
                <div className="p-[12px] text-[16px] font-semibold bg-gray1">
                  시재금 비교
                </div>

                <div className="flex justify-between px-[12px] py-[8px] border-b border-b-line">
                  <p>시재금 - 현금 매출</p>

                  <p className="font-semibold">
                    {data.data.cashDifference !== null
                      ? `${data.data.cashDifference?.toLocaleString()}원`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="my-[80px] text-center text-gray5 text-[16px]">
            해당 일자의 시재 내역이 없습니다.
          </p>
        )}
      </div>

      <CustomButton
        onClick={onClose}
        borderWidth="1px"
        borderColor={colors.gray2}
      >
        닫기
      </CustomButton>
    </CustomModal>
  );
};

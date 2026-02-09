import Image from "next/image";
import dayjs from "dayjs";
import {
  useSalesControllerGetMoMSales,
  useSalesControllerGetTotalSales,
  useSalesControllerGetYoYSales,
} from "@/api/sales/sales";
import { getChangedRate, getDateBeforeDays } from "@/utils";
import {
  decreaseIcon,
  increaseIcon,
  momSalesIcon,
  monthSalesIcon,
  todaySalesIcon,
  yoySalesIcon,
} from "../../../public/images";

interface Props {}

export const Summary = ({}: Props) => {
  // 금일 매출 조회 API
  const {
    data: todaySalesData,
    isLoading: todaySalesLoading,
    isError: todaySalesError,
  } = useSalesControllerGetTotalSales({
    startDate: getDateBeforeDays(0),
  });

  // 이번달 매출 조회 API
  const {
    data: monthSalesData,
    isLoading: monthSalesLoading,
    isError: monthSalesError,
  } = useSalesControllerGetTotalSales({
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  });

  // 전월 대비 매출 조회 API
  const {
    data: momSalesData,
    isLoading: momSalesLoading,
    isError: momSalesError,
  } = useSalesControllerGetMoMSales();

  // 전년 대비 매출 조회 API
  const {
    data: yoySalesData,
    isLoading: yoySalesLoading,
    isError: yoySalesError,
  } = useSalesControllerGetYoYSales();

  // 증감률 표시
  const renderChangedRate = (
    curSales: number,
    prevSales: number,
    text: string,
  ) => {
    const { percent, direction } = getChangedRate(curSales, prevSales);

    return (
      <div className="flex items-center mt-[2px] text-gray5 text-[14px] font-medium">
        {direction === "UP" ? (
          <>
            <Image
              src={increaseIcon}
              alt="증가"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p>
              <strong className="text-green">
                {Math.abs(percent).toFixed(1)}%
              </strong>{" "}
              {text}
            </p>
          </>
        ) : direction === "DOWN" ? (
          <>
            <Image
              src={decreaseIcon}
              alt="감소"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p>
              <strong className="text-red">
                {Math.abs(percent).toFixed(1)}%
              </strong>{" "}
              {text}
            </p>
          </>
        ) : (
          <p>-</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 xl:flex xl:flex-row items-center gap-x-[24px] gap-y-[16px] overflow-x-auto">
      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">금일 매출</p>
          <p className="mt-[12px] text-[24px] font-semibold">
            {todaySalesData?.data.totalSales
              ? todaySalesData.data.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image
            src={todaySalesIcon}
            alt="금일 매출"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>

      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">이번달 매출</p>
          <p className="mt-[12px] text-[24px] font-semibold">
            {monthSalesData?.data.totalSales
              ? monthSalesData.data.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image
            src={monthSalesIcon}
            alt="이번달 누적 매출"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>

      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">전월 동기 매출</p>
          {momSalesData && (
            <>
              <p className="mt-[12px] text-[24px] font-semibold">
                {momSalesData?.data.currentSales
                  ? momSalesData.data.currentSales.totalSales.toLocaleString()
                  : 0}{" "}
                원
              </p>

              {momSalesData.data.previousSales.totalSales > 0 ? (
                renderChangedRate(
                  momSalesData.data.currentSales.totalSales,
                  momSalesData.data.previousSales.totalSales,
                  "전월대비",
                )
              ) : (
                <p className="text-gray5 text-[16px] font-medium">-</p>
              )}
            </>
          )}
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image
            src={momSalesIcon}
            alt="전월 동기 매출"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>

      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">전년 동기 매출</p>
          {yoySalesData && (
            <>
              <p className="mt-[12px] text-[24px] font-semibold">
                {yoySalesData?.data.currentSales
                  ? yoySalesData.data.currentSales.totalSales.toLocaleString()
                  : 0}{" "}
                원
              </p>

              {yoySalesData.data.previousSales.totalSales > 0 ? (
                renderChangedRate(
                  yoySalesData.data.currentSales.totalSales,
                  yoySalesData.data.previousSales.totalSales,
                  "전년대비",
                )
              ) : (
                <p className="text-gray5 text-[16px] font-medium">-</p>
              )}
            </>
          )}
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image
            src={yoySalesIcon}
            alt="전년 동기 매출"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>
    </div>
  );
};

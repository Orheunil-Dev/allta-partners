import Image from "next/image";
import dayjs from "dayjs";
import {
  useSalesControllerGetMoMSales,
  useSalesControllerGetTotalSales,
  useSalesControllerGetYoYSales,
} from "@/api/sales/sales";
import { useStatControllerGetSalesStat } from "@/api/stat/stat";
import { getChangedRate, getDateBeforeDays } from "@/utils";
import { Callout } from "../ui/Callout";
import { decreaseIcon, increaseIcon } from "../../../public/images";

interface Props {
  storeId: string;
  storeName: string;
}

export const StoreSummary = ({ storeId, storeName }: Props) => {
  // 금일 매출 조회 API
  const {
    data: todaySalesData,
    isLoading: todaySalesLoading,
    isError: todaySalesError,
  } = useSalesControllerGetTotalSales({
    storeIds: [storeId],
    startDate: getDateBeforeDays(0),
  });

  // 이번달 매출 조회 API
  const {
    data: monthSalesData,
    isLoading: monthSalesLoading,
    isError: monthSalesError,
  } = useSalesControllerGetTotalSales({
    storeIds: [storeId],
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  });

  // 전월 대비 매출 조회 API
  const {
    data: momSalesData,
    isLoading: momSalesLoading,
    isError: momSalesError,
  } = useSalesControllerGetMoMSales({
    storeIds: [storeId],
  });

  // 전년 대비 매출 조회 API
  const {
    data: yoySalesData,
    isLoading: yoySalesLoading,
    isError: yoySalesError,
  } = useSalesControllerGetYoYSales({
    storeIds: [storeId],
  });

  // 증감률 표시
  const renderChangedRate = (curSales: number, prevSales: number) => {
    const { percent, direction } = getChangedRate(curSales, prevSales);

    return (
      <div className="flex items-center text-gray5 text-[14px] font-medium">
        {direction === "UP" ? (
          <div className="flex items-center">
            <Image
              src={increaseIcon}
              alt="증가"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p className="text-green">{Math.abs(percent).toFixed(1)}%</p>
          </div>
        ) : direction === "DOWN" ? (
          <div className="flex items-center">
            <Image
              src={decreaseIcon}
              alt="감소"
              className="w-[16px] h-[16px] mr-[3px]"
            />
            <p className="text-red">-{Math.abs(percent).toFixed(1)}%</p>
          </div>
        ) : (
          <p>-</p>
        )}
      </div>
    );
  };

  return (
    <Callout>
      <p className="text-[18px] font-semibold">{storeName}</p>

      <div className="flex mt-[12px] gap-x-[16px]">
        <div className="flex flex-col flex-1 p-[12px] bg-gray1 rounded-[8px]">
          <p className="text-gray5 text-[13px] font-medium">금일 매출</p>
          <p className="mt-[4px] text-[16px] font-semibold">
            {todaySalesData?.data.totalSales
              ? todaySalesData.data.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>
        </div>

        <div className="flex flex-col flex-1 p-[12px] bg-gray1 rounded-[8px]">
          <p className="text-gray5 text-[13px] font-medium">이번달 매출</p>
          <p className="mt-[4px] text-[16px] font-semibold">
            {monthSalesData?.data.totalSales
              ? monthSalesData.data.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>
        </div>
      </div>

      <div className="flex flex-col mt-[16px] p-[12px] bg-gray1 rounded-[8px]">
        <p className="text-gray5 text-[13px] font-medium">전월 동기 매출</p>

        <div className="flex justify-between items-center">
          <p className="mt-[4px] text-[16px] font-semibold">
            {momSalesData?.data.currentSales
              ? momSalesData.data.currentSales.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>

          {momSalesData && momSalesData.data.previousSales.totalSales > 0 ? (
            renderChangedRate(
              momSalesData.data.currentSales.totalSales,
              momSalesData.data.previousSales.totalSales,
            )
          ) : (
            <p className="text-gray5 text-[16px] font-medium">-</p>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-[16px] p-[12px] bg-gray1 rounded-[8px]">
        <p className="text-gray5 text-[13px] font-medium">전년 동기 매출</p>

        <div className="flex justify-between items-center">
          <p className="mt-[4px] text-[16px] font-semibold">
            {yoySalesData?.data.currentSales
              ? yoySalesData.data.currentSales.totalSales.toLocaleString()
              : 0}{" "}
            원
          </p>

          {yoySalesData && yoySalesData.data.previousSales.totalSales > 0 ? (
            renderChangedRate(
              yoySalesData.data.currentSales.totalSales,
              yoySalesData.data.previousSales.totalSales,
            )
          ) : (
            <p className="text-gray5 text-[16px] font-medium">-</p>
          )}
        </div>
      </div>
    </Callout>
  );
};

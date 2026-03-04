import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";
import {
  useSalesControllerGetMoMSales,
  useSalesControllerGetTotalSales,
  useSalesControllerGetYoYSales,
} from "@/api/sales/sales";
import { GetManagedStoresSalesListItem } from "@/api/models";
import { getChangedRate, getDateBeforeDays } from "@/utils";
import { Callout } from "../ui/Callout";
import {
  decreaseIcon,
  grayRightArrowIcon,
  increaseIcon,
} from "../../../public/images";

interface Props {
  data: GetManagedStoresSalesListItem;
}

export const StoreSummary = ({ data }: Props) => {
  const router = useRouter();

  // // 금일 매출 조회 API
  // const {
  //   data: todaySalesData,
  //   isLoading: todaySalesLoading,
  //   isError: todaySalesError,
  // } = useSalesControllerGetTotalSales({
  //   storeIds: [storeId],
  //   startDate: getDateBeforeDays(0),
  // });

  // // 이번달 매출 조회 API
  // const {
  //   data: monthSalesData,
  //   isLoading: monthSalesLoading,
  //   isError: monthSalesError,
  // } = useSalesControllerGetTotalSales({
  //   storeIds: [storeId],
  //   startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
  // });

  // // 전월 대비 매출 조회 API
  // const {
  //   data: momSalesData,
  //   isLoading: momSalesLoading,
  //   isError: momSalesError,
  // } = useSalesControllerGetMoMSales({
  //   storeIds: [storeId],
  // });

  // // 전년 대비 매출 조회 API
  // const {
  //   data: yoySalesData,
  //   isLoading: yoySalesLoading,
  //   isError: yoySalesError,
  // } = useSalesControllerGetYoYSales({
  //   storeIds: [storeId],
  // });

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
      <p className="text-[16px] font-semibold">{data.storeName}</p>

      <div className="flex justify-between mt-[12px] pr-[4px] pl-[8px] py-[8px] items-center">
        <p className="text-gray5 text-[14px]">금일 매출</p>

        <div className="flex items-center">
          <p className="text-[16px] font-medium">{data.totalSales} 원</p>
          <button
            onClick={() => router.push("/sales-report")}
            className="cursor-pointer"
          >
            <Image
              src={grayRightArrowIcon}
              alt="금일 매출"
              className="size-[20px] ml-[8px]"
            />
          </button>
        </div>
      </div>

      <div className="flex justify-between pr-[4px] pl-[8px] py-[8px] items-center">
        <p className="text-gray5 text-[14px]">세차 건수</p>

        <div className="flex items-center">
          <p className="text-[16px] font-medium">{data.serviceCount} 회</p>

          <button
            onClick={() => router.push("/wash")}
            className="cursor-pointer"
          >
            <Image
              src={grayRightArrowIcon}
              alt="이용 횟수"
              className="size-[20px] ml-[8px]"
            />
          </button>
        </div>
      </div>

      <div className="flex justify-between pr-[4px] pl-[8px] py-[8px] items-center">
        <p className="text-gray5 text-[14px]">무료세차 횟수</p>

        <div className="flex items-center">
          <p className="text-[16px] font-medium">{data.freeWashCount} 회</p>

          <button
            onClick={() => router.push("/free-wash")}
            className="cursor-pointer"
          >
            <Image
              src={grayRightArrowIcon}
              alt="무료세차 횟수"
              className="size-[20px] ml-[8px]"
            />
          </button>
        </div>
      </div>

      <div className="flex justify-between pr-[4px] pl-[8px] py-[8px] items-center">
        <p className="text-gray5 text-[14px]">차량당 매출</p>

        <div className="flex items-center">
          <p className="text-[16px] font-medium">{data.salesPerService} 원</p>

          <button
            onClick={() => router.push("/sales-report")}
            className="cursor-pointer"
          >
            <Image
              src={grayRightArrowIcon}
              alt="차량당 매출"
              className="size-[20px] ml-[8px]"
            />
          </button>
        </div>
      </div>
    </Callout>
  );
};

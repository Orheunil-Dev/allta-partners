import Image from "next/image";
import { useSalesControllerGetMoMSales } from "@/api/sales/sales";
import { useVisitControllerGetMoMVisit } from "@/api/visit/visit";
import { useMarketingControllerGetMoMMarketingROI } from "@/api/marketing/marketing";
import { getChangedRate } from "@/utils";
import {
  conversionRateIcon,
  decreaseIcon,
  increaseIcon,
  lockIcon,
  monthSalesIcon,
  roiIcon,
  todaySalesIcon,
} from "../../../public/images";

interface Props {
  storeId?: string | null;
}

export const MarketingSummary = ({ storeId }: Props) => {
  if (!storeId) return;

  // 전월 대비 매출 조회 API
  const {
    data: momSalesData,
    isLoading: momSalesLoading,
    isError: momSalesError,
  } = useSalesControllerGetMoMSales(
    {
      storeIds: [storeId],
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  // 전월 대비 방문자 조회 API
  const {
    data: momVisitData,
    isLoading: momVisitLoading,
    isError: momVisitError,
  } = useVisitControllerGetMoMVisit(
    {
      storeIds: [storeId],
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  // 전월 대비 마케팅 ROI 조회 API
  const {
    data: momROIData,
    isLoading: momROILoading,
    isError: momROIError,
  } = useMarketingControllerGetMoMMarketingROI(
    { storeId },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

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
    <div className="flex flex-col md:grid md:grid-cols-2 xl:flex xl:flex-row items-center mt-[24px] gap-x-[24px] gap-y-[16px] overflow-x-auto">
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
            src={todaySalesIcon}
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
          <p className="text-gray5 text-[16px] font-medium">전월 동기 방문자</p>

          {momVisitData && (
            <>
              <p className="mt-[12px] text-[24px] font-semibold">
                {momVisitData?.data.currentVisitors
                  ? momVisitData.data.currentVisitors.toLocaleString()
                  : 0}{" "}
                명
              </p>

              {momVisitData.data.previousVisitors > 0 ? (
                renderChangedRate(
                  momVisitData.data.currentVisitors,
                  momVisitData.data.previousVisitors,
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
            src={monthSalesIcon}
            alt="전월 동기 방문자"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>

      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        {!momROIData?.data && (
          <div className="absolute flex flex-col justify-center items-center w-full h-full top-0 right-0 text-center bg-white/70 backdrop-blur-[3px] rounded-[20px] z-[1]">
            <div className="flex justify-center items-center size-[40px] bg-gray1 rounded-full">
              <Image src={lockIcon} alt="Pro 전용" className="size-[20px]" />
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">
            마케팅 ROI (비용 대비 매출)
          </p>

          {momROIData && momROIData.data && (
            <>
              {momROIData.data.currentROI > 0 ? (
                <p className="mt-[12px] text-[24px] font-semibold">
                  {momROIData.data.currentROI
                    ? momROIData.data.currentROI.toFixed(0)
                    : 0}{" "}
                  %
                </p>
              ) : (
                <p className="mt-[12px] text-[24px] font-semibold">-</p>
              )}

              {momROIData.data.previousROI > 0 ? (
                renderChangedRate(
                  momROIData.data.currentROI,
                  momROIData.data.previousROI,
                  "전월대비",
                )
              ) : (
                <p className="text-gray5 text-[16px] font-medium">-</p>
              )}
            </>
          )}
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image src={roiIcon} alt="마케팅 ROI" className="w-[16px] h-[16px]" />
        </div>
      </div>

      <div
        className="relative flex md:flex-1 w-full h-[134px] pt-[20px] px-[24px] bg-white rounded-[20px]"
        style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
      >
        {!momROIData?.data && (
          <div className="absolute flex flex-col justify-center items-center w-full h-full top-0 right-0 text-center bg-white/70 backdrop-blur-[3px] rounded-[20px] z-[1]">
            <div className="flex justify-center items-center size-[40px] bg-gray1 rounded-full">
              <Image src={lockIcon} alt="Pro 전용" className="size-[20px]" />
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <p className="text-gray5 text-[16px] font-medium">캠페인 전환율</p>

          <p className="mt-[12px] text-[24px] font-semibold">-</p>
        </div>

        <div className="absolute flex justify-center items-center w-[32px] h-[32px] top-[16px] right-[16px] bg-back rounded-full">
          <Image
            src={conversionRateIcon}
            alt="캠페인 전환율"
            className="w-[16px] h-[16px]"
          />
        </div>
      </div>
    </div>
  );
};

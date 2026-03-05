import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMarketingControllerGetVisitCohort } from "@/api/marketing/marketing";
import { GetVisitCohortItem } from "@/api/models";
import { getPercent } from "@/utils";
import { mockVisitCohort } from "@/mock";
import { LockedContent } from "../layout/LockedContent";
import { infoIcon } from "../../../public/images";
import { colors } from "@/styles";

const PANEL_COLORS = [
  { min: 100, color: "#5959E8" },
  { min: 50, color: "#8383F1" },
  { min: 25, color: "#ACACF7" },
  { min: 1, color: "#DCDCFE" },
];

interface Props {
  storeId?: string | null;
}

export const VisitCohortChart = ({ storeId }: Props) => {
  if (!storeId) return;

  const router = useRouter();

  const [showInfo, setShowInfo] = useState<boolean>(false);

  // 매장 방문 코호트 조회 API
  const {
    data: visitCohortData,
    isLoading: visitCohortloading,
    isError: visitCohortError,
  } = useMarketingControllerGetVisitCohort(
    { storeId: storeId },
    { query: { enabled: !!storeId } },
  );

  const renderCohortChart = (item: GetVisitCohortItem) => {
    const getPanelColor = (rate: number) => {
      return (
        PANEL_COLORS.find((panel) => rate >= panel.min)?.color ?? "transparent"
      );
    };

    const getTextColor = (rate: number) => {
      if (rate < 25) return colors.gray7;
      else return colors.white;
    };

    const visits = [item.secondVisit, item.thirdVisit, item.forthVisit];

    return (
      <div className="grid grid-cols-[80px_1fr] items-center">
        <p className="text-gray7 text-[13px]">{item.week}</p>

        <div className="grid grid-cols-4 gap-[6px]">
          <div
            className="flex justify-center py-[10px] text-[12px] font-medium rounded-[4px]"
            style={{
              color: !!item.firstVisit ? colors.white : colors.gray7,
              backgroundColor: !!item.firstVisit ? "#5959E8" : "#DCDCFE",
            }}
          >
            {!!item.firstVisit ? "100%" : "0%"}
          </div>

          {visits.map((value, index) => {
            if (!value) return null;

            const rate = getPercent(value, item.firstVisit);

            return (
              <div
                key={item.week + index}
                className="flex justify-center py-[10px] text-[12px] font-medium rounded-[4px]"
                style={{
                  color: getTextColor(rate),
                  backgroundColor: getPanelColor(rate),
                }}
              >
                {rate.toFixed(0)}%
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-col w-full xl:w-[434px] h-[376px] mt-[24px] p-[24px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      {!visitCohortData?.ok && (
        <LockedContent
          title="Pro 전용"
          content={
            "고객 재방문율 및 이탈 분석 기능은\n유료 플랜에서 제공됩니다."
          }
          buttonText="멤버쉽 업그레이드"
          onClick={() => router.push("price")}
        />
      )}

      <div className="relative flex">
        <p className="text-[16px] font-semibold">재방문율 분석</p>

        <div
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="ml-[4px] cursor-pointer"
        >
          <Image src={infoIcon} alt="도움말" className="size-[20px]" />

          {showInfo && (
            <div
              className="absolute flex top-[22px] left-[-4px] px-[8px] py-[6px] text-[12px] bg-white border border-line rounded-[8px] whitespace-nowrap"
              style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
            >
              첫 방문 후 4주간의 재방문율 변화입니다.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[80px_1fr] mt-[24px]">
        <div />

        <div className="grid grid-cols-4 mb-[6px] gap-[6px] text-center text-gray7 text-[13px]">
          <p>1주차</p>

          <p>2주차</p>

          <p>3주차</p>

          <p>4주차</p>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        {visitCohortData &&
          (!visitCohortData.ok
            ? mockVisitCohort.map((value, index) => renderCohortChart(value))
            : visitCohortData.data.map((value, index) =>
                renderCohortChart(value),
              ))}
      </div>
    </div>
  );
};

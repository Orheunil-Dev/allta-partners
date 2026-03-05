import Image from "next/image";
import { Callout } from "../ui/Callout";
import { CustomButton } from "../ui/Button";
import { checkIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  index: number;
  membership: string;
  price: string;
  currentMembership: string;
}

const functionList = [
  { label: "매장 기본 정보 관리", level: 0 },
  { label: "세차 내역 확인", level: 0 },
  { label: "매장 방문 고객 현황 확인", level: 0 },
  { label: "기본 매출 통계 제공", level: 0 },
  { label: "CRM 고객 관리 기능", level: 1 },
  { label: "미방문 고객 케어 알림 발송", level: 1 },
  { label: "코호트 분석 및 고객 리텐션 분석", level: 1 },
  { label: "캠페인 전환율 분석", level: 2 },
  { label: "매출 및 방문 데이터 상세 리포트", level: 2 },
  { label: "우선 기술 지원", level: 2 },
];

export const PriceCard = ({
  index,
  membership,
  price,
  currentMembership,
}: Props) => {
  return (
    <Callout>
      <p className="text-[20px] font-semibold">{membership}</p>
      <p className="mt-[12px] text-[40px] font-semibold">{price}</p>

      <CustomButton
        onClick={() => {
          if (membership !== currentMembership) {
            alert(
              "멤버십은 맞춤형 계약으로 제공됩니다.\n계약 기간 및 요금은 상담을 통해 안내드립니다.\n문의 전화번호: 1668-1620",
            );
          }
        }}
        width="100%"
        height="54px"
        margin="32px 0 0 0"
        backgroundColor={
          currentMembership === membership ? colors.white : colors.main
        }
        borderWidth="1px"
        borderColor={
          currentMembership === membership ? colors.line : "transparent"
        }
        borderRadius="40px"
      >
        <p
          className={`text-[16px] font-semibold ${
            currentMembership === membership ? "text-black" : "text-white"
          }  `}
        >
          {currentMembership === membership
            ? "현재 멤버쉽"
            : "멤버쉽 변경 문의"}
        </p>
      </CustomButton>

      <div className="flex flex-col mt-[48px] gap-[10px]">
        {functionList.map((v, i) => (
          <div
            key={`BASIC_${i}`}
            className={`flex items-center ${v.level > index ? "opacity-30" : "opacity-100"}`}
          >
            <Image
              src={checkIcon}
              alt={v.label}
              className="size-[16px] mr-[6px]"
            />

            <p className="text-[16px]">{v.label}</p>
          </div>
        ))}
      </div>
    </Callout>
  );
};

import Image from "next/image";
import ReactSwitch from "react-switch";
import dayjs from "dayjs";
import { useCrmControllerGetCrmLogCount } from "@/api/crm/crm";
import { Callout } from "../ui/Callout";
import { LockedContent } from "../layout/LockedContent";
import { discontinueIcon } from "../../../public/images";
import { colors } from "@/styles";
import { useStoreMarketingProductControllerGetStoreMarketingProductList } from "@/api/store-marketing-product/store-marketing-product";

interface Props {
  storeId: string | null;
  storeName: string | null;
  isLocked: boolean;
}

export const CrmAutomationSection = ({
  storeId,
  storeName,
  isLocked,
}: Props) => {
  if (!storeId) return;

  // CRM 로그 목록 조회 API
  const {
    data: crmLogCountData,
    isLoading: crmLogCountLoading,
    isError: crmLogCountError,
  } = useCrmControllerGetCrmLogCount(
    {
      storeId: storeId!,
      startDate: dayjs().format("YYYY-MM-DD"),
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  // 보유중인 마케팅 상품 목록 조회 API
  const {
    data: marketingProductListData,
    isLoading: marketingProductListLoading,
    isError: marketingProductListError,
  } = useStoreMarketingProductControllerGetStoreMarketingProductList(
    {
      storeId: storeId!,
    },
    {
      query: {
        enabled: !!storeId,
      },
    },
  );

  console.log(marketingProductListData);

  return (
    <div className="flex flex-col xl:grid xl:grid-cols-2 mt-[24px] gap-[24px]">
      <Callout position="relative">
        {isLocked && <LockedContent />}

        <div className="flex justify-between items-start">
          <div className="flex">
            <div className="flex justify-center items-center size-[40px] mr-[16px] bg-back4 rounded-full">
              <Image
                src={discontinueIcon}
                alt="이용 중단 고객 케어"
                className="size-[24px]"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[18px] font-semibold">이용 중단 고객 케어</p>
              <p className="mt-[4px] text-gray5 text-[14px]">
                장기 미방문 고객 자동 쿠폰 메세지 발송
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <p className="mr-[4px] text-gray7 text-[14px]">오늘 발송</p>

            <div className="mr-[16px] px-[10px] py-[2px] text-main text-[14px] font-medium bg-back4 rounded-[50px]">
              {crmLogCountData?.data.find(
                (value) => value.actionName === "REVISIT_CAMPAIGN",
              )?.successCount ?? 0}
              건
            </div>

            <ReactSwitch
              checked={
                marketingProductListData?.data.includes("REVISIT_CAMPAIGN") ??
                false
              }
              onChange={() => {}}
              onColor={colors.main}
              checkedIcon={false}
              offColor={colors.gray2}
              uncheckedIcon={false}
              width={40}
              height={24}
            />
          </div>
        </div>

        <div className="flex flex-1 items-center mt-[20px] p-[20px] bg-gray1 border border-line rounded-[8px]">
          <p className="text-[14px]">
            김OO 고객님, {storeName}에서 세차하신지 30일이 지났네요! 소중한 내
            차를 위해 오랜만에 세차 어떠세요? ${storeName}에서 고객님을 위해
            쿠폰을 보내드려요! 🚗
          </p>
        </div>
      </Callout>

      <Callout position="relative">
        {isLocked && <LockedContent />}

        <div className="flex justify-between items-start">
          <div className="flex">
            <div className="flex justify-center items-center size-[40px] mr-[16px] bg-back4 rounded-full">
              <Image
                src={discontinueIcon}
                alt="이용 중단 고객 케어"
                className="size-[24px]"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[18px] font-semibold">방문 고객 감사 인사</p>
              <p className="mt-[4px] text-gray5 text-[14px]">
                이용 완료 30분 후 자동 발송
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <p className="mr-[4px] text-gray7 text-[14px]">오늘 발송</p>

            <div className="mr-[16px] px-[10px] py-[2px] text-main text-[14px] font-medium bg-back4 rounded-[50px]">
              {crmLogCountData?.data.find(
                (value) => value.actionName === "THANKS_MESSAGE",
              )?.successCount ?? 0}
              건
            </div>

            <ReactSwitch
              checked={
                marketingProductListData?.data.includes("THANKS_MESSAGE") ??
                false
              }
              onChange={() => {}}
              onColor={colors.main}
              checkedIcon={false}
              offColor={colors.gray2}
              uncheckedIcon={false}
              width={40}
              height={24}
            />
          </div>
        </div>

        <div className="flex flex-1  items-center mt-[20px] p-[20px] bg-gray1 border border-line rounded-[8px]">
          <p className="text-[14px]">
            김OO 고객님, {storeName}을 방문해주셔서 감사합니다. 😊 다음 방문도
            더 만족스러운 서비스로 보답하겠습니다.
          </p>
        </div>
      </Callout>
    </div>
  );
};

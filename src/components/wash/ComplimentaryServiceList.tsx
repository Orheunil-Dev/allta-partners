import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";
import { useFreeWashControllerGetFreeWashHistoryList } from "@/api/free-wash/free-wash";
import { formatFreeWashReason } from "@/utils";
import { Callout } from "../ui/Callout";
import { grayRightArrowIcon } from "../../../public/images";

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
  const router = useRouter();

  // 무료세차 내역 목록 조회 API
  const {
    data: complimentaryServiceListData,
    isLoading: complimentaryServiceListLoading,
    isError: complimentaryServiceListErro,
  } = useFreeWashControllerGetFreeWashHistoryList({
    storeIds: storeId ? [storeId] : [],
    startDate,
    endDate,
    take: 9999,
    skip: 0,
  });

  return (
    <Callout flex={1}>
      <div className="flex justify-between items-center">
        <p className="text-[16px] font-semibold">무료세차 내역</p>

        <button
          onClick={() => router.push("/free-wash")}
          className="cursor-pointer"
        >
          <Image
            src={grayRightArrowIcon}
            alt="무료세차 내역"
            className="size-[24px]"
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 min-h-[160px] mt-[20px] px-[8px] gap-y-[8px] overflow-y-auto">
        {complimentaryServiceListData?.data.map((value, index) => (
          <div className="flex justify-between px-[16px] py-[12px] border border-line rounded-[8px]">
            <div className="flex flex-col">
              <p className="text-[14px] font-medium">
                {value.carNumber ?? "-"}
              </p>

              <div className="mt-[4px] flex items-center text-gray5 text-[12px]">
                <p className="text-[14px] font-medium">
                  {formatFreeWashReason(value.paymentMethod)}
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
            <div className="flex flex-1 justify-center items-center">
              <p className="text-gray5 text-[16px]">
                무료세차 내역이 존재하지 않습니다.
              </p>
            </div>
          )}
      </div>
    </Callout>
  );
};

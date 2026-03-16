import { TodayStoreOperationResult } from "@/api/models";
import { Callout } from "../ui/Callout";

interface Props {
  data?: TodayStoreOperationResult | null;
}

export const StoreOperationSummary = ({ data }: Props) => {
  const openCash = data?.cashHistories.find((value) => value.type === "OPEN");
  const closeCash = data?.cashHistories.find((value) => value.type === "CLOSE");
  const totalDeposit =
    data?.cashHistories
      .filter((value) => value.type === "DEPOSIT")
      .reduce((sum, value) => sum + value.amount, 0) ?? 0;
  const serviceCount = data?.serviceCount;

  return (
    <Callout margin="0 0 24px 0">
      <p className="text-[16px] font-semibold">금일 시재 현황</p>

      <div className="flex justify-between items-center w-full mt-[20px] gap-[24px]">
        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">오픈 시재</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {openCash ? `${openCash.amount.toLocaleString()}원` : "-"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">중간 입금</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {totalDeposit ? `${totalDeposit.toLocaleString()}원` : "-"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">마감 시재</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {closeCash ? `${closeCash.amount.toLocaleString()}원` : "-"}
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[16px] bg-gray1 rounded-[8px]">
          <p className="text-gray7 text-[14px]">세차 횟수</p>
          <p className="mt-[8px] text-[20px] font-semibold">
            {serviceCount != null ? `${serviceCount.toLocaleString()}회` : "-"}
          </p>
        </div>
      </div>
    </Callout>
  );
};

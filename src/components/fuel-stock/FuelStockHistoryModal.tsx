import { useRouter } from "next/router";
import Image from "next/image";
import dayjs from "dayjs";
import { useFuelStockControllerGetDailyFuelStockSummaryDetail } from "@/api/fuel-stock/fuel-stock";
import { useResizeHandler } from "@/hooks";
import { FuelType } from "@/types";
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

export const FuelStockHistoryModal = ({
  storeId,
  storeName,
  date,
  onClose,
}: Props) => {
  if (!storeId || !date) return;

  const router = useRouter();

  const { isDesktop, isTablet, isMobile } = useResizeHandler();

  // 매장 유류 재고 내역 상세 조회 API
  const { data, isLoading, isError } =
    useFuelStockControllerGetDailyFuelStockSummaryDetail(
      { storeId: storeId!, date: date.format("YYYY-MM-DD")! },
      { query: { enabled: !!storeId && !!date } },
    );

  const fuelMap = {
    GASOLINE: {
      name: "휘발유",
      textColor: "text-[#EB8723]",
      incomePrice: data?.data.gasolineIncomePrice ?? 0,
      incomeVolume: data?.data.gasolineIncomeVolume ?? 0,
      inventory: data?.data.gasolineInventory ?? 0,
      prevInventory: data?.data.gasolinePrevInventory ?? 0,
    },
    DIESEL: {
      name: "경유",
      textColor: "text-[#3B67D7]",
      incomePrice: data?.data.dieselIncomePrice ?? 0,
      incomeVolume: data?.data.dieselIncomeVolume ?? 0,
      inventory: data?.data.dieselInventory ?? 0,
      prevInventory: data?.data.dieselPrevInventory ?? 0,
    },
    PREMIUM_GASOLINE: {
      name: "고급유",
      textColor: "text-[#4BD168]",
      incomePrice: data?.data.premiumIncomePrice ?? 0,
      incomeVolume: data?.data.premiumIncomeVolume ?? 0,
      inventory: data?.data.premiumInventory ?? 0,
      prevInventory: data?.data.premiumPrevInventory ?? 0,
    },
  };

  const rows = data?.data.fuelSales.map((fuel) => {
    const base = fuelMap[fuel.fuelType as FuelType];

    const expectedInventory =
      base.prevInventory ?? +base.incomeVolume - fuel.totalVolume;

    return {
      ...base,
      salesVolume: fuel.totalVolume,
      salesAmount: fuel.totalSales,
      expectedInventory,
    };
  });

  return (
    <CustomModal
      visible={!!date}
      onClose={onClose}
      width={isTablet || isDesktop ? "760px" : "90%"}
      padding="24px"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">재고 내역</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[20px]" />
          </button>
        </div>

        <p className="mt-[4px] text-[16px]">
          {dayjs(date).format("YYYY년 MM월 DD일 (ddd)")} - {storeName}
        </p>

        {data?.data ? (
          <div className="w-full mt-[32px] px-[24px]">
            <table className="w-full overflow-hidden text-[14px]">
              <thead>
                <tr className="text-gray5 [&>th]:px-[12px] [&>th]:py-[8px] [&>th]:font-medium">
                  <th className="text-left">유종</th>
                  <th>단가(원/L)</th>
                  <th>입고량(L)</th>
                  <th>판매량(L)</th>
                  <th>전일재고(L)</th>
                  <th>예상재고(L)</th>
                  <th>실측재고(L)</th>
                  <th>매출액(원)</th>
                </tr>
              </thead>

              <tbody>
                {rows?.map((row, idx) => (
                  <tr key={idx} className="border-t border-line text-center">
                    <td
                      className={`p-[12px] text-left font-medium ${row.textColor}`}
                    >
                      {row.name}
                    </td>
                    <td>{row.incomePrice.toLocaleString()}</td>
                    <td>{row.incomeVolume.toLocaleString()}</td>
                    <td>{row.salesVolume.toLocaleString()}</td>
                    <td>{row.prevInventory.toLocaleString()}</td>
                    <td>{row.expectedInventory.toLocaleString()}</td>
                    <td>{row.inventory.toLocaleString()}</td>
                    <td className="font-semibold">
                      {row.salesAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="border-t border-line bg-gray1 text-center">
                  <td className="p-[12px] text-left font-medium">합계</td>
                  <td>-</td>
                  <td>
                    {rows
                      ?.reduce((sum, r) => sum + (r.incomeVolume ?? 0), 0)
                      .toLocaleString()}
                  </td>
                  <td>
                    {rows
                      ?.reduce((sum, r) => sum + r.salesVolume, 0)
                      .toLocaleString()}
                  </td>
                  <td>
                    {rows
                      ?.reduce((sum, r) => sum + (r.prevInventory ?? 0), 0)
                      .toLocaleString()}
                  </td>
                  <td>
                    {rows
                      ?.reduce((sum, r) => sum + r.expectedInventory, 0)
                      .toLocaleString()}
                  </td>
                  <td>
                    {rows
                      ?.reduce((sum, r) => sum + (r.inventory ?? 0), 0)
                      .toLocaleString()}
                  </td>
                  <td className="font-semibold">
                    {rows
                      ?.reduce((sum, r) => sum + r.salesAmount, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : isLoading ? (
          <div />
        ) : (
          <p className="my-[80px] text-center text-gray5 text-[16px]">
            해당 일자의 유류 재고 내역이 없습니다.
          </p>
        )}
      </div>

      <div className="flex items-center mt-[32px] gap-[12px]">
        {data ? (
          <CustomButton
            onClick={() => {
              router.push(`/fuel-stock/${data.data.id}`);
            }}
            backgroundColor={colors.main}
          >
            <p className="text-white">수정</p>
          </CustomButton>
        ) : (
          <CustomButton
            onClick={() => {
              router.push({
                pathname: "/fuel-stock/create",
                query: {
                  date: date?.format("YYYY-MM-DD"),
                  storeId,
                  storeName,
                },
              });
            }}
            backgroundColor={colors.main}
          >
            <p className="text-white">작성</p>
          </CustomButton>
        )}

        <CustomButton
          onClick={onClose}
          borderWidth="1px"
          borderColor={colors.gray2}
        >
          닫기
        </CustomButton>
      </div>
    </CustomModal>
  );
};

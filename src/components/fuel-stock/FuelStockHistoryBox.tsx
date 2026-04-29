import { useEffect, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useFuelStockControllerCreateFuelStockHistory } from "@/api/fuel-stock/fuel-stock";
import {
  CreateFuelStockHistoryRequest,
  DailyFuelStockSummaryDetailByIdResult,
  DailyFuelStockSummaryDetailFuelStockHistoryItem,
} from "@/api/models";
import { formatFuelType, getFuelTypeColor } from "@/utils";
import { FuelStockHistoryItem } from "./FuelStockHistoryItem";
import { FUEL_TYPES } from "@/constants";
import { CustomButton } from "../ui/Button";
import { bluePlusIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  fuelType: string;
  histories: DailyFuelStockSummaryDetailFuelStockHistoryItem[];
  dailyFuelStockSummaryId: string;
  data: DailyFuelStockSummaryDetailByIdResult;
  isToday: boolean;
}

export const FuelStockHistoryBox = ({
  fuelType,
  histories,
  dailyFuelStockSummaryId,
  data,
  isToday,
}: Props) => {
  if (!FUEL_TYPES.includes(fuelType)) return;

  const queryClient = useQueryClient();

  const [targetId, setTargetId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateFuelStockHistoryRequest>({
    fuelType,
    pricePerLiter: 0,
    volume: 0,
    dailyFuelStockSummaryId,
  });

  // 유류 내역 생성 API
  const {
    mutate: createHistory,
    isPending: createHistoryLoading,
    isError: createHistoryError,
  } = useFuelStockControllerCreateFuelStockHistory();

  const handleNumberChange =
    (key: keyof CreateFuelStockHistoryRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");

      if (!value.trim()) {
        return setCreateForm((prev) => ({
          ...prev,
          [key]: 0,
        }));
      }

      if (!/^\d+$/.test(value)) return;

      return setCreateForm((prev) => ({
        ...prev,
        [key]: Number(value),
      }));
    };

  // 입고 내역 생성
  const handleCreateHistory = () => {
    if (createHistoryLoading) return;

    createHistory(
      {
        data: createForm,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["dailFuelStockSummaryDetail"],
          });

          setShowForm(false);

          return alert("입고 내역이 추가되었습니다.");
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "입고 내역 생성 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  const handleClose = () => {
    setTargetId(null);
    setShowForm(false);
  };

  const fuelData = (() => {
    const sales = data.fuelSales.find((v) => v.fuelType === fuelType);

    const map = {
      GASOLINE: {
        incomePrice: data.gasolineIncomePrice,
        incomeVolume: data.gasolineIncomeVolume,
        inventoryPrice: data.gasolineInventoryPrice,
        inventoryVolume: data.gasolineInventoryVolume,
      },
      DIESEL: {
        incomePrice: data.dieselIncomePrice,
        incomeVolume: data.dieselIncomeVolume,
        inventoryPrice: data.dieselInventoryPrice,
        inventoryVolume: data.dieselInventoryVolume,
      },
      PREMIUM_GASOLINE: {
        incomePrice: data.premiumIncomePrice,
        incomeVolume: data.premiumIncomeVolume,
        inventoryPrice: data.premiumInventoryPrice,
        inventoryVolume: data.premiumInventoryVolume,
      },
    } as const;

    const base = map[fuelType as keyof typeof map];

    if (!base) {
      return {
        incomePrice: 0,
        incomeVolume: 0,
        inventoryPrice: 0,
        inventoryVolume: 0,
        salesVolume: 0,
        salesAmount: 0,
      };
    }

    return {
      ...base,
      salesVolume: sales?.totalVolume ?? 0,
      salesAmount: sales?.totalSales ?? 0,
    };
  })();

  useEffect(() => {
    setTargetId(null);
    setCreateForm((prev) => ({
      ...prev,
      pricePerLiter: 0,
      volume: 0,
    }));
  }, [showForm]);

  return (
    <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
      <div className="flex items-center p-[12px] bg-gray1">
        <div
          className="size-[8px] mr-[6px] rounded-full"
          style={{ backgroundColor: getFuelTypeColor(fuelType) }}
        />
        <p className="font-semibold leading-[1]">{formatFuelType(fuelType)}</p>
      </div>

      <div className="flex flex-col p-[20px]">
        <div className="flex justify-between items-center">
          <p className="text-gray5 font-semibold">입고 내역</p>

          {isToday && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center cursor-pointer"
            >
              <Image
                src={bluePlusIcon}
                alt="추가 입고"
                className="size-[20px] mr-[]"
              />

              <p className="text-main font-medium leading-[1]">추가 입고</p>
            </button>
          )}
        </div>

        <div className="flex flex-col mt-[16px]">
          {showForm && targetId === null && (
            <div className="flex flex-col mb-[8px] p-[16px] bg-gray1 rounded-[12px]">
              <div className="flex justify-between items-center">
                <div className="flex justify-start items-center w-full gap-x-[12px]">
                  <p className="flex-shrink-0 text-[12px] font-medium">
                    입고 단가
                  </p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        createForm.pricePerLiter > 0
                          ? createForm.pricePerLiter.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("pricePerLiter")}
                      className="w-full pl-[12px] pr-[40px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">원/L</p>
                  </div>
                </div>

                <div className="flex justify-end items-center w-full gap-x-[12px]">
                  <p className="flex-shrink-0 text-[12px] font-medium">
                    입고 단가
                  </p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        createForm.volume > 0
                          ? createForm.volume.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("volume")}
                      className="w-full pl-[12px] pr-[24px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">L</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-[12px] gap-x-[12px]">
                <CustomButton
                  onClick={() => setShowForm(!showForm)}
                  width="40px"
                  height="28px"
                  backgroundColor={colors.white}
                  borderWidth="1px"
                  borderColor={colors.gray2}
                  color={colors.gray5}
                  fontSize="13px"
                >
                  취소
                </CustomButton>

                <CustomButton
                  onClick={handleCreateHistory}
                  width="40px"
                  height="28px"
                  backgroundColor={colors.main}
                  color={colors.white}
                  fontSize="13px"
                >
                  저장
                </CustomButton>
              </div>
            </div>
          )}

          {histories.length > 0 ? (
            histories.map((value, index) => (
              <FuelStockHistoryItem
                key={value.id}
                history={value}
                targetId={targetId}
                setTargetId={setTargetId}
                isToday={isToday}
                onClose={handleClose}
              />
            ))
          ) : (
            <p className="text-center text-gray5">입고 내역이 없습니다</p>
          )}
        </div>
      </div>

      <div className="flex justify-between w-full border-t border-line">
        <div className="flex flex-col w-full px-[20px] py-[10px] border-r border-line">
          <p className="text-gray5 text-[12px]">평균 입고 단가</p>

          <p className="mt-[4px] text-[14px] font-medium">
            {fuelData.incomePrice.toLocaleString()}{" "}
            <strong className="text-gray5 font-normal">원/L</strong>
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[10px] border-r border-line">
          <p className="text-gray5 text-[12px]">입고량</p>

          <p className="mt-[4px] text-[14px] font-medium">
            {fuelData.incomeVolume.toLocaleString()}{" "}
            <strong className="text-gray5 font-normal">L</strong>
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[10px] border-r border-line">
          <p className="text-gray5 text-[12px]">재고 단가</p>

          <p className="mt-[4px] text-[14px] font-medium">
            {fuelData.inventoryPrice.toLocaleString()}{" "}
            <strong className="text-gray5 font-normal">원/L</strong>
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[10px] border-r border-line">
          <p className="text-gray5 text-[12px]">판매량</p>

          <p className="mt-[4px] text-[14px] font-medium">
            {fuelData.salesVolume.toLocaleString()}{" "}
            <strong className="text-gray5 font-normal">L</strong>
          </p>
        </div>

        <div className="flex flex-col w-full px-[20px] py-[10px]">
          <p className="text-gray5 text-[12px]">매출액</p>

          <p className="mt-[4px] text-[14px] font-medium">
            {fuelData.salesAmount.toLocaleString()}{" "}
            <strong className="text-gray5 font-normal">원</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

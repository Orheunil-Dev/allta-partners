import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFuelStockControllerUpdateFuelInventoryVolume } from "@/api/fuel-stock/fuel-stock";
import {
  GetDailyFuelStockSummaryDetailByIdResponse,
  UpdateFuelInventoryVolumeRequest,
} from "@/api/models";
import { getFuelTypeColor } from "@/utils";
import { CustomButton } from "../ui/Button";
import { colors } from "@/styles";
import Image from "next/image";
import { editIcon } from "../../../public/images";

interface Props {
  data: GetDailyFuelStockSummaryDetailByIdResponse["data"];
  isToday: boolean;
}

export const FuelInventoryBox = ({ data, isToday }: Props) => {
  const queryClient = useQueryClient();

  const initialData: UpdateFuelInventoryVolumeRequest = {
    id: data.id,
    gasolineInventoryVolume: data.gasolineInventoryVolume,
    dieselInventoryVolume: data.dieselInventoryVolume,
    premiumInventoryVolume: data.premiumInventoryVolume,
  };

  const [form, setForm] =
    useState<UpdateFuelInventoryVolumeRequest>(initialData);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  // 실측 재고 수정 API
  const {
    mutate: updateInventory,
    isPending: updateInventoryLoading,
    isError: updateInventoryError,
  } = useFuelStockControllerUpdateFuelInventoryVolume();

  const handleChange =
    (key: keyof UpdateFuelInventoryVolumeRequest) =>
    (value: string | number | React.ChangeEvent<HTMLInputElement>) => {
      const v = typeof value === "object" ? value.target.value : value;

      setForm((prev) => ({
        ...prev,
        [key]: v,
      }));
    };

  const handleNumberChange =
    (key: keyof UpdateFuelInventoryVolumeRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");

      if (!value.trim()) {
        return handleChange(key)(0);
      }

      if (!/^\d+$/.test(value)) return;

      handleChange(key)(Number(value));
    };

  const handleCancel = () => {
    return setShowEdit(false);
  };

  const handleSubmit = () => {
    if (form === initialData) {
      return alert("변경된 내용이 없습니다.");
    }

    updateInventory(
      {
        data: form,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["dailFuelStockSummaryDetail"],
          });

          return alert("실측 재고가 수정되었습니다.");
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "실측 재고 수정 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  useEffect(() => {
    setForm(initialData);
  }, [showEdit]);

  return (
    <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
      <div className="flex justify-between items-center p-[12px] bg-gray1">
        <p className="font-semibold">실측 재고</p>

        {isToday && (
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="cursor-pointer"
          >
            <Image src={editIcon} alt="수정" className="size-[20px]" />
          </button>
        )}
      </div>

      <div className="flex flex-col p-[20px]">
        <div className="flex justify-between items-center gap-x-[20px]">
          {/* 휘발유 */}
          <div className="flex justify-between items-center w-full gap-x-[12px]">
            <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("GASOLINE") }}
              />
              <p className="text-[12px] font-medium">휘발유</p>
            </div>

            {showEdit ? (
              <div className="relative flex items-center w-full">
                <input
                  value={
                    form.gasolineInventoryVolume > 0
                      ? form.gasolineInventoryVolume.toLocaleString()
                      : ""
                  }
                  onChange={handleNumberChange("gasolineInventoryVolume")}
                  className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                />

                <p className="absolute right-[12px] text-gray5">L</p>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <p className="font-semibold">
                  {data.gasolineInventoryVolume.toLocaleString()}
                </p>
                <p className="ml-[4px] text-gray5">L</p>
              </div>
            )}
          </div>

          {/* 경유 */}
          <div className="flex justify-between items-center w-full gap-x-[12px]">
            <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("DIESEL") }}
              />
              <p className="text-[12px] font-medium">경유</p>
            </div>

            {showEdit ? (
              <div className="relative flex items-center w-full">
                <input
                  value={
                    form.dieselInventoryVolume > 0
                      ? form.dieselInventoryVolume.toLocaleString()
                      : ""
                  }
                  onChange={handleNumberChange("dieselInventoryVolume")}
                  className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                />

                <p className="absolute right-[12px] text-gray5">L</p>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <p className="font-semibold">
                  {data.dieselInventoryVolume.toLocaleString()}
                </p>
                <p className="ml-[4px] text-gray5">L</p>
              </div>
            )}
          </div>

          {/* 고급유 */}
          <div className="flex justify-between items-center w-full gap-x-[12px]">
            <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("PREMIUM") }}
              />
              <p className="text-[12px] font-medium">고급유</p>
            </div>

            {showEdit ? (
              <div className="relative flex items-center w-full">
                <input
                  value={
                    form.premiumInventoryVolume > 0
                      ? form.premiumInventoryVolume.toLocaleString()
                      : ""
                  }
                  onChange={handleNumberChange("premiumInventoryVolume")}
                  className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                />

                <p className="absolute right-[12px] text-gray5">L</p>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <p className="font-semibold">
                  {data.premiumInventoryVolume.toLocaleString()}
                </p>
                <p className="ml-[4px] text-gray5">L</p>
              </div>
            )}
          </div>
        </div>

        {isToday && (
          <p className="mt-[12px] text-gray5 text-[12px]">
            *실측 재고는 마감 시 최종 확인 후 수정해주세요.
          </p>
        )}

        {showEdit && (
          <div className="flex justify-end items-center mt-[12px] gap-x-[12px]">
            <CustomButton
              onClick={handleCancel}
              width="40px"
              height="28px"
              backgroundColor={colors.white}
              color={colors.gray5}
              fontSize="13px"
              borderWidth="1px"
              borderColor={colors.gray2}
            >
              취소
            </CustomButton>

            <CustomButton
              onClick={handleSubmit}
              width="40px"
              height="28px"
              backgroundColor={colors.main}
              color={colors.white}
              fontSize="13px"
            >
              저장
            </CustomButton>
          </div>
        )}
      </div>
    </div>
  );
};

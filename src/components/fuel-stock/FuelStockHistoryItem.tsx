import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  useFuelStockControllerDeleteFuelStockHistory,
  useFuelStockControllerUpdateFuelStockHistory,
} from "@/api/fuel-stock/fuel-stock";
import {
  DailyFuelStockSummaryDetailFuelStockHistoryItem,
  UpdateFuelStockHistoryRequest,
} from "@/api/models";
import { CustomButton } from "../ui/Button";
import { editIcon, trashIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  history: DailyFuelStockSummaryDetailFuelStockHistoryItem;
  targetId: string | null;
  setTargetId: Dispatch<SetStateAction<string | null>>;
  isToday: boolean;
  onClose: () => void;
}

export const FuelStockHistoryItem = ({
  history,
  targetId,
  setTargetId,
  isToday,
  onClose,
}: Props) => {
  const queryClient = useQueryClient();

  const initialData: UpdateFuelStockHistoryRequest = {
    id: history.id,
    pricePerLiter: history.pricePerLiter,
    volume: history.volume,
  };

  const [updateForm, setUpdateForm] =
    useState<UpdateFuelStockHistoryRequest>(initialData);

  // 유류 내역 수정 API
  const {
    mutate: updateHistory,
    isPending: updateHistoryLoading,
    isError: updateHistoryError,
  } = useFuelStockControllerUpdateFuelStockHistory();

  // 유류 내역 삭제 API
  const {
    mutate: deleteHistory,
    isPending: deleteHistoryLoading,
    isError: deleteHistoryError,
  } = useFuelStockControllerDeleteFuelStockHistory();

  const isLoading = updateHistoryLoading || deleteHistoryLoading;
  const isTarget = targetId === history.id;

  const handleNumberChange =
    (key: keyof UpdateFuelStockHistoryRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");

      if (!value.trim()) {
        return setUpdateForm((prev) => ({
          ...prev,
          [key]: 0,
        }));
      }

      if (!/^\d+$/.test(value)) return;

      return setUpdateForm((prev) => ({
        ...prev,
        [key]: Number(value),
      }));
    };

  // 입고 내역 수정
  const handleUpdate = () => {
    if (!confirm("해당 입고 내역을 수정하시겠습니까?") || isLoading) return;

    if (updateForm === initialData) {
      return alert("수정된 내역이 없습니다.");
    }

    updateHistory(
      {
        data: updateForm,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["dailFuelStockSummaryDetail"],
          });

          onClose();

          return alert("입고 내역이 수정되었습니다.");
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "입고 내역 삭제 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  // 입고 내역 삭제
  const handleDelete = () => {
    if (!confirm("해당 입고 내역을 삭제하시겠습니까?") || isLoading) return;

    deleteHistory(
      {
        id: history.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["dailFuelStockSummaryDetail"],
          });

          onClose();

          return alert("입고 내역이 삭제되었습니다.");
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "입고 내역 삭제 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  const handleToggleShowForm = () => {
    if (isTarget) return setTargetId(null);

    return setTargetId(history.id);
  };

  useEffect(() => {
    setUpdateForm((prev) => ({
      id: history.id,
      pricePerLiter: history.pricePerLiter,
      volume: history.volume,
    }));
  }, [history, targetId]);

  return (
    <div className={`flex flex-col ${!isTarget && `border-b border-b-line`}`}>
      <div className="flex justify-between items-center px-[12px] py-[8px]">
        <div className="flex items-center">
          <div className="w-[80px]">
            {dayjs(history.createdAt).format("HH:mm")}
          </div>

          <div className="flex items-center w-[140px]">
            <p className="mr-[8px] text-[12px]">입고 단가</p>
            <p className="mr-[4px] font-semibold">
              {history.pricePerLiter.toLocaleString()}
            </p>
            <p className="text-gray5">원/L</p>
          </div>

          <div className="flex items-center">
            <p className="mr-[8px] text-[12px]">입고량</p>
            <p className="mr-[4px] font-semibold">
              {history.volume.toLocaleString()}
            </p>
            <p className="text-gray5">L</p>
          </div>
        </div>

        {isToday && (
          <div className="flex items-center gap-[16px]">
            <Image
              onClick={handleToggleShowForm}
              src={editIcon}
              alt="수정"
              className="size-[20px] cursor-pointer"
            />

            <Image
              onClick={handleDelete}
              src={trashIcon}
              alt="삭제"
              className="size-[20px] cursor-pointer"
            />
          </div>
        )}
      </div>

      {isTarget && (
        <div className="flex flex-col mb-[8px] p-[16px] bg-gray1 rounded-[12px]">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center w-full gap-x-[12px]">
              <p className="flex-shrink-0 text-[12px] font-medium">입고 단가</p>

              <div className="relative flex items-center w-full max-w-[202px]">
                <input
                  value={
                    updateForm.pricePerLiter > 0
                      ? updateForm.pricePerLiter.toLocaleString()
                      : ""
                  }
                  onChange={handleNumberChange("pricePerLiter")}
                  className="w-full pl-[12px] pr-[40px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                />

                <p className="absolute right-[12px] text-gray5">원/L</p>
              </div>
            </div>

            <div className="flex justify-end items-center w-full gap-x-[12px]">
              <p className="flex-shrink-0 text-[12px] font-medium">입고 단가</p>

              <div className="relative flex items-center w-full max-w-[202px]">
                <input
                  value={
                    updateForm.volume > 0
                      ? updateForm.volume.toLocaleString()
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
              onClick={() => setTargetId(null)}
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
              onClick={handleUpdate}
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
    </div>
  );
};

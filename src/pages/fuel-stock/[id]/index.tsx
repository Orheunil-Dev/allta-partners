import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  useFuelStockControllerDeleteDailyFuelStockSummary,
  useFuelStockControllerGetDailyFuelStockSummaryDetailById,
  useFuelStockControllerUpdateDailyFuelStockSummary,
} from "@/api/fuel-stock/fuel-stock";
import { UpdateDailyFuelStockSummaryRequest } from "@/api/models";
import { Callout } from "@/components/ui/Callout";
import { CustomButton } from "@/components/ui/Button";
import { colors } from "@/styles";

export default function CreateFuelStockSummary() {
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();

  const [form, setForm] = useState<UpdateDailyFuelStockSummaryRequest>({
    id: "",
    gasolineIncomePrice: 0,
    gasolineIncomeVolume: 0,
    gasolineInventory: 0,
    dieselIncomePrice: 0,
    dieselIncomeVolume: 0,
    dieselInventory: 0,
    premiumIncomePrice: 0,
    premiumIncomeVolume: 0,
    premiumInventory: 0,
    note: "",
  });

  // 일일 유류 재고 내역 조회 API
  const { data, isLoading, isError } =
    useFuelStockControllerGetDailyFuelStockSummaryDetailById(id as string, {
      query: {
        enabled: !!id,
      },
    });

  // 일일 유류 재고 내역 수정 API
  const {
    mutate: updateFuelStockSummary,
    isPending: updateFuelStockSummaryLoading,
    isError: updateFuelStockSummaryError,
  } = useFuelStockControllerUpdateDailyFuelStockSummary();

  // 일일 유류 재고 내역 삭제 API
  const {
    mutate: deleteFuelStockSummary,
    isPending: deleteFuelStockSummaryLoading,
    isError: deleteFuelStockSummaryError,
  } = useFuelStockControllerDeleteDailyFuelStockSummary();

  const handleChange =
    (key: keyof UpdateDailyFuelStockSummaryRequest) =>
    (
      value:
        | string
        | number
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const v = typeof value === "object" ? value.target.value : value;

      setForm((prev) => ({
        ...prev,
        [key]: v,
      }));
    };

  const handleNumberChange =
    (key: keyof UpdateDailyFuelStockSummaryRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");

      if (!value.trim()) {
        handleChange(key)(0);
        return;
      }

      if (!/^\d+$/.test(value)) return;

      handleChange(key)(Number(value));
    };

  const handleUpdate = () => {
    updateFuelStockSummary(
      {
        data: form,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["monthlyFuelStockSummary"],
          });

          alert("내역이 저장되었습니다.");

          return router.push({
            pathname: "/fuel-stock",
            query: {
              storeId: data?.data.storeId,
              year: data?.data.date ? dayjs(data?.data.date).year() : null,
              month: data?.data.date
                ? dayjs(data?.data.date).month() + 1
                : null,
            },
          });
        },
        onError: (error: any) => {
          alert(error.message ?? "내역 저장 중 오류가 발생했습니다.");
        },
      },
    );
  };

  const handleDelete = () => {
    deleteFuelStockSummary(
      {
        id: id as string,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["monthlyFuelStockSummary"],
          });

          alert("내역이 삭제되었습니다.");

          return router.push({
            pathname: "/fuel-stock",
            query: {
              storeId: data?.data.storeId,
              year: data?.data.date ? dayjs(data?.data.date).year() : null,
              month: data?.data.date
                ? dayjs(data?.data.date).month() + 1
                : null,
            },
          });
        },
        onError: (error: any) => {
          alert(error.message ?? "내역 삭제 중 오류가 발생했습니다.");
        },
      },
    );
  };

  useEffect(() => {
    if (!data) return;

    setForm({ ...data.data });
  }, [data]);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <Callout margin="16px 0 0 0">
        <p className="text-[20px] font-semibold">유류 재고 내역 작성</p>

        <p className="mt-[4px] text-[16px]">
          {data?.data.createdAt &&
            dayjs(data.data.createdAt).format("YYYY년 MM월 DD일 (ddd)")}{" "}
          - {data?.data.storeName}
        </p>

        <div className="flex flex-col max-w-[678px] mt-[32px] gap-[20px] text-[14px]">
          {/* 휘발유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div className="size-[8px] mr-[6px] bg-[#EB8723] rounded-full" />
              <p className="font-semibold">휘발유</p>
            </div>

            <div className="flex justify-between items-center gap-x-[20px] p-[12px]">
              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">단가</p>

                <div className="relative flex items-center mt-[8px]">
                  <input
                    value={
                      form.gasolineIncomePrice > 0
                        ? form.gasolineIncomePrice.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("gasolineIncomePrice")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">원</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">입고량</p>

                <div className="relative flex items-center mt-[8px]">
                  <input
                    value={
                      form.gasolineIncomeVolume > 0
                        ? form.gasolineIncomeVolume.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("gasolineIncomeVolume")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">실측 재고</p>

                <div className="relative flex items-center mt-[8px]">
                  <input
                    value={
                      form.gasolineInventory > 0
                        ? form.gasolineInventory.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("gasolineInventory")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>
            </div>
          </div>

          {/* 경유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div className="size-[8px] mr-[6px] bg-[#3B67D7] rounded-full" />
              <p className="font-semibold">경유</p>
            </div>

            <div className="flex justify-between items-center gap-x-[20px] p-[12px]">
              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">단가</p>

                <div className="relative flex items-center mt-[8px]">
                  <input
                    value={
                      form.dieselIncomePrice > 0
                        ? form.dieselIncomePrice.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("dieselIncomePrice")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">원</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">입고량</p>

                <div className="relative flex items-center mt-[8px] ">
                  <input
                    value={
                      form.dieselIncomeVolume > 0
                        ? form.dieselIncomeVolume.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("dieselIncomeVolume")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">실측 재고</p>

                <div className="relative flex items-center mt-[8px] ">
                  <input
                    value={
                      form.dieselInventory > 0
                        ? form.dieselInventory.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("dieselInventory")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>
            </div>
          </div>

          {/* 고급유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div className="size-[8px] mr-[6px] bg-[#4CD168] rounded-full" />
              <p className="font-semibold">고급유</p>
            </div>

            <div className="flex justify-between items-center gap-x-[20px] p-[12px]">
              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">단가</p>

                <div className="relative flex items-center mt-[8px] ">
                  <input
                    value={
                      form.premiumIncomePrice > 0
                        ? form.premiumIncomePrice.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("premiumIncomePrice")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">원</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">입고량</p>

                <div className="relative flex items-center mt-[8px] ">
                  <input
                    value={
                      form.premiumIncomeVolume > 0
                        ? form.premiumIncomeVolume.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("premiumIncomeVolume")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <p className="text-[12px] font-medium">실측 재고</p>

                <div className="relative flex items-center mt-[8px] ">
                  <input
                    value={
                      form.premiumInventory > 0
                        ? form.premiumInventory.toLocaleString()
                        : ""
                    }
                    onChange={handleNumberChange("premiumInventory")}
                    className="w-full pl-[12px] pr-[28px] py-[8px] border border-gray2 rounded-[6px]"
                  />

                  <p className="absolute right-[12px] text-gray5">L</p>
                </div>
              </div>
            </div>
          </div>

          {/* 비고 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <p className="font-semibold">비고</p>
            </div>

            <textarea
              value={form.note ?? ""}
              onChange={handleChange("note")}
              placeholder="메모를 입력하세요"
              className="w-full h-[120px] p-[12px] rounded-b-[12px] overflow-y-auto resize-none outline-none focus:outline-none"
            />
          </div>
        </div>
      </Callout>

      <div className="flex self-center items-center mt-[32px] gap-[12px] text-[14px]">
        <CustomButton onClick={handleUpdate} backgroundColor={colors.main}>
          <p className="text-white">저장</p>
        </CustomButton>

        <CustomButton
          onClick={handleDelete}
          borderWidth="1px"
          borderColor={colors.gray2}
        >
          <p className="text-gray5">삭제</p>
        </CustomButton>
      </div>
    </div>
  );
}

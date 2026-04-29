import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useFuelStockControllerCreateDailyFuelStockSummary } from "@/api/fuel-stock/fuel-stock";
import { CreateDailyFuelStockSummaryRequest } from "@/api/models";
import { Callout } from "@/components/ui/Callout";
import { CustomButton } from "@/components/ui/Button";
import { colors } from "@/styles";
import { getFuelTypeColor } from "@/utils";

export default function CreateFuelStockSummary() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [form, setForm] = useState<CreateDailyFuelStockSummaryRequest>({
    storeId: "",
    gasolineIncomePrice: 0,
    gasolineIncomeVolume: 0,
    gasolineInventoryVolume: 0,
    dieselIncomePrice: 0,
    dieselIncomeVolume: 0,
    dieselInventoryVolume: 0,
    premiumIncomePrice: 0,
    premiumIncomeVolume: 0,
    premiumInventoryVolume: 0,
    note: "",
  });

  // 일일 유류 재고 내역 생성 API
  const {
    mutate: createFuelStockSummary,
    isPending: createFuelStockSummaryLoading,
    isError: createFuelStockSummaryError,
  } = useFuelStockControllerCreateDailyFuelStockSummary();

  const handleChange =
    (key: keyof CreateDailyFuelStockSummaryRequest) =>
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
    (key: keyof CreateDailyFuelStockSummaryRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/,/g, "");

      if (!value.trim()) {
        return handleChange(key)(0);
      }

      if (!/^\d+$/.test(value)) return;

      handleChange(key)(Number(value));
    };

  const handleCreate = () => {
    if (!storeId) {
      return alert("매장을 선택해주세요.");
    }

    createFuelStockSummary(
      {
        data: {
          ...form,
          storeId,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["monthlyFuelStockSummary"],
          });

          alert("내역이 저장되었습니다.");

          return router.push({
            pathname: "/fuel-stock",
            query: { storeId },
          });
        },
        onError: (error: any) => {
          alert(error.message ?? "내역 저장 중 오류가 발생했습니다.");
        },
      },
    );
  };

  useEffect(() => {
    const queryStoreId = router.query.storeId;
    const queryStoreName = router.query.storeName;

    if (typeof queryStoreId === "string") {
      setStoreId(queryStoreId);
    }

    if (typeof queryStoreName === "string") {
      setStoreName(queryStoreName);
    }
  }, [router.query.storeId, router.query.storeName, router.query.date]);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <Callout margin="16px 0 0 0">
        <p className="text-[20px] font-semibold">유류 재고 내역 작성</p>

        <p className="mt-[4px]">
          {dayjs().format("YYYY년 MM월 DD일 (ddd)")} - {storeName}
        </p>

        <div className="flex flex-col max-w-[678px] mt-[32px] gap-[20px] text-[14px]">
          {/* 휘발유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("GASOLINE") }}
              />
              <p className="font-semibold">휘발유</p>
            </div>

            <div className="flex flex-col p-[20px]">
              <p className="my-[6px] text-gray5 font-semibold">입고 내역</p>

              <div className="flex justify-between items-center mt-[4px] p-[16px] bg-gray1 rounded-[12px]">
                <div className="flex justify-start items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고 단가</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.gasolineIncomePrice > 0
                          ? form.gasolineIncomePrice.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("gasolineIncomePrice")}
                      className="w-full pl-[12px] pr-[40px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">원/L</p>
                  </div>
                </div>

                <div className="flex justify-end items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고량</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.gasolineIncomeVolume > 0
                          ? form.gasolineIncomeVolume.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("gasolineIncomeVolume")}
                      className="w-full pl-[12px] pr-[24px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 경유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("DIESEL") }}
              />
              <p className="font-semibold">경유</p>
            </div>

            <div className="flex flex-col p-[20px]">
              <p className="my-[6px] text-gray5 font-semibold">입고 내역</p>

              <div className="flex justify-between items-center mt-[4px] p-[16px] bg-gray1 rounded-[12px]">
                <div className="flex justify-start items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고 단가</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.dieselIncomePrice > 0
                          ? form.dieselIncomePrice.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("dieselIncomePrice")}
                      className="w-full pl-[12px] pr-[40px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">원/L</p>
                  </div>
                </div>

                <div className="flex justify-end items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고량</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.dieselIncomeVolume > 0
                          ? form.dieselIncomeVolume.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("dieselIncomeVolume")}
                      className="w-full pl-[12px] pr-[24px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 고급유 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <div
                className="size-[8px] mr-[6px] rounded-full"
                style={{ backgroundColor: getFuelTypeColor("PREMIUM") }}
              />
              <p className="font-semibold">고급유</p>
            </div>

            <div className="flex flex-col p-[20px]">
              <p className="my-[6px] text-gray5 font-semibold">입고 내역</p>

              <div className="flex justify-between items-center mt-[4px] p-[16px] bg-gray1 rounded-[12px]">
                <div className="flex justify-start items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고 단가</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.premiumIncomePrice > 0
                          ? form.premiumIncomePrice.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("premiumIncomePrice")}
                      className="w-full pl-[12px] pr-[40px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">원/L</p>
                  </div>
                </div>

                <div className="flex justify-end items-center w-full gap-x-[12px]">
                  <p className="text-[12px] font-medium">입고량</p>

                  <div className="relative flex items-center w-full max-w-[202px]">
                    <input
                      value={
                        form.premiumIncomeVolume > 0
                          ? form.premiumIncomeVolume.toLocaleString()
                          : ""
                      }
                      onChange={handleNumberChange("premiumIncomeVolume")}
                      className="w-full pl-[12px] pr-[24px] py-[8px] bg-white border border-gray2 rounded-[6px]"
                    />

                    <p className="absolute right-[12px] text-gray5">L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 실측 재고 */}
          <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
            <div className="flex items-center p-[12px] bg-gray1">
              <p className="font-semibold">실측 재고</p>
            </div>

            <div className="flex flex-col p-[20px]">
              <div className="flex justify-between items-center gap-x-[20px]">
                <div className="flex justify-between items-center w-full gap-x-[12px]">
                  <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
                    <div
                      className="size-[8px] mr-[6px] rounded-full"
                      style={{ backgroundColor: getFuelTypeColor("GASOLINE") }}
                    />
                    <p className="text-[12px] font-medium">휘발유</p>
                  </div>

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
                </div>

                <div className="flex justify-between items-center w-full gap-x-[12px]">
                  <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
                    <div
                      className="size-[8px] mr-[6px] rounded-full"
                      style={{ backgroundColor: getFuelTypeColor("DIESEL") }}
                    />
                    <p className="text-[12px] font-medium">경유</p>
                  </div>

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
                </div>

                <div className="flex justify-between items-center w-full gap-x-[12px]">
                  <div className="flex flex-shrink-0 justify-between items-center leading-[1]">
                    <div
                      className="size-[8px] mr-[6px] rounded-full"
                      style={{ backgroundColor: getFuelTypeColor("PREMIUM") }}
                    />
                    <p className="text-[12px] font-medium">고급유</p>
                  </div>

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
                </div>
              </div>

              <p className="mt-[12px] text-gray5 text-[12px]">
                *실측 재고는 마감 시 최종 확인 후 수정해주세요.
              </p>
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
              className="w-full h-[120px] p-[20px] rounded-b-[12px] overflow-y-auto resize-none outline-none focus:outline-none"
            />
          </div>
        </div>
      </Callout>

      <CustomButton
        onClick={handleCreate}
        margin="32px 0 0 0"
        alignSelf="center"
        backgroundColor={colors.main}
      >
        <p className="text-white text-[14px]">저장</p>
      </CustomButton>
    </div>
  );
}

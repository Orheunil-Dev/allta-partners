import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import dayjs from "dayjs";
import { useFuelStockControllerCreateDailyFuelStockSummary } from "@/api/fuel-stock/fuel-stock";
import { CreateDailyFuelStockSummaryRequest } from "@/api/models";
import { Callout } from "@/components/ui/Callout";
import { CustomButton } from "@/components/ui/Button";
import { calendarNextIcon, calendarPrevIcon } from "../../../../public/images";
import { colors } from "@/styles";

export default function CreateFuelStockSummary() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [form, setForm] = useState<CreateDailyFuelStockSummaryRequest>({
    storeId: "",
    date: "",
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
  const [showDaypicker, setShowDaypicker] = useState<boolean>(false);

  // 일일 유류 재고 내역 생성 API
  const {
    mutate: createFuelStockSummary,
    isPending: createFuelStockSummaryLoading,
    isError: createFuelStockSummaryError,
  } = useFuelStockControllerCreateDailyFuelStockSummary();

  const handleSelectDate = (day?: Date) => {
    if (!day) return;

    setDate(dayjs(day));
    setForm((prev) => ({
      ...prev,
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
    }));
    setShowDaypicker(false);
  };

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
        handleChange(key)(0);
        return;
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
          date: dayjs(date).format("YYYY-MM-DD"),
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
            query: {
              storeId,
              year: date.year(),
              month: date.month() + 1,
            },
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
    const queryDate = router.query.date;

    if (typeof queryStoreId === "string") {
      setStoreId(queryStoreId);
    }

    if (typeof queryStoreName === "string") {
      setStoreName(queryStoreName);
    }

    if (typeof queryDate === "string") {
      setDate(dayjs(queryDate));
    }
  }, [router.query.storeId, router.query.storeName, router.query.date]);

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      <Callout margin="16px 0 0 0">
        <p className="text-[20px] font-semibold">유류 재고 내역 작성</p>

        <div className="relative mt-[4px]">
          <div className="flex items-center">
            <button
              onClick={() => setShowDaypicker(true)}
              className="cursor-pointer"
            >
              {dayjs(date).format("YYYY년 MM월 DD일 (ddd)")}
            </button>

            <p>{"\u00A0- " + storeName}</p>
          </div>

          {showDaypicker && (
            <div
              className="absolute flex flex-col min-w-[340px] top-[30px] px-[16px] py-[12px] bg-white rounded-[12px] z-[4]"
              style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
            >
              <DayPicker
                mode="single"
                selected={date.toDate()}
                onSelect={handleSelectDate}
                defaultMonth={date.toDate()}
                disabled={{ after: new Date() }}
                numberOfMonths={1}
                navLayout="around"
                locale={ko}
                className="custom-daypicker"
                classNames={{
                  selected: "!text-white text-[14px] bg-[#6865e7] rounded-full",
                }}
                components={{
                  CaptionLabel: ({ children }) => {
                    const text = children?.toString() || "";
                    const [month, year] = text.split(" ");

                    return (
                      <p className="text-[16px] font-semibold">
                        {year} {month}
                      </p>
                    );
                  },
                  Chevron: ({ orientation, ...props }) => {
                    if (orientation === "right") {
                      return (
                        <Image
                          src={calendarNextIcon}
                          alt="다음 달"
                          className="w-[20px] h-[20px]"
                        />
                      );
                    } else if (orientation === "left") {
                      return (
                        <Image
                          src={calendarPrevIcon}
                          alt="이전 달"
                          className="w-[20px] h-[20px]"
                        />
                      );
                    }

                    return <div />;
                  },
                }}
              />

              <CustomButton
                onClick={() => setShowDaypicker(false)}
                alignSelf="end"
                borderWidth="1px"
                borderColor={colors.gray2}
              >
                <p className="text-gray5">취소</p>
              </CustomButton>
            </div>
          )}
        </div>

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

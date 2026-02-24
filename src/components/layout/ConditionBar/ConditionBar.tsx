"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Select, {
  SingleValueProps,
  StylesConfig,
  components,
} from "react-select";
import { DateRange, DayPicker } from "react-day-picker";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import dayjs from "dayjs";
import { useGetManagedStoreList, useResizeHandler } from "@/hooks";
import { SelectOption } from "@/types";
import { Callout } from "@/components/ui/Callout";
import {
  conditionBarIcon,
  calendarIcon,
  calendarNextIcon,
  calendarPrevIcon,
} from "../../../../public/images";

type Period = "오늘" | "7일" | "30일" | "90일" | "기타";

const periods: Period[] = ["오늘", "7일", "30일", "90일"];

interface Props {
  storeId: string | null;
  setStoreId: Dispatch<SetStateAction<string | null>>;
  startDate?: string | null;
  setStartDate?:
    | Dispatch<SetStateAction<string | null>>
    | Dispatch<SetStateAction<string>>;
  endDate?: string | null;
  setEndDate?:
    | Dispatch<SetStateAction<string | null>>
    | Dispatch<SetStateAction<string>>;
  showEntireStore?: boolean;
}

export const ConditionBar = ({
  storeId,
  setStoreId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  showEntireStore = true,
}: Props) => {
  const { isDesktop } = useResizeHandler();

  const managedStoreList = useGetManagedStoreList();

  const [showDaypicker, setShowDaypicker] = useState<boolean>(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [period, setPeriod] = useState<Period>(
    startDate && endDate ? "30일" : "기타",
  );

  // 기간 선택
  const handleSelectPeriod = () => {
    if (!setStartDate || !setEndDate) return;
    if (!range?.from || !range?.to) return;

    const from = range.from;
    const to = range.to ?? range.from;

    setStartDate(dayjs(from).format("YYYY-MM-DD"));
    setEndDate(dayjs(to).format("YYYY-MM-DD"));
    setPeriod("기타");
    setShowDaypicker(false);
  };

  // 기간 버튼 클릭
  const handleTogglePeriod = (value: Period) => () => {
    if (!setStartDate || !setEndDate) return;
    if (period === value) return;

    const today = dayjs();

    switch (value) {
      case "오늘": {
        setStartDate(today.format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      }

      case "7일": {
        setStartDate(today.subtract(6, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      }

      case "30일": {
        setStartDate(today.subtract(29, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      }

      case "90일": {
        setStartDate(today.subtract(89, "day").format("YYYY-MM-DD"));
        setEndDate(today.format("YYYY-MM-DD"));
        break;
      }
    }

    return setPeriod(value);
  };

  const CustomSingleValue = (props: SingleValueProps<SelectOption>) => {
    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-x-[4px] whitespace-nowrap">
          <Image src={conditionBarIcon} alt="매장" className="size-[20px]" />
          <span>{props.children}</span>
        </div>
      </components.SingleValue>
    );
  };

  const selectOptions: SelectOption[] = useMemo(() => {
    const stores = managedStoreList.map((store) => ({
      value: store.id,
      label: store.name,
    }));

    if (managedStoreList.length <= 1 || !showEntireStore) {
      return stores;
    }

    return [{ value: null, label: "전체 매장" }, ...stores];
  }, [managedStoreList]);

  useEffect(() => {
    if (managedStoreList.length === 1) {
      setStoreId(managedStoreList[0].id);
    }
  }, [managedStoreList]);

  useEffect(() => {
    if (!startDate || !endDate) return;

    setRange({
      from: dayjs(startDate).toDate(),
      to: dayjs(endDate).toDate(),
    });
  }, [startDate, endDate]);

  return (
    <Callout
      flexDirection={isDesktop ? "row" : "column"}
      margin="0 0 24px 0"
      gap={isDesktop ? "20px" : "12px"}
    >
      <Select<SelectOption>
        options={selectOptions}
        value={
          selectOptions.find((opt) => opt.value === storeId) ??
          selectOptions.find((opt) => opt.value === null) ??
          null
        }
        onChange={(opt) => {
          setStoreId((opt?.value as string) ?? null);
        }}
        components={{
          IndicatorSeparator: () => null,
          SingleValue: CustomSingleValue,
        }}
        isSearchable={false}
        menuPosition="fixed"
        menuPlacement="auto"
        styles={selectStyles}
      />

      {setStartDate && setEndDate && (
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-[12px] lg:gap-[20px]">
          {/* 캘린더 */}
          {showDaypicker && (
            <div
              className="absolute flex flex-col min-w-[680px] top-[30px] px-[16px] py-[12px] bg-white rounded-[12px] z-[4]"
              style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
            >
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                defaultMonth={dayjs().subtract(1, "month").toDate()}
                disabled={{ after: new Date() }}
                numberOfMonths={2}
                navLayout="around"
                locale={ko}
                className="custom-daypicker"
                classNames={{
                  selected: "text-[14px]",
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
                          alt="다음 달"
                          className="w-[20px] h-[20px]"
                        />
                      );
                    }

                    return <div />;
                  },
                }}
              />

              <div className="flex self-end gap-x-[12px]">
                <button
                  type="button"
                  onClick={() => setShowDaypicker(false)}
                  className="w-[84px] h-[44px] bg-white border border-gray2 rounded-[8px] cursor-pointer"
                >
                  취소
                </button>

                <button
                  type="button"
                  onClick={handleSelectPeriod}
                  className="w-[84px] h-[44px] bg-main text-white rounded-[8px] cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDaypicker(!showDaypicker)}
            className="flex items-center w-fit cursor-pointer"
          >
            <Image
              src={calendarIcon}
              alt="기간 선택"
              className="w-[20px] h-[20px] mr-[8px]"
            />

            <div className="flex items-center text-[16px]">
              <p className={startDate ? "text-black" : "text-gray5"}>
                {startDate ? dayjs(startDate).format("YY.MM.DD") : "YY.MM.DD"}
              </p>

              <p className="mx-[4px]">~</p>

              <p className={endDate ? "text-black" : "text-gray5"}>
                {endDate ? dayjs(endDate).format("YY.MM.DD") : "YY.MM.DD"}
              </p>
            </div>
          </button>

          <div className="flex items-center gap-x-[8px]">
            {periods.map((value) => (
              <button
                key={value}
                onClick={handleTogglePeriod(value)}
                className={`w-[48px] h-[30px] text-[13px] rounded-[6px] border cursor-pointer ${period === value ? "text-point2 border-point2" : "border-gray2"}`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}
    </Callout>
  );
};

const selectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "16px",
  }),
  control: (provided) => ({
    ...provided,
    width: "200px",
    minHeight: "34px",
    padding: "8px 10px",
    borderWidth: "1px",
    borderColor: "#ECECEE",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    whiteSpace: "nowrap",
  }),
  menu: (provided) => ({
    ...provided,
    width: "160px",
    borderRadius: "8px",
    overflow: "hidden",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#D1D1F0",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: 0,
  }),
};

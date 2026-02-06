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
  startDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: Dispatch<SetStateAction<string>>;
}

export const ConditionBar = ({
  storeId,
  setStoreId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) => {
  const { isTablet } = useResizeHandler();

  // 관리자 권한 있는 매장 목록
  const managedStoreList = useGetManagedStoreList();

  const [showDaypicker, setShowDaypicker] = useState<boolean>(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [period, setPeriod] = useState<Period>("30일");

  // 기간 선택
  const handleSelectPeriod = () => {
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
          <Image
            src={conditionBarIcon}
            alt="매장"
            className="w-[16px] h-[16px]"
          />
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

    if (managedStoreList.length <= 1) {
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
    <Callout flexDirection={isTablet ? "column" : "row"} margin="0 0 24px 0">
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

      <div className="relative flex items-center ml-[20px]">
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

          <p className="text-[16px]">
            {dayjs(startDate).format("YYYY년 M월 D일")} ~{" "}
            {dayjs(endDate).format("YYYY년 M월 D일")}
          </p>
        </button>
      </div>

      <div className="flex items-center ml-[20px] gap-x-[8px]">
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
    </Callout>
  );
};

const selectStyles: StylesConfig<SelectOption> = {
  container: (provided) => ({
    ...provided,
    fontSize: "14px",
    zIndex: 3,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
  control: (provided) => ({
    ...provided,
    width: "240px",
    minHeight: "34px",
    padding: "6px 10px",
    borderWidth: "1px",
    borderColor: "#DDDDDF",
    borderRadius: "8px",
    outline: "none",
    cursor: "pointer",
    fontSize: "14px",
  }),
  input: (provided) => ({
    ...provided,
    outline: "none",
    fontSize: "14px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
    whiteSpace: "nowrap",
  }),
  menu: (provided) => ({
    ...provided,
    width: "240px",
    borderRadius: "8px",
    overflow: "hidden",
    fontSize: "14px",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#F2F2FD" : "white",
    color: "#262627",
    textAlign: "start",
    fontSize: "14px",
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
    fontSize: "14px",
  }),
};

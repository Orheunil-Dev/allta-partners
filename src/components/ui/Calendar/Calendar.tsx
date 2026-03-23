import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import axios from "axios";
import dayjs from "dayjs";
import { Callout } from "../Callout";
import { nextMonthIcon, prevMonthIcon } from "../../../../public/images";
import { colors } from "@/styles";

interface Props {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  onClick?: (date: dayjs.Dayjs) => void;
  item?: (date: dayjs.Dayjs) => ReactNode;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export const Calendar = ({
  year,
  setYear,
  month,
  setMonth,
  onClick,
  item,
}: Props) => {
  const [days, setDays] = useState<(number | null)[]>([]);
  const [holidays, setHolidays] = useState<{ name: string; date: string }[]>(
    [],
  );

  const firstDayOfMonth = dayjs(`${year}-${month}-01`);
  const firstDayIdx = firstDayOfMonth.day();
  const daysInMonth = firstDayOfMonth.daysInMonth();

  const fetchHolidays = async (year: number, month: number) => {
    try {
      const res = await axios.get(
        "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo",
        {
          params: {
            solYear: year,
            solMonth: String(month).padStart(2, "0"),
            ServiceKey: process.env.NEXT_PUBLIC_DATAGOKR_API_KEY,
          },
        },
      );

      const items = res.data.response.body.items.item;

      const holidays = items.map((value: any) => {
        const dateName = value.dateName;
        const locdate = String(value.locdate);

        return {
          name: dateName,
          date: locdate,
        };
      });

      return holidays;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const isHoliday = (dateObj: dayjs.Dayjs) => {
    const dateStr = dateObj.format("YYYYMMDD");

    return holidays.find((h) => h.date === dateStr);
  };

  const handleNextMonth = () => {
    if (month > 11) {
      setMonth(1);
      return setYear(year + 1);
    }

    return setMonth(month + 1);
  };

  const handlePrevMonth = () => {
    if (month < 2) {
      setMonth(12);
      return setYear(year - 1);
    }

    return setMonth(month - 1);
  };

  const getDateObject = (value: number, index: number) => {
    if (index < firstDayIdx) {
      return firstDayOfMonth.subtract(1, "month").date(value);
    } else if (index >= firstDayIdx + daysInMonth) {
      return firstDayOfMonth.add(1, "month").date(value);
    }
    return firstDayOfMonth.date(value);
  };

  const getTextColor = (dateObj: dayjs.Dayjs) => {
    const isCurrentMonth = dateObj.month() + 1 === month;
    if (!isCurrentMonth) return colors.gray4;

    const day = dateObj.day();
    const holiday = isHoliday(dateObj);

    if (holiday || day === 0) return colors.red;
    if (day === 6) return colors.blue;

    return colors.black;
  };

  useEffect(() => {
    const newDays: (number | null)[] = [];

    const prevMonthLastDay = firstDayOfMonth.subtract(1, "month").daysInMonth();
    for (let i = firstDayIdx - 1; i >= 0; i--) {
      newDays.push(prevMonthLastDay - i);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      newDays.push(i);
    }

    const totalCells = Math.ceil(newDays.length / 7) * 7;

    let nextDay = 1;

    while (newDays.length < totalCells) {
      newDays.push(nextDay++);
    }

    setDays(newDays);
    fetchHolidays(year, month).then(setHolidays);
  }, [year, month]);

  return (
    <Callout>
      {/* 기간(년-월) */}
      <div className="flex">
        <div className="w-[120px] text-[20px] font-semibold">
          {year}년 {month}월
        </div>

        <button onClick={handlePrevMonth} className="cursor-pointer">
          <Image src={prevMonthIcon} alt="이전" className="size-[24px]" />
        </button>
        <button onClick={handleNextMonth} className="ml-[6px] cursor-pointer">
          <Image src={nextMonthIcon} alt="다음" className="size-[24px]" />
        </button>
      </div>

      <div className="flex flex-col w-full overflow-x-auto">
        {/* 요일 */}
        <div className="grid grid-cols-[repeat(7,minmax(120px,1fr))] min-w-[848px] mt-[20px] gap-[1px]">
          {weekDays.map((value) => (
            <div
              key={value}
              className="flex items-center h-[46px] px-[14px] text-gray5 text-[16px] font-medium bg-white"
            >
              {value}
            </div>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-[repeat(7,minmax(120px,1fr))] min-w-[848px] bg-line border border-line gap-[1px]">
          {days.map((value, index) => {
            if (!value) {
              return (
                <div key={index} className="h-[126px] p-[12px] bg-white" />
              );
            }

            const dateObject = getDateObject(value, index);
            const isCurrentMonth = dateObject.month() + 1 === month;
            const isToday = dateObject.isSame(dayjs(), "day");

            return (
              <div
                key={index}
                onClick={() => onClick?.(dateObject)}
                className={`h-[126px] p-[6px] bg-white ${onClick ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className="flex items-center">
                  <p
                    className="w-fit px-[6px] py-[1px] text-[16px] font-medium rounded-[8px]"
                    style={{
                      color: isToday ? colors.white : getTextColor(dateObject),
                      backgroundColor: isToday ? colors.main : colors.white,
                    }}
                  >
                    {value}
                  </p>

                  {isHoliday(dateObject) && (
                    <p style={{ fontSize: "12px", color: colors.red }}>
                      {isHoliday(dateObject)?.name}
                    </p>
                  )}
                </div>

                {isCurrentMonth && item?.(dateObject)}
              </div>
            );
          })}
        </div>
      </div>
    </Callout>
  );
};

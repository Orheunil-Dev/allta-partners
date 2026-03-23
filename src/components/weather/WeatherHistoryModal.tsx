import Image from "next/image";
import dayjs from "dayjs";
import { useWeatherControllerGetDailyWeatherHistory } from "@/api/weather/weather";
import { useResizeHandler } from "@/hooks";
import { formatPrecipitationType, formatWeatherIcon } from "@/utils";
import { Callout } from "../ui/Callout";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import {
  closeIcon,
  cloudIcon,
  rainIcon,
  snowIcon,
  sunnyIcon,
} from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  storeId: string | null;
  storeName: string | null;
  date: dayjs.Dayjs | null;
  onClose: () => void;
}

export const WeatherHistoryModal = ({
  storeId,
  storeName,
  date,
  onClose,
}: Props) => {
  if (!storeId || !date) return;

  const { isDesktop, isTablet, isMobile } = useResizeHandler();

  // 날씨 상세 내역 조회 API
  const {
    data,
    isLoading,
    isError,
    refetch: dailyRefetch,
  } = useWeatherControllerGetDailyWeatherHistory(
    { storeId: storeId!, date: date.format("YYYY-MM-DD")! },
    { query: { enabled: !!storeId && !!date } },
  );

  const renderWeatherIcon = (weatherCode: string) => {
    const weatherKind = formatWeatherIcon(weatherCode);

    switch (weatherKind) {
      case "화창":
        return sunnyIcon;
      case "흐림":
        return cloudIcon;
      case "비":
        return rainIcon;
      case "눈":
        return snowIcon;
      default:
        return sunnyIcon;
    }
  };

  return (
    <CustomModal
      visible={!!date}
      onClose={onClose}
      width={isTablet || isDesktop ? "740px" : "90%"}
      padding="24px"
    >
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">날씨 내역</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[20px]" />
          </button>
        </div>

        <p className="mt-[4px] text-[16px]">
          {dayjs(date).format("YYYY년 MM월 DD일 (ddd)")} - {storeName}
        </p>

        {data?.data ? (
          <div className="flex flex-col md:grid md:grid-cols-2 max-h-[60vh] md:max-h-[90vh] my-[32px] px-[24px] gap-[40px] overflow-y-auto">
            <div className="flex flex-col">
              <div className="flex justify-between items-center px-[12px] py-[8px] text-[14px] border-b border-line">
                <p>날씨</p>
                <p>
                  {formatPrecipitationType(data.data.precipitationType ?? null)}
                </p>
              </div>
              <div className="flex justify-between items-center px-[12px] py-[8px] text-[14px] border-b border-line">
                <p>기온</p>
                <p>
                  최고{" "}
                  {data.data.highestTemperature !== null
                    ? `${data.data.highestTemperature}°`
                    : "-"}{" "}
                  / 최저{" "}
                  {data.data.lowestTemperature !== null
                    ? `${data.data.lowestTemperature}°`
                    : "-"}
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center px-[12px] py-[8px] text-[14px] border-b border-line">
                <p>평균 기온</p>
                <p>
                  {data.data.averageTemperatureToday !== null
                    ? `${data.data.averageTemperatureToday}°`
                    : "-"}
                </p>
              </div>
              <div className="flex justify-between items-center px-[12px] py-[8px] text-[14px] border-b border-line">
                <p>강수량</p>
                <p>
                  {data.data.precipitationToday !== null
                    ? `${data.data.precipitationToday}mm`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <div />
        ) : (
          <p className="my-[80px] text-center text-gray5 text-[16px]">
            해당 일자의 날씨 내역이 없습니다.
          </p>
        )}
      </div>

      {data?.data.weatherHistories &&
        data?.data.weatherHistories.length > 0 && (
          <Callout
            padding="18px"
            backgroundColor={colors.gray1}
            isShadow={false}
          >
            <div
              className="flex w-full gap-[4px] overflow-x-auto"
              style={{ scrollbarWidth: "thin" }}
            >
              {data.data.weatherHistories.map((value, index) => (
                <div className="flex flex-col items-center min-w-[60px] py-[2px] gap-y-[6px]">
                  <p className="text-[12px]">{value.time.slice(0, 2)}시</p>
                  <p className="text-[14px] font-semibold">
                    {value.temperature}°
                  </p>
                  <p className="text-gray4 text-[12px]">
                    {value.currentPrecipitation
                      ? `${value.currentPrecipitation}mm`
                      : "-"}
                  </p>

                  <Image
                    src={renderWeatherIcon(value.weatherCode)}
                    alt={value.weatherText}
                    className="size-[24px]"
                  />
                </div>
              ))}
            </div>
          </Callout>
        )}

      <CustomButton
        onClick={onClose}
        borderWidth="1px"
        borderColor={colors.gray2}
      >
        닫기
      </CustomButton>
    </CustomModal>
  );
};

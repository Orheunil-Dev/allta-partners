import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  useFuelStockControllerDeleteDailyFuelStockSummary,
  useFuelStockControllerGetDailyFuelStockSummaryDetailById,
} from "@/api/fuel-stock/fuel-stock";
import { Callout } from "@/components/ui/Callout";
import { CustomButton } from "@/components/ui/Button";
import {
  FuelInventoryBox,
  FuelStockBox,
  FuelStockHistoryBox,
  FuelStockNoteBox,
} from "@/components/fuel-stock";
import { colors } from "@/styles";

export default function CreateFuelStockSummary() {
  const router = useRouter();
  const { id } = router.query;

  const queryClient = useQueryClient();

  // 일일 유류 재고 내역 조회 API
  const { data, isLoading, isError } =
    useFuelStockControllerGetDailyFuelStockSummaryDetailById(id as string, {
      query: {
        enabled: !!id,
        queryKey: ["dailFuelStockSummaryDetail"],
      },
    });

  // 일일 유류 재고 내역 삭제 API
  const {
    mutate: deleteFuelStockSummary,
    isPending: deleteFuelStockSummaryLoading,
    isError: deleteFuelStockSummaryError,
  } = useFuelStockControllerDeleteDailyFuelStockSummary();

  const isToday =
    dayjs().format("YYYY-MM-DD") ===
    dayjs(data?.data.date).format("YYYY-MM-DD");

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

  if (isLoading) return;

  return (
    <div className="flex flex-col h-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px] overflow-y-auto">
      {data ? (
        <div className="flex flex-col">
          <Callout margin="16px 0 0 0">
            <p className="text-[20px] font-semibold">유류 재고 상세 내역</p>

            <p className="mt-[4px] text-[16px]">
              {data.data.createdAt &&
                dayjs(data.data.createdAt).format(
                  "YYYY년 MM월 DD일 (ddd)",
                )}{" "}
              - {data.data.storeName}
            </p>

            <div className="flex flex-col max-w-[678px] mt-[32px] gap-[20px] text-[14px]">
              {/* 휘발유 */}
              <FuelStockHistoryBox
                fuelType="GASOLINE"
                histories={data.data.fuelStockHistories.filter(
                  (h) => h.fuelType === "GASOLINE",
                )}
                dailyFuelStockSummaryId={id as string}
                data={data.data}
                isToday={isToday}
              />

              {/* 경유 */}
              <FuelStockHistoryBox
                fuelType="DIESEL"
                histories={data.data.fuelStockHistories.filter(
                  (h) => h.fuelType === "DIESEL",
                )}
                dailyFuelStockSummaryId={id as string}
                data={data.data}
                isToday={isToday}
              />

              {/* 고급유 */}
              <FuelStockHistoryBox
                fuelType="PREMIUM_GASOLINE"
                histories={data.data.fuelStockHistories.filter(
                  (h) => h.fuelType === "PREMIUM_GASOLINE",
                )}
                dailyFuelStockSummaryId={id as string}
                data={data.data}
                isToday={isToday}
              />

              {/* 실측 재고 */}
              <FuelInventoryBox data={data.data} isToday={isToday} />

              {/* 비고 */}
              <FuelStockNoteBox data={data.data} isToday={isToday} />
            </div>
          </Callout>

          <FuelStockBox data={data.data} />
        </div>
      ) : (
        <Callout>
          <p>재고 내역이 존재하지 않습니다.</p>
        </Callout>
      )}

      {isToday && (
        <CustomButton
          onClick={handleDelete}
          alignSelf="center"
          margin="32px 0 0 0"
          backgroundColor={colors.white}
          borderWidth="1px"
          borderColor={colors.gray2}
          color={colors.gray5}
          fontSize="14px"
        >
          삭제
        </CustomButton>
      )}
    </div>
  );
}

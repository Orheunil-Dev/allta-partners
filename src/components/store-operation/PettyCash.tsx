import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import {
  useStoreOperationControllerCloseStore,
  useStoreOperationControllerDepositCash,
  useStoreOperationControllerOpenStore,
} from "@/api/store-operation/store-operation";
import { DailyStoreOperationResult } from "@/api/models";
import { useResizeHandler } from "@/hooks";
import { Callout } from "../ui/Callout";
import { CustomButton } from "../ui/Button";
import { colors } from "@/styles";

dayjs.locale("ko");

interface Props {
  storeId: string | null;
  data?: DailyStoreOperationResult | null;
  dailyRefetch: () => void;
  monthlyRefetch: () => void;
}

export const PettyCash = ({
  storeId,
  data,
  dailyRefetch,
  monthlyRefetch,
}: Props) => {
  const { isDesktop, isTablet, isMobile } = useResizeHandler();

  const [openingCash, setOpeningCash] = useState<number | null>(null);
  const [closingCash, setClosingCash] = useState<number | null>(null);
  const [serviceCount, setServiceCount] = useState<number | null>(null);
  const [depositCash, setDepositCash] = useState<number | null>(null);

  // 매장 오픈 API
  const {
    mutate: storeOpen,
    isPending: storeOpenLoading,
    isError: storeOpenError,
  } = useStoreOperationControllerOpenStore();

  // 매장 마감 API
  const {
    mutate: storeClose,
    isPending: storeCloseLoading,
    isError: storeCloseError,
  } = useStoreOperationControllerCloseStore();

  // 중간 입금 API
  const {
    mutate: storeDeposit,
    isPending: storeDepositLoading,
    isError: storeDepositError,
  } = useStoreOperationControllerDepositCash();

  const isOpened = !!data?.cashHistories.find((value) => value.type === "OPEN");
  const isClosed = !!data?.cashHistories.find(
    (value) => value.type === "CLOSE",
  );

  const depositList = data?.cashHistories.filter(
    (value) => value.type === "DEPOSIT",
  );

  // 매장 오픈
  const handleOpenStore = () => {
    if (!storeId) {
      return alert("매장을 선택해주세요.");
    }

    if (isOpened) {
      return alert("이미 오픈한 매장입니다.");
    }

    if (isClosed) {
      return alert("이미 마감한 매장입니다.");
    }

    if (openingCash === null) {
      return alert("시재금을 입력해주세요.");
    }

    return storeOpen(
      {
        data: {
          storeId,
          amount: openingCash,
        },
      },
      {
        onSuccess: () => {
          dailyRefetch();
          monthlyRefetch();

          return alert("매장을 오픈했습니다.");
        },
        onError: (error: any) => {
          return alert(error.message ?? "매장 오픈 중 오류가 발생했습니다.");
        },
      },
    );
  };

  // 매장 마감
  const handleCloseStore = () => {
    if (!storeId) {
      return alert("매장을 선택해주세요.");
    }

    if (!isOpened) {
      return alert("아직 오픈하지 않은 매장입니다.");
    }

    if (isClosed) {
      return alert("이미 마감한 매장입니다.");
    }

    if (closingCash === null) {
      return alert("시재금을 입력해주세요.");
    }

    if (serviceCount === null) {
      return alert("세차 횟수를 입력해주세요.");
    }

    return storeClose(
      {
        data: {
          storeId,
          amount: closingCash,
          expectedServiceCount: serviceCount,
        },
      },
      {
        onSuccess: () => {
          dailyRefetch();
          monthlyRefetch();

          return alert("매장을 마감했습니다.");
        },
        onError: (error: any) => {
          return alert(error.message ?? "매장 마감 중 오류가 발생했습니다.");
        },
      },
    );
  };

  // 중간 입금
  const handleDepositCash = () => {
    if (!storeId) {
      return alert("매장을 선택해주세요.");
    }

    if (!isOpened) {
      return alert("아직 오픈하지 않은 매장입니다.");
    }

    if (isClosed) {
      return alert("이미 마감한 매장입니다.");
    }

    if (!depositCash) {
      return alert("시재금을 입력해주세요.");
    }

    return storeDeposit(
      {
        data: {
          storeId,
          amount: depositCash,
        },
      },
      {
        onSuccess: () => {
          dailyRefetch();
          monthlyRefetch();
          setDepositCash(null);

          return alert("중간 입금처리가 완료되었습니다.");
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "중간 입금처리 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  useEffect(() => {
    const openCashHistory = data?.cashHistories.find(
      (value) => value.type === "OPEN",
    );

    const closeCashHistory = data?.cashHistories.find(
      (value) => value.type === "CLOSE",
    );

    setOpeningCash(openCashHistory ? openCashHistory.amount : null);
    setClosingCash(closeCashHistory ? closeCashHistory.amount : null);
    setServiceCount(data?.expectedServiceCount ?? null);
  }, [data]);

  return (
    <Callout width={isDesktop ? "284px" : "100%"} height="fit-content">
      <p className="text-[20px] font-semibold">시재관리</p>

      <div className="flex justify-between items-center mt-[8px]">
        <p className="text-[14px]">
          {dayjs().format("YYYY년 MM월 DD일 (ddd)")}
        </p>

        <div
          className={`px-[8px] py-[4px] text-[13px] font-semibold rounded-[20px] ${!isOpened ? "text-main bg-back4" : isClosed ? "text-white bg-gray5" : "text-white bg-main"}`}
        >
          {!isOpened ? "영업 전" : isClosed ? "영업 종료" : "영업 중"}
        </div>
      </div>

      <div className="flex justify-center mt-[24px] p-[16px] gap-[12px] bg-gray1 rounded-[12px]">
        <div className="flex flex-col flex-1 items-center">
          <p className="text-gray5 text-[12px]">오픈 시간</p>
          <p className="mt-[8px] text-[18px] font-semibold">
            {data?.openedAt ? dayjs(data?.openedAt).format("HH:mm:ss") : "-"}
          </p>
        </div>

        <div className="flex flex-col flex-1 items-center">
          <p className="text-gray5 text-[12px]">마감 시간</p>
          <p className="mt-[8px] text-[18px] font-semibold">
            {data?.closedAt ? dayjs(data?.closedAt).format("HH:mm:ss") : "-"}
          </p>
        </div>
      </div>

      {/* 오픈 */}
      <div className="flex flex-col w-full mt-[40px] px-[8px]">
        <p className="text-[16px] font-semibold">오픈</p>

        <div className="flex justify-between items-center w-full mt-[12px] text-[14px]">
          <p className="text-gray7">시재 입력</p>
          <input
            value={openingCash !== null ? openingCash.toLocaleString() : ""}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, "");

              if (!value.trim()) {
                return setOpeningCash(null);
              }

              if (!/^\d+$/.test(value)) return;

              setOpeningCash(Number(value));
            }}
            disabled={isOpened}
            placeholder="금액(원)"
            className={`w-[126px] h-[36px] px-[12px] border border-gray2 rounded-[6px] ${isOpened ? "text-gray5 bg-gray1" : "text-black bg-white"}`}
          />
        </div>

        <CustomButton
          onClick={handleOpenStore}
          disabled={isOpened || storeOpenLoading}
          width="100%"
          height="36px"
          margin="12px 0 0 0"
          backgroundColor={isOpened ? colors.gray1 : colors.main}
          borderWidth="1px"
          borderColor={isOpened ? colors.gray2 : "transparent"}
          cursor={isOpened ? "default" : "pointer"}
        >
          <p
            className={`text-[14px] font-semibold ${isOpened ? "text-gray5" : "text-white"}`}
          >
            확인
          </p>
        </CustomButton>
      </div>

      {/* 마감 */}
      <div className="flex flex-col w-full mt-[24px] pb-[32px] px-[8px] border-b border-b-line">
        <p className="text-[16px] font-semibold">마감</p>

        <div className="flex justify-between items-center w-full mt-[12px] text-[14px]">
          <p className="text-gray7">시재 입력</p>
          <input
            value={closingCash !== null ? closingCash.toLocaleString() : ""}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, "");

              if (!value.trim()) {
                return setClosingCash(null);
              }

              if (!/^\d+$/.test(value)) return;

              setClosingCash(Number(value));
            }}
            disabled={!isOpened || isClosed}
            placeholder="금액(원)"
            className={`w-[126px] h-[36px] px-[12px] border border-gray2 rounded-[6px] ${!isOpened || isClosed ? "text-gray5 bg-gray1" : "text-black bg-white"}`}
          />
        </div>

        <div className="flex justify-between items-center w-full mt-[12px] text-[14px]">
          <p className="text-gray7">세차 횟수</p>
          <input
            value={serviceCount !== null ? serviceCount.toLocaleString() : ""}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, "");

              if (!value.trim()) {
                return setServiceCount(null);
              }

              if (!/^\d+$/.test(value)) return;

              setServiceCount(Number(value));
            }}
            disabled={!isOpened || isClosed}
            placeholder="세차 횟수(회)"
            className={`w-[126px] h-[36px] px-[12px] border border-gray2 rounded-[6px] ${!isOpened || isClosed ? "text-gray5 bg-gray1" : "text-black bg-white"}`}
          />
        </div>

        <CustomButton
          onClick={handleCloseStore}
          disabled={!isOpened || isClosed || storeCloseLoading}
          width="100%"
          height="36px"
          margin="12px 0 0 0"
          backgroundColor={!isOpened || isClosed ? colors.gray1 : colors.main}
          borderWidth="1px"
          borderColor={!isOpened || isClosed ? colors.gray2 : "transparent"}
          cursor={!isOpened || isClosed ? "default" : "pointer"}
        >
          <p
            className={`text-[14px] font-semibold ${!isOpened || isClosed ? "text-gray5" : "text-white"}`}
          >
            확인
          </p>
        </CustomButton>
      </div>

      {/* 중간 입금 */}
      <div className="flex flex-col w-full mt-[24px] px-[8px]">
        <p className="text-[16px] font-semibold">중간 입금</p>

        <div className="flex justify-between items-center w-full mt-[12px] text-[14px]">
          <p className="text-gray7">시재 입력</p>
          <input
            value={depositCash !== null ? depositCash.toLocaleString() : ""}
            onChange={(e) => {
              const value = e.target.value.replace(/,/g, "");

              if (!value.trim()) {
                return setDepositCash(null);
              }

              if (!/^\d+$/.test(value)) return;

              setDepositCash(Number(value));
            }}
            disabled={!isOpened || isClosed}
            placeholder="금액(원)"
            className={`w-[126px] h-[36px] px-[12px] border border-gray2 rounded-[6px] ${!isOpened || isClosed ? "text-gray5 bg-gray1" : "text-black bg-white"}`}
          />
        </div>

        <CustomButton
          onClick={handleDepositCash}
          disabled={!isOpened || isClosed || storeDepositLoading}
          width="100%"
          height="36px"
          margin="12px 0 0 0"
          backgroundColor={!isOpened || isClosed ? colors.gray1 : colors.main}
          borderWidth="1px"
          borderColor={!isOpened || isClosed ? colors.gray2 : "transparent"}
          cursor={!isOpened || isClosed ? "default" : "pointer"}
        >
          <p
            className={`text-[14px] font-semibold ${!isOpened || isClosed ? "text-gray5" : "text-white"}`}
          >
            확인
          </p>
        </CustomButton>

        {depositList && depositList.length > 0 && (
          <div className="flex flex-col w-full mt-[20px] text-[14px]">
            <div className="p-[8px] font-medium border border-line">
              중간 입금 내역
            </div>

            {depositList.map((value, index) => (
              <div className="flex justify-between p-[8px] border-b border-r border-l border-line">
                <p>{dayjs(value.createdAt).format("HH:mm")}</p>
                <p>{value.amount.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Callout>
  );
};

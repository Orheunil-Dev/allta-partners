import { useSalesControllerGetWeeklySalesList } from "@/api/sales/sales";

export const WeeklySales = () => {
  // 주간 매출 목록 조회 API
  const {
    data: weeklySalesData,
    isLoading: weeklySalesLoading,
    isError: weeklySalesError,
  } = useSalesControllerGetWeeklySalesList();

  return (
    <div
      className="flex flex-col flex-[2] min-w-0 h-[358px] mt-[24px] p-[24px] bg-white rounded-[20px]"
      style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
    >
      <p className="text-[18px] font-semibold">주간 매출 순위</p>

      {weeklySalesData && (
        <div className="flex flex-col h-full mt-[20px] pb-[24px]">
          <div className="flex justify-between items-center py-[10px]">
            <p className="text-gray7 text-[16px] font-medium">전체 매출</p>
            <p className="text-[18px] font-semibold">
              {weeklySalesData.data.totalSales.toLocaleString()} 원
            </p>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto">
            {weeklySalesData.data.storeSales.map((value, index) => (
              <div className="flex justify-between items-center text-gray7 text-[14px]">
                <div className="flex items-center py-[12px] gap-x-[8px]">
                  <div className="flex justify-center items-center size-[20px] text-[13px] bg-gray1 rounded-[4px]">
                    {index + 1}
                  </div>
                  <p>{value.storeName}</p>
                </div>

                <p>{value.salesAmount.toLocaleString()}원</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import { GetDailyFuelStockSummaryDetailByIdResponse } from "@/api/models";
import { getFuelTypeColor } from "@/utils";
import { FuelType } from "@/types";
import { Callout } from "../ui/Callout";

interface Props {
  data: GetDailyFuelStockSummaryDetailByIdResponse["data"];
}

export const FuelStockBox = ({ data }: Props) => {
  const fuelMap = {
    GASOLINE: {
      name: "휘발유",
      textColor: getFuelTypeColor("GASOLINE"),
      incomePrice: data.gasolineIncomePrice ?? 0,
      incomeVolume: data.gasolineIncomeVolume ?? 0,
      inventoryPrice: data.gasolineInventoryPrice ?? 0,
      inventoryVolume: data.gasolineInventoryVolume ?? 0,
      prevInventoryVolume: data.gasolinePrevInventoryVolume ?? 0,
    },
    DIESEL: {
      name: "경유",
      textColor: getFuelTypeColor("DIESEL"),
      incomePrice: data.dieselIncomePrice ?? 0,
      incomeVolume: data.dieselIncomeVolume ?? 0,
      inventoryPrice: data.dieselInventoryPrice ?? 0,
      inventoryVolume: data.dieselInventoryVolume ?? 0,
      prevInventoryVolume: data.dieselPrevInventoryVolume ?? 0,
    },
    PREMIUM_GASOLINE: {
      name: "고급유",
      textColor: getFuelTypeColor("PREMIUM"),
      incomePrice: data.premiumIncomePrice ?? 0,
      incomeVolume: data.premiumIncomeVolume ?? 0,
      inventoryPrice: data.premiumInventoryPrice ?? 0,
      inventoryVolume: data.premiumInventoryVolume ?? 0,
      prevInventoryVolume: data.premiumPrevInventoryVolume ?? 0,
    },
  };

  const rows = Object.entries(fuelMap).map(([fuelType, base]) => {
    const sales = data.fuelSales.find((v) => v.fuelType === fuelType);

    const expectedInventoryVolume =
      (base.prevInventoryVolume ?? 0) +
      (base.incomeVolume ?? 0) -
      (sales?.totalVolume ?? 0);

    return {
      ...base,
      salesVolume: sales?.totalVolume ?? 0,
      salesAmount: sales?.totalSales ?? 0,
      expectedInventoryVolume,
    };
  });

  return (
    <Callout margin="32px 0 0 0" padding="24px">
      <div className="flex flex-col w-full">
        <p className="text-[16px] font-semibold">유류 재고 내역</p>

        <div className="w-full mt-[24px]">
          <table className="w-full overflow-hidden text-[14px]">
            <thead>
              <tr className="text-gray5 [&>th]:px-[12px] [&>th]:py-[8px] [&>th]:font-medium">
                <th className="text-left">유종</th>
                <th>입고단가(원/L)</th>
                <th>입고량(L)</th>
                <th>판매량(L)</th>
                <th>전일재고(L)</th>
                <th>예상재고(L)</th>
                <th>실측재고(L)</th>
                <th>재고 단가(원/L)</th>
                <th>매출액(원)</th>
              </tr>
            </thead>

            <tbody>
              {rows?.map((row, idx) => (
                <tr key={idx} className="border-t border-line text-center">
                  <td
                    className="p-[12px] text-left font-medium"
                    style={{ color: row.textColor }}
                  >
                    {row.name}
                  </td>
                  <td>{row.incomePrice.toLocaleString()}</td>
                  <td>{row.incomeVolume.toLocaleString()}</td>
                  <td>{row.salesVolume.toLocaleString()}</td>
                  <td>{row.prevInventoryVolume.toLocaleString()}</td>
                  <td>{row.expectedInventoryVolume.toLocaleString()}</td>
                  <td>{row.inventoryVolume.toLocaleString()}</td>
                  <td>{row.inventoryPrice.toLocaleString()}</td>
                  <td className="font-semibold">
                    {row.salesAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-line bg-gray1 text-center">
                <td className="p-[12px] text-left font-medium">합계</td>
                <td>-</td>
                <td>
                  {rows
                    ?.reduce((sum, r) => sum + (r.incomeVolume ?? 0), 0)
                    .toLocaleString()}
                </td>
                <td>
                  {rows
                    ?.reduce((sum, r) => sum + r.salesVolume, 0)
                    .toLocaleString()}
                </td>
                <td>
                  {rows
                    ?.reduce((sum, r) => sum + (r.prevInventoryVolume ?? 0), 0)
                    .toLocaleString()}
                </td>
                <td>
                  {rows
                    ?.reduce((sum, r) => sum + r.expectedInventoryVolume, 0)
                    .toLocaleString()}
                </td>
                <td>
                  {rows
                    ?.reduce((sum, r) => sum + (r.inventoryVolume ?? 0), 0)
                    .toLocaleString()}
                </td>
                <td>-</td>
                <td className="font-semibold">
                  {rows
                    ?.reduce((sum, r) => sum + r.salesAmount, 0)
                    .toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Callout>
  );
};

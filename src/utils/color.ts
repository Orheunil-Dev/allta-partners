import { colors } from "@/styles";

// 유종별 색상
export const getFuelTypeColor = (fuelType: string) => {
  switch (fuelType) {
    case "GASOLINE":
      return "#EB8723";

    case "DIESEL":
      return "#3B67D7";

    case "PREMIUM":
      return "#4CD168";

    case "PREMIUM_GASOLINE":
      return "#4CD168";

    default:
      return colors.gray5;
  }
};

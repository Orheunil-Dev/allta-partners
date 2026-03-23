export const normalizeWeather = (value: string | null) => {
  if (!value) return null;

  if (value.includes("Mixed")) return "Mixed";

  const hasRain = value.includes("Rain");
  const hasSnow = value.includes("Snow");
  const hasIce = value.includes("Ice");

  if (hasSnow && hasRain) return "Mixed";
  if (hasSnow && hasIce) return "Snow";
  if (hasSnow) return "Snow";
  if (hasRain) return "Rain";
  if (hasIce) return "Snow";

  return null;
};

// 오늘 기준 N일 전 날짜 계산
export const getDateBeforeDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date.toISOString().slice(0, 10); // YYYY-MM-DD
};

// 퍼센트 계산
export const getPercent = (numerator: number, denominator: number) => {
  return (numerator / denominator) * 100;
};

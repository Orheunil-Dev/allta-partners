import { getPercent } from "@/utils";
import { colors } from "@/styles";

interface Props {
  numerator: number; // 분자
  denominator: number; // 분모
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  trackColor?: React.CSSProperties["backgroundColor"];
  trackBorderRadius?: React.CSSProperties["borderRadius"];
  progressColor?: React.CSSProperties["backgroundColor"];
  progressBorderRadius?: React.CSSProperties["borderRadius"];
  margin?: React.CSSProperties["margin"];
}

export const ProgressBar = ({
  numerator,
  denominator,
  width = "100%",
  height = "10px",
  trackColor = colors.gray2,
  trackBorderRadius = "12px",
  progressColor = colors.main,
  progressBorderRadius = "12px",
  margin,
}: Props) => {
  return (
    <div
      className="relative flex items-center overflow-hidden"
      style={{
        width,
        height,
        margin,
        backgroundColor: trackColor,
        borderRadius: trackBorderRadius,
      }}
    >
      <div
        className="absolute"
        style={{
          width: `${getPercent(numerator, denominator)}%`,
          height,
          backgroundColor: progressColor,
          borderRadius: progressBorderRadius,
        }}
      />
    </div>
  );
};

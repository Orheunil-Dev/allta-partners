import { colors } from "@/styles";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  display?: React.CSSProperties["display"];
  alignSelf?: React.CSSProperties["alignSelf"];
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
  margin?: React.CSSProperties["margin"];
  color?: React.CSSProperties["color"];
  fontSize?: React.CSSProperties["fontSize"];
  fontWeight?: React.CSSProperties["fontWeight"];
  backgroundColor?: React.CSSProperties["backgroundColor"];
  borderWidth?: React.CSSProperties["borderWidth"];
  borderColor?: React.CSSProperties["borderColor"];
  borderRadius?: React.CSSProperties["borderRadius"];
  cursor?: React.CSSProperties["cursor"];
  disabled?: boolean;
}

export const CustomButton = ({
  children,
  onClick,
  display,
  alignSelf,
  width = "56px",
  height = "38px",
  margin,
  color = colors.black,
  fontSize = "14px",
  fontWeight = "600",
  backgroundColor = colors.white,
  borderWidth,
  borderColor,
  borderRadius = "8px",
  cursor = "pointer",
  disabled,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display,
        alignSelf,
        flexShrink: 0,
        width,
        height,
        margin,
        color,
        fontSize,
        fontWeight,
        backgroundColor,
        borderWidth,
        borderColor,
        borderRadius,
        cursor,
      }}
    >
      {children}
    </button>
  );
};

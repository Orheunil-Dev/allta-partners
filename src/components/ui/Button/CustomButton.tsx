import { colors } from "@/styles";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
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
  disabled?: boolean;
}

export const CustomButton = ({
  children,
  onClick,
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
  disabled,
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
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
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
};

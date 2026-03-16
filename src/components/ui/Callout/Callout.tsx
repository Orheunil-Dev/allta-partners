import { CSSProperties, ReactNode } from "react";
import { colors } from "@/styles";

interface Props {
  position?: CSSProperties["position"];
  flexDirection?: CSSProperties["flexDirection"];
  flex?: CSSProperties["flex"];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  gap?: CSSProperties["gap"];
  backgroundColor?: CSSProperties["backgroundColor"];
  borderRadius?: CSSProperties["borderRadius"];
  isShadow?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const Callout = ({
  position,
  flexDirection = "column",
  flex,
  justifyContent,
  alignItems,
  width,
  height,
  margin,
  padding = "20px",
  gap,
  backgroundColor = colors.white,
  borderRadius = "16px",
  isShadow = true,
  onClick,
  children,
}: Props) => {
  return (
    <div
      className="relative flex w-full"
      onClick={onClick}
      style={{
        position,
        flexDirection,
        flex,
        justifyContent,
        alignItems,
        width,
        height,
        margin,
        padding,
        gap,
        backgroundColor,
        borderRadius,
        boxShadow: isShadow
          ? "0 4px 10px 2px rgba(28, 28, 44, 0.04)"
          : undefined,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

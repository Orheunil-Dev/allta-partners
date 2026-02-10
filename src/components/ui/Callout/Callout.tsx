import { CSSProperties, ReactNode } from "react";

interface Props {
  position?: CSSProperties["position"];
  flexDirection?: CSSProperties["flexDirection"];
  flex?: CSSProperties["flex"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  gap?: CSSProperties["gap"];
  borderRadius?: CSSProperties["borderRadius"];
  onClick?: () => void;
  children: ReactNode;
}

export const Callout = ({
  position,
  flexDirection = "column",
  flex,
  margin,
  padding = "20px",
  gap,
  borderRadius = "16px",
  onClick,
  children,
}: Props) => {
  return (
    <div
      className="relative flex w-full bg-white"
      onClick={onClick}
      style={{
        position,
        flexDirection,
        flex,
        margin,
        padding,
        gap,
        borderRadius,
        boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
};

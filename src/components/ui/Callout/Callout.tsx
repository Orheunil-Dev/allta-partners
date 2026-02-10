import { CSSProperties, ReactNode } from "react";

interface Props {
  position?: CSSProperties["position"];
  flexDirection?: CSSProperties["flexDirection"];
  flex?: CSSProperties["flex"];
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  borderRadius?: CSSProperties["borderRadius"];
  children: ReactNode;
}

export const Callout = ({
  position,
  flexDirection = "column",
  flex,
  margin,
  padding = "20px",
  borderRadius = "16px",
  children,
}: Props) => {
  return (
    <div
      className="relative flex w-full bg-white"
      style={{
        position,
        flexDirection,
        flex,
        margin,
        padding,
        borderRadius,
        boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)",
      }}
    >
      {children}
    </div>
  );
};

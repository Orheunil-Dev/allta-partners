import React from "react";

interface Props {
  children: React.ReactNode;
  visible: boolean;
  onClose: () => void;
  width?: string;
  padding?: string;
}

export const CustomModal = ({
  children,
  visible,
  onClose,
  width,
  padding,
}: Props) => {
  if (!visible) return;

  return (
    <div
      onClick={onClose}
      className="fixed flex top-0 left-0 justify-center items-center w-screen h-screen bg-black/40 z-[99] cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-center items-center bg-white rounded-[20px] cursor-default"
        style={{
          width,
          padding,
        }}
      >
        {children}
      </div>
    </div>
  );
};

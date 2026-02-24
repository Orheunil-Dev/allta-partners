import Image from "next/image";
import { CustomButton } from "@/components/ui/Button";
import { lockIcon } from "../../../../public/images";
import { colors } from "@/styles";

interface Props {
  title?: string;
  content?: string;
  buttonText?: string;
  onClick?: () => void;
}

export const LockedContent = ({
  title,
  content,
  buttonText,
  onClick,
}: Props) => {
  return (
    <div className="absolute flex flex-col justify-center items-center w-full h-full top-0 right-0 text-center bg-white/70 backdrop-blur-[3px] rounded-[20px] z-[1]">
      <div className="flex justify-center items-center size-[40px] bg-gray1 rounded-full">
        <Image
          src={lockIcon}
          alt={title ?? "이용 제한"}
          className="size-[20px]"
        />
      </div>

      <p className="mt-[8px] text-[16px] font-semibold">{title}</p>
      <p className="mt-[4px] text-gray7 text-[14px] whitespace-pre-line">
        {content}
      </p>

      {onClick && (
        <CustomButton
          onClick={onClick}
          width="130px"
          margin="24px 0 0 0"
          backgroundColor={colors.main}
        >
          <p className="text-white text-[14px] font-medium">{buttonText}</p>
        </CustomButton>
      )}
    </div>
  );
};

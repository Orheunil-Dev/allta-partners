import { useState } from "react";
import Image from "next/image";
import { useStaffControllerRegisterStaff } from "@/api/staff/staff";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import { closeIcon } from "../../../public/images";
import { colors } from "@/styles";
import { formatPhoneNumber } from "@/utils";

interface Props {
  visible: boolean;
  storeId: string;
  onClose: () => void;
  refetch: () => void;
}

export const StaffRegisterModal = ({
  visible,
  storeId,
  onClose,
  refetch,
}: Props) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // 직원 등록 API
  const {
    mutate: registerStaff,
    isPending: registerStaffLoading,
    isError: registerStaffError,
  } = useStaffControllerRegisterStaff();

  const handleSubmit = () => {
    registerStaff(
      {
        data: {
          storeId,
          phoneNumber,
        },
      },
      {
        onSuccess: () => {
          refetch();
          alert("직원 등록이 완료되었습니다.");
          return onClose();
        },
        onError: (error: any) => {
          return alert(error.message ?? "직원 등록 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <div className="flex flex-col items-center w-[380px] p-[24px]">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">직원 등록</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[24px]" />
          </button>
        </div>

        <div className="flex items-center mt-[32px] gap-[20px]">
          <p className="text-[14px] font-semibold">전화번호</p>
          <input
            value={phoneNumber}
            maxLength={13}
            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
            placeholder="전화번호 입력"
            className="w-[160px] h-[36px] px-[12px] text-[14px] border border-gray2 rounded-[6px]"
          />
        </div>

        <div className="flex gap-[12px] mt-[32px]">
          <CustomButton
            onClick={onClose}
            borderWidth="1px"
            borderColor={colors.gray2}
          >
            <p className="text-gray5 text-[14px] font-semibold">취소</p>
          </CustomButton>

          <CustomButton
            onClick={handleSubmit}
            disabled={registerStaffLoading}
            backgroundColor={colors.main}
          >
            <p className="text-white text-[14px] font-semibold">등록</p>
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

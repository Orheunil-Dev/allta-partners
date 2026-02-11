import Image from "next/image";
import { useStaffControllerDisconnectStaff } from "@/api/staff/staff";
import { CustomModal } from "../ui/Modal";
import { closeIcon } from "../../../public/images";
import { CustomButton } from "../ui/Button";
import { colors } from "@/styles";

interface Props {
  staffId: string | null;
  storeId: string;
  onClose: () => void;
  refetch: () => void;
}

export const StaffDisconnectModal = ({
  staffId,
  storeId,
  onClose,
  refetch,
}: Props) => {
  if (!staffId) return;

  // 직원 삭제 API
  const {
    mutate: disconnectStaff,
    isPending: disconnectStaffLoading,
    isError: disconnectStaffError,
  } = useStaffControllerDisconnectStaff();

  const handleDisconnect = () => {
    if (!staffId) {
      return alert("쿠나 계정이 조회되지 않습니다.");
    }

    disconnectStaff(
      {
        data: {
          staffId,
          storeId,
        },
      },
      {
        onSuccess: () => {
          refetch();
          alert("직원 삭제가 완료되었습니다.");
          return onClose();
        },
        onError: (error: any) => {
          return alert(error.message ?? "직원 삭제 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <CustomModal visible={!!staffId} onClose={onClose}>
      <div className="flex flex-col items-center w-[380px] p-[24px]">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">직원 삭제</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[24px]" />
          </button>
        </div>

        <p className="mt-[32px] text-[18px] font-semibold">
          선택한 직원을 삭제하시겠습니까?
        </p>
        <p className="mt-[4px] text-[14px]">삭제 후 다시 등록할 수 있습니다.</p>

        <div className="flex gap-[12px] mt-[32px]">
          <CustomButton
            onClick={onClose}
            borderWidth="1px"
            borderColor={colors.gray2}
          >
            <p className="text-gray5 text-[14px] font-semibold">취소</p>
          </CustomButton>

          <CustomButton
            onClick={handleDisconnect}
            disabled={disconnectStaffLoading}
            backgroundColor={colors.main}
          >
            <p className="text-white text-[14px] font-semibold">삭제</p>
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

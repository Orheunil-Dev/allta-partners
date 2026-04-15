import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useCarControllerDeleteStoreCar } from "@/api/car/car";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import { closeIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  id?: string;
  onClose: () => void;
}

export const CarDeleteModal = ({ id, onClose }: Props) => {
  if (!id) return;

  const queryClient = useQueryClient();

  // 차량 삭제 API
  const {
    mutate: deleteCar,
    isPending: registerCarLoading,
    isError: registerCarError,
  } = useCarControllerDeleteStoreCar();

  const handleDelete = () => {
    if (!id) return;

    deleteCar(
      {
        id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          alert("차량 삭제가 완료되었습니다.");
          return onClose();
        },
        onError: (error: any) => {
          alert(error.message ?? "차량 삭제 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <CustomModal visible={!!id} onClose={onClose} width="380px" padding="24px">
      <div className="flex justify-between items-center w-full">
        <p className="text-[20px] font-semibold">차량 삭제</p>

        <button onClick={onClose} className="cursor-pointer">
          <Image src={closeIcon} alt="닫기" className="size-[24px]" />
        </button>
      </div>

      <p className="mt-[32px] text-[18px] font-semibold">
        선택한 차량을 삭제하시겠습니까?
      </p>
      <p className="mt-[4px] text-[14px]">필요 시 다시 추가할 수 있습니다.</p>

      <div className="flex mt-[32px] gap-[12px]">
        <CustomButton
          onClick={onClose}
          borderWidth="1px"
          borderColor={colors.line}
        >
          <p className="text-gray5 text-[14px] font-semibold">취소</p>
        </CustomButton>

        <CustomButton onClick={handleDelete} backgroundColor={colors.main}>
          <p className="text-white text-[14px] font-semibold">삭제</p>
        </CustomButton>
      </div>
    </CustomModal>
  );
};

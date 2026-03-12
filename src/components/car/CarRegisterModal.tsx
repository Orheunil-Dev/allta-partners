import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useCarControllerRegisterStoreCar } from "@/api/car/car";
import { RegisterStoreCarRequest } from "@/api/models";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import { closeIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const CarRegisterModal = ({ visible, onClose }: Props) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<RegisterStoreCarRequest>({
    carNumber: "",
    memo: "",
  });

  // 차량 등록 API
  const {
    mutate: registerCar,
    isPending: registerCarLoading,
    isError: registerCarError,
  } = useCarControllerRegisterStoreCar();

  const handleChange =
    (key: keyof RegisterStoreCarRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };

  const handleRegister = () => {
    if (!form.carNumber.length) {
      return alert("차량번호를 입력해주세요.");
    }

    if (!form.memo.length) {
      return alert("메모를 입력해주세요.");
    }

    registerCar(
      {
        data: form,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["cars"] });
          alert("차량 등록이 완료되었습니다.");
          return onClose();
        },
        onError: (error: any) => {
          alert(error.message ?? "차량 등록 중 오류가 발생했습니다.");
        },
      },
    );
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      width="380px"
      padding="24px"
    >
      <div className="flex justify-between items-center w-full">
        <p className="text-[20px] font-semibold">차량 등록</p>

        <button onClick={onClose} className="cursor-pointer">
          <Image src={closeIcon} alt="닫기" className="size-[24px]" />
        </button>
      </div>

      <div className="flex justify-between items-center w-full mt-[32px] px-[24px] gap-x-[24px]">
        <p className="text-[14px] font-semibold">차량번호</p>
        <input
          value={form.carNumber}
          onChange={handleChange("carNumber")}
          maxLength={10}
          placeholder="차량번호 입력"
          className="w-[180px] px-[12px] py-[6px] text-[14px] border border-line rounded-[6px]"
        />
      </div>

      <div className="flex justify-between items-center w-full mt-[20px] px-[24px] gap-x-[24px]">
        <p className="text-[14px] font-semibold">메모</p>
        <input
          value={form.memo}
          onChange={handleChange("memo")}
          maxLength={20}
          placeholder="메모 입력"
          className="w-[180px] px-[12px] py-[6px] text-[14px] border border-line rounded-[6px]"
        />
      </div>

      <div className="flex mt-[32px] gap-[12px]">
        <CustomButton
          onClick={onClose}
          borderWidth="1px"
          borderColor={colors.line}
        >
          <p className="text-gray5 text-[14px] font-semibold">취소</p>
        </CustomButton>

        <CustomButton onClick={handleRegister} backgroundColor={colors.main}>
          <p className="text-white text-[14px] font-semibold">등록</p>
        </CustomButton>
      </div>
    </CustomModal>
  );
};

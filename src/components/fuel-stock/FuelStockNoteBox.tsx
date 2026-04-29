import { useEffect, useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useFuelStockControllerUpdateDailyFuelSummaryNote } from "@/api/fuel-stock/fuel-stock";
import {
  GetDailyFuelStockSummaryDetailByIdResponse,
  UpdateDailyFuelSummaryNoteRequest,
} from "@/api/models";
import { CustomButton } from "../ui/Button";
import { editIcon } from "../../../public/images";
import { colors } from "@/styles";

interface Props {
  data: GetDailyFuelStockSummaryDetailByIdResponse["data"];
  isToday: boolean;
}

export const FuelStockNoteBox = ({ data, isToday }: Props) => {
  const queryClient = useQueryClient();

  const initialData: UpdateDailyFuelSummaryNoteRequest = {
    id: data.id,
    note: data.note,
  };

  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [form, setForm] =
    useState<UpdateDailyFuelSummaryNoteRequest>(initialData);

  // 실측 재고 수정 API
  const {
    mutate: updateNote,
    isPending: updateNoteLoading,
    isError: updateNoteError,
  } = useFuelStockControllerUpdateDailyFuelSummaryNote();

  const handleChange =
    (key: keyof UpdateDailyFuelSummaryNoteRequest) =>
    (value: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = typeof value === "object" ? value.target.value : value;

      setForm((prev) => ({
        ...prev,
        [key]: v,
      }));
    };

  const handleCancel = () => {
    return setShowEdit(false);
  };

  const handleSubmit = () => {
    if (form === initialData) {
      return alert("변경된 내용이 없습니다.");
    }

    updateNote(
      {
        data: form,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["dailFuelStockSummaryDetail"],
          });

          setShowEdit(false);

          return alert("메모가 수정되었습니다.");
        },
        onError: (error: any) => {
          return alert(error.message ?? "메모 수정 중 오류가 발생했습니다.");
        },
      },
    );
  };

  useEffect(() => {
    setForm(initialData);
  }, [showEdit]);

  return (
    <div className="flex flex-col border border-line rounded-[12px] overflow-hidden">
      <div className="flex justify-between items-center p-[12px] bg-gray1">
        <p className="font-semibold">비고</p>

        {isToday && (
          <button
            onClick={() => setShowEdit(!showEdit)}
            className="cursor-pointer"
          >
            <Image src={editIcon} alt="수정" className="size-[20px]" />
          </button>
        )}
      </div>

      <textarea
        value={form.note ?? ""}
        onChange={handleChange("note")}
        disabled={!showEdit}
        placeholder="메모를 입력하세요"
        className="w-full h-[120px] p-[20px] rounded-b-[12px] overflow-y-auto resize-none outline-none focus:outline-none"
      />

      {showEdit && (
        <div className="flex justify-end items-center mt-[12px] mb-[20px] mr-[20px] gap-x-[12px]">
          <CustomButton
            onClick={handleCancel}
            width="40px"
            height="28px"
            backgroundColor={colors.white}
            color={colors.gray5}
            fontSize="13px"
            borderWidth="1px"
            borderColor={colors.gray2}
          >
            취소
          </CustomButton>

          <CustomButton
            onClick={handleSubmit}
            width="40px"
            height="28px"
            backgroundColor={colors.main}
            color={colors.white}
            fontSize="13px"
          >
            저장
          </CustomButton>
        </div>
      )}
    </div>
  );
};

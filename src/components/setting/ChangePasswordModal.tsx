import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import * as z from "zod";
import { useAdminControllerChangeStoreAdminPassword } from "@/api/admin/admin";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";
import { ChangeStoreAdminPasswordRequest } from "@/api/models";
import { regexPassword } from "@/utils";
import { CustomModal } from "../ui/Modal";
import { CustomButton } from "../ui/Button";
import {
  closeIcon,
  hidePasswordIcon,
  showPasswordIcon,
} from "../../../public/images";
import { colors } from "@/styles";

const schema = z
  .object({
    password: z
      .string()
      .min(1, "현재 비밀번호를 입력해주세요.")
      .max(20, "비밀번호는 20자 이하로 입력해주세요."),
    newPassword: z
      .string()
      .min(1, "새 비밀번호를 입력해주세요.")
      .max(20, "비밀번호는 20자 이하로 입력해주세요.")
      .regex(
        regexPassword,
        "비밀번호는 영문+숫자 조합의 8~20자 이내로 입력해주세요.",
      ),
    confirmPassword: z
      .string()
      .min(1, "확인 비밀번호를 입력해주세요.")
      .max(20, "비밀번호는 20자 이하로 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({ visible, onClose }: Props) => {
  const router = useRouter();

  const [form, setForm] = useState<ChangeStoreAdminPasswordRequest>({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 변경 API
  const {
    mutate: changePassword,
    isPending: changePasswordLoading,
    isError: changePasswordError,
  } = useAdminControllerChangeStoreAdminPassword();

  // 로그아웃 API
  const {
    mutate: logout,
    isPending: logoutLoading,
    isError: logoutError,
  } = useAuthControllerPartnersAdminlogout();

  const handleChange = (
    key: keyof ChangeStoreAdminPasswordRequest,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const verify = schema.safeParse(form);

    if (!verify.success) {
      const errorMessage = verify.error.issues[0]?.message;
      return alert(errorMessage);
    }

    changePassword(
      { data: form },
      {
        onSuccess: () => {
          alert("비밀번호가 변경되었습니다.\n다시 로그인해주세요.");

          logout(undefined, {
            onSuccess: () => {
              router.push("/login");
            },
          });
        },
        onError: (error: any) => {
          return alert(
            error.message ?? "비밀번호 변경 중 오류가 발생했습니다.",
          );
        },
      },
    );
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <div className="flex flex-col items-center w-[448px] p-[24px]">
        <div className="flex justify-between items-center w-full">
          <p className="text-[20px] font-semibold">비밀번호 변경</p>

          <button onClick={onClose} className="cursor-pointer">
            <Image src={closeIcon} alt="닫기" className="size-[24px]" />
          </button>
        </div>

        <div className="grid grid-cols-[80px_1fr] items-center w-full mt-[32px] px-[48px] gap-x-[20px] gap-y-[20px]">
          {/* 현재 비밀번호 */}
          <p className="text-[14px] font-semibold">현재 비밀번호</p>

          <div className="relative flex items-center w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => {
                handleChange("password", e.target.value);
              }}
              placeholder="현재 비밀번호 입력"
              className="w-full h-[36px] pl-[12px] pr-[40px] text-[14px] border border-gray2 rounded-[6px]"
            />

            {form.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[12px] cursor-pointer"
              >
                <Image
                  src={showPassword ? showPasswordIcon : hidePasswordIcon}
                  alt="현재 비밀번호"
                  className="size-[20px]"
                />
              </button>
            )}
          </div>

          {/* 새 비밀번호 */}
          <p className="text-[14px] font-semibold">새 비밀번호</p>

          <div className="relative flex items-center w-full">
            <input
              type={showNewPassword ? "text" : "password"}
              value={form.newPassword}
              onChange={(e) => {
                handleChange("newPassword", e.target.value);
              }}
              placeholder="새 비밀번호 입력"
              className="w-full h-[36px] pl-[12px] pr-[40px] text-[14px] border border-gray2 rounded-[6px]"
            />

            {form.newPassword.length > 0 && (
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-[12px] cursor-pointer"
              >
                <Image
                  src={showNewPassword ? showPasswordIcon : hidePasswordIcon}
                  alt="새 비밀번호"
                  className="size-[20px]"
                />
              </button>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <p className="text-[14px] font-semibold">비밀번호 확인</p>

          <div className="relative flex items-center w-full">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={(e) => {
                handleChange("confirmPassword", e.target.value);
              }}
              placeholder="비밀번호 확인 입력"
              className="w-full h-[36px] pl-[12px] pr-[40px] text-[14px] border border-gray2 rounded-[6px]"
            />

            {form.confirmPassword.length > 0 && (
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-[12px] cursor-pointer"
              >
                <Image
                  src={
                    showConfirmPassword ? showPasswordIcon : hidePasswordIcon
                  }
                  alt="비밀번호 확인"
                  className="size-[20px]"
                />
              </button>
            )}
          </div>
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
            disabled={changePasswordLoading}
            backgroundColor={colors.main}
          >
            <p className="text-white text-[14px] font-semibold">변경</p>
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

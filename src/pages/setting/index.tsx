import { useRouter } from "next/router";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";
import { Callout } from "@/components/ui/Callout";
import { useState } from "react";
import { ChangePasswordModal } from "@/components/setting";
import Image from "next/image";
import { logoutIcon } from "../../../public/images";

export default function Setting() {
  const router = useRouter();

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  // 로그아웃 API
  const {
    mutate: logout,
    isPending: logoutLoading,
    isError: logoutError,
  } = useAuthControllerPartnersAdminlogout();

  // 로그아웃
  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <>
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <div className="flex flex-col w-full px-[20px] md:px-[40px] lg:px-[80px] py-[40px]">
        <Callout padding="24px">
          <div className="flex flex-col w-full items-start">
            <p className="font-semibold">설정</p>

            <div className="flex flex-col w-full mt-[32px] gap-[20px]">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex w-full p-[20px] border border-line rounded-[12px] cursor-pointer"
              >
                <p className="text-[16px] font-medium">관리자 비밀번호 변경</p>
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full p-[20px] border border-line rounded-[12px] cursor-pointer"
              >
                <Image
                  src={logoutIcon}
                  alt="로그아웃"
                  className="size-[20px] mr-[6px]"
                />
                <p className="text-[16px] font-medium">로그아웃</p>
              </button>
            </div>
          </div>
        </Callout>
      </div>
    </>
  );
}

import { useRouter } from "next/router";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";
import { useSessionStore } from "@/hooks";
import { Callout } from "@/components/ui/Callout";

export default function Setting() {
  const router = useRouter();

  const { store, setStore } = useSessionStore();

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
    <div className="flex flex-col w-full px-[120px] py-[40px]">
      <Callout>
        <div className="flex flex-col w-full items-start">
          <p>설정</p>
          <button>관리자 비밀번호 변경</button>
          <button>로그아웃</button>
        </div>
      </Callout>
    </div>
  );
}

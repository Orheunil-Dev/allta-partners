import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import { AdminCookie } from "@/types";
import { MenuItem, menuItems } from "@/constants";
import {
  blackCloseIcon,
  logoutIcon,
  sidebarLogo,
} from "../../../../public/images";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const MobileSidebar = ({ isOpen, setIsOpen }: Props) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const cookie = Cookies.get("ptAdmin");

  const [admin, setAdmin] = useState<AdminCookie | null>(null);

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

  const hasPermission = (
    level: number,
    minLevel?: number,
    maxLevel?: number,
  ) => {
    if (minLevel !== undefined && level < minLevel) return false;
    if (maxLevel !== undefined && level > maxLevel) return false;
    return true;
  };

  const groupedMenu = menuItems.reduce<Record<string, MenuItem[]>>(
    (acc, item) => {
      const key = item.category ?? "__root__";

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);
      return acc;
    },
    {},
  );

  const handleRouteDashboard = () => {
    router.push("/dashboard");
  };

  const handleRoutePage = (value?: string) => () => {
    if (!value) return;

    setIsOpen(false);
    return router.push(value);
  };

  useEffect(() => {
    setAdmin(cookie ? JSON.parse(cookie) : null);
  }, [cookie]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 transition-opacity duration-300 cursor-pointer z-[10] ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} `}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed w-[280px]  top-0 h-screen bg-white transition-all duration-300 overflow-hidden z-[20] ${isOpen ? "right-0" : "right-[-280px]"} `}
      >
        <div className="flex flex-col h-full px-[20px]">
          {/* 로고 */}
          <div className="flex flex-shrink-0 justify-between items-center py-[18px]">
            <div
              onClick={handleRouteDashboard}
              className="ml-[10px] cursor-pointer"
            >
              <Image
                src={sidebarLogo}
                alt="올타"
                className="w-[100px] h-[28px]"
              />
            </div>

            <button onClick={() => setIsOpen(false)}>
              <Image src={blackCloseIcon} alt="닫기" className="size-[24px]" />
            </button>
          </div>

          {/* 계정 정보 */}
          <div className="flex flex-col pt-[20px] pb-[16px] border-b border-line">
            <p className="text-[20px] font-semibold">{admin?.storeName}</p>
            <p className="mt-[4px] text-gray5 text-[14px]">{admin?.identity}</p>

            <div className="flex justify-between items-center mt-[20px] py-[8px]">
              <p className="text-[14px]">구독 정보</p>
              <div className="px-[8px] py-[2.5px] text-main text-[12px] bg-back4 rounded-[6px]">
                BASIC
              </div>
            </div>
          </div>

          {/* 메뉴 */}
          <div className="flex flex-col flex-1 mt-[24px] pb-[40px] gap-y-[12px] text-gray7 text-[14px] font-semibold overflow-y-auto">
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} className="flex flex-col gap-y-[4px]">
                {/* 카테고리 */}
                {category !== "__root__" && (
                  <p className="flex items-center px-[12px] pt-[12px] pb-[6px]">
                    <p className="text-gray4 text-[16px] font-semibold">
                      {category}
                    </p>
                  </p>
                )}

                {/* 메뉴 */}
                {items
                  .filter((item) =>
                    hasPermission(
                      admin?.level ?? 0,
                      item.minLevel,
                      item.maxLevel,
                    ),
                  )
                  .map((item) => {
                    const isActive =
                      item.route && currentPath.startsWith(item.route);

                    return (
                      <button
                        key={item.name}
                        onClick={handleRoutePage(item.route)}
                        className={`flex items-center w-full px-[12px] h-[46px] text-[16px] rounded-[12px]
                          ${
                            isActive
                              ? "bg-back4 text-point2"
                              : "bg-transparent text-gray7 hover:bg-back4/50"
                          }
                          ${item.route ? "cursor-pointer" : "cursor-default"}
                        `}
                      >
                        <Image
                          src={isActive ? item.activeIcon! : item.inactiveIcon!}
                          alt={item.name}
                          className="w-[20px] h-[20px] mr-[10px]"
                        />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
              </div>
            ))}

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-[12px] h-[46px] mt-[20px]"
            >
              <Image
                src={logoutIcon}
                alt="로그아웃"
                className="w-[20px] h-[20px] mr-[10px]"
              />
              <span className="text-[16px]">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

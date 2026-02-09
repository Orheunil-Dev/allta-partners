import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";
import { useResizeHandler } from "@/hooks";
import { AdminCookie } from "@/types";
import { menuItems } from "@/constants";
import { dropdownArrowIcon, hamburgerIcon } from "../../../../public/images";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const BreadCrumb = ({ isOpen, setIsOpen }: Props) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const cookie = Cookies.get("ptAdmin");

  const [breadcrumb, setBreadcrumb] = useState<string[] | null>(null);
  const [isMouseEnter, setIsMouseEnter] = useState<boolean>(false);
  const [admin, setAdmin] = useState<AdminCookie | null>(null);

  const { isMobile } = useResizeHandler();

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

  useEffect(() => {
    const findBreadcrumb = () => {
      for (const item of menuItems) {
        if (item.route && currentPath.startsWith(item.route)) {
          const restPath = currentPath.replace(item.route, "");

          if (!restPath || restPath === "/") {
            return [item.name];
          } else if (restPath.includes("/register")) {
            return [item.name, "등록"];
          } else {
            return [item.name, "상세"];
          }
        }

        // if (item.menus) {
        //   for (const menu of item.menus) {
        //     if (currentPath.startsWith(menu.route)) {
        //       const restPath = currentPath.replace(menu.route, "");

        //       if (!restPath || restPath === "/") {
        //         return [item.category, menu.name];
        //       } else if (restPath.includes("/register")) {
        //         return [item.category, menu.name, "등록"];
        //       } else {
        //         return [item.category, menu.name, "상세"];
        //       }
        //     }
        //   }
        // }
      }

      return [""];
    };

    const breadcrumbData = findBreadcrumb();

    setBreadcrumb(breadcrumbData);
  }, [router.pathname]);

  useEffect(() => {
    setAdmin(cookie ? JSON.parse(cookie) : null);
  }, [cookie]);

  return (
    <div className="fixed flex items-center w-full md:w-[calc(100vw-260px)] h-[60px] md:h-[80px] top-0 px-[20px] md:px-[44px] bg-white border-b border-gray2 z-[3]">
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex">
          {breadcrumb?.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <div className="mx-[10px]">/</div>}

              <span className="text-[20px] md:text-[22px] font-semibold">
                {item}
              </span>
            </div>
          ))}
        </div>

        {isMobile ? (
          <button onClick={() => setIsOpen(true)} className="cursor-pointer">
            <Image src={hamburgerIcon} alt="메뉴" className="size-[28px]" />
          </button>
        ) : (
          <div className="relative flex h-full">
            <div
              onMouseEnter={() => setIsMouseEnter(true)}
              onMouseLeave={() => setIsMouseEnter(false)}
              className="flex items-center cursor-pointer h-full"
            >
              <span>{admin?.storeName}</span>
              <Image
                src={dropdownArrowIcon}
                alt="프로필 메뉴"
                className="w-[24px] h-[24px] ml-[4px]"
              />
            </div>

            {isMouseEnter && (
              <div
                onMouseEnter={() => setIsMouseEnter(true)}
                onMouseLeave={() => setIsMouseEnter(false)}
                style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
                className="absolute flex flex-col w-[180px] md:w-[264px] top-[50px] right-0 bg-white rounded-[20px]"
              >
                <div className="flex flex-col px-[20px] py-[16px]">
                  <div
                    onClick={handleLogout}
                    className="w-fit text-[14px] md:text-[16px] cursor-pointer"
                  >
                    로그아웃
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

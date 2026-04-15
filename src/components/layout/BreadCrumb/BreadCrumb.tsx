import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAdminControllerGetStoreAdminProfile } from "@/api/admin/admin";
import { useAuthControllerPartnersAdminlogout } from "@/api/auth/auth";
import { useResizeHandler } from "@/hooks";
import { menuItems } from "@/constants";
import { dropdownArrowIcon, hamburgerIcon } from "../../../../public/images";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const BreadCrumb = ({ isOpen, setIsOpen }: Props) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const [breadcrumb, setBreadcrumb] = useState<string[] | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const { isMobile } = useResizeHandler();

  // 관리자 프로필 조회 API
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: prfileError,
  } = useAdminControllerGetStoreAdminProfile({
    query: {
      staleTime: 1000 * 60 * 30, // 1시간 동안 캐시 신선
      gcTime: 1000 * 60 * 60, // 2시간 동안 메모리에 데이터 캐싱
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 막기
      queryKey: ["profile"],
    },
  });

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
          } else if (restPath.includes("/create")) {
            return [item.name, "작성"];
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

  return (
    <div className="fixed flex items-center w-full md:w-[calc(100vw-260px)] h-[62px] top-0 px-[20px] md:px-[44px] bg-white border-b border-gray2 z-[3]">
      <div className="flex justify-between items-center w-full h-full">
        <div className="flex">
          {breadcrumb?.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <div className="mx-[10px]">/</div>}

              <span className="text-[16px] md:text-[16px] font-semibold">
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
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center h-full cursor-pointer select-none"
            >
              <span>{profileData?.data.storeName}</span>

              <Image
                src={dropdownArrowIcon}
                alt="프로필 메뉴"
                className={`w-[24px] h-[24px] ml-[4px] duration-300 ${isProfileOpen && "rotate-180"}`}
              />
            </button>

            {isProfileOpen && (
              <div
                style={{ boxShadow: "0 4px 10px 2px rgba(28, 28, 44, 0.04)" }}
                className="absolute flex flex-col w-[180px] md:w-[264px] top-[50px] right-0 bg-white rounded-[20px] cursor-default overflow-hidden"
              >
                <div className="flex flex-col w-full px-[20px] py-[16px] border-b border-b-gray1">
                  <p className="text-[16px] font-semibold">
                    {profileData?.data.storeName ?? ""}
                  </p>
                  <p className="text-gray5 text-[14px]">
                    {profileData?.data.identity ?? ""}
                  </p>
                </div>

                <div className="flex justify-between items-center w-full px-[20px] py-[16px]">
                  <p>구독 정보</p>

                  <div className="px-[8px] py-[4px] text-main text-[14px] bg-back4 rounded-[8px]">
                    {profileData?.data.membership ?? "BASIC"}
                  </div>
                </div>

                <div className="flex flex-col w-full px-[20px] py-[16px]">
                  <button
                    onClick={handleLogout}
                    className="w-full text-start text-[16px] cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

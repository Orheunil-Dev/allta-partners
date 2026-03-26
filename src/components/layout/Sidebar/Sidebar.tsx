import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Cookies from "js-cookie";
import { AdminCookie } from "@/types";
import { MenuItem, menuItems } from "@/constants";
import { sidebarLogo } from "../../../../public/images";

export const Sidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const cookie = Cookies.get("ptAdmin");

  const [admin, setAdmin] = useState<AdminCookie | null>(null);

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

  useEffect(() => {
    setAdmin(cookie ? JSON.parse(cookie) : null);
  }, [cookie]);

  return (
    <div className="flex flex-col flex-shrink-0 w-[260px] max-h-screen bg-white border-r border-line">
      <div className="flex items-center px-[32px] py-[22px]">
        <div
          onClick={handleRouteDashboard}
          className="text-gray7 text-[28px] font-bold  cursor-pointer"
        >
          <Image src={sidebarLogo} alt="올타" className="w-[110px]" />
        </div>
      </div>

      <div className="flex flex-col flex-1 mt-[16px] px-[20px] pb-[40px] gap-y-[16px] text-gray7 text-[14px] font-semibold overflow-y-auto">
        {Object.entries(groupedMenu).map(([category, items]) => (
          <div key={category} className="flex flex-col gap-y-[4px]">
            {/* 카테고리 */}
            {category !== "__root__" && (
              <p className="flex items-center px-[12px] h-[40px] ">
                <p className="text-gray4 text-[16px] font-semibold">
                  {category}
                </p>
              </p>
            )}

            {/* 메뉴 */}
            {items
              .filter((item) =>
                hasPermission(admin?.level ?? 0, item.minLevel, item.maxLevel),
              )
              .map((item) => {
                const isActive =
                  item.route &&
                  (currentPath === item.route ||
                    currentPath.startsWith(item.route + "/"));

                return (
                  <div
                    key={item.name}
                    onClick={() => item.route && router.push(item.route)}
                    className={`flex items-center w-full px-[12px] h-[48px] text-[16px] rounded-[12px]
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
                    <p>{item.name}</p>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

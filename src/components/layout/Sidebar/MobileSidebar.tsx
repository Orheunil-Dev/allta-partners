import { useRouter } from "next/router";
import Image from "next/image";
import { MenuItem, menuItems } from "@/constants";
import { useState } from "react";
import { hamburgerIcon, sidebarLogo } from "../../../../public/images";

export const MobileSidebar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isCurrentPathname = (item: MenuItem) => {
    if (item.route) {
      return currentPath.startsWith(item.route);
    }

    return false;
  };

  const isCurrentRoute = (route: string) => {
    const p1 = currentPath.split("/")[1];
    const p2 = route.split("/")[1];

    return p1 === p2;
  };

  const handleRouteDashboard = () => {
    router.push("/dashboard");
  };

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`fixed flex flex-col w-full bg-partners duration-300 overflow-y-hidden z-[4] 
        ${isOpen ? "h-screen" : "h-[60px]"}
        `}
    >
      <div className="flex flex-shrink-0 justify-between items-center h-[60px] px-[10px]">
        <div
          onClick={handleRouteDashboard}
          className="ml-[10px] text-white text-[28px] font-bold cursor-pointer"
        >
          <Image src={sidebarLogo} alt="올타" className="w-[62px] h-[26px]" />
        </div>

        <button onClick={handleToggleMenu} className="cursor-pointer">
          <Image src={hamburgerIcon} alt="메뉴" className="w-[40px] h-[40px]" />
        </button>
      </div>
    </div>
  );
};

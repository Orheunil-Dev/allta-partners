import { StaticImageData } from "next/image";
import {
  dashboardOn,
  dashboardOff,
  washOn,
  washOff,
  paymentOn,
  paymentOff,
  storeOn,
  storeOff,
  userOn,
  userOff,
  settingOn,
  settingOff,
} from "../../public/images";

export type MenuItem = {
  category: string | null;
  name: string;
  route?: string;
  activeIcon?: StaticImageData;
  inactiveIcon?: StaticImageData;
  minLevel?: number;
  maxLevel?: number;
};

export const menuItems: MenuItem[] = [
  {
    category: null,
    name: "대시보드",
    route: "/dashboard",
    activeIcon: dashboardOn,
    inactiveIcon: dashboardOff,
  },
  {
    category: "세차",
    name: "세차 관리",
    route: "/wash",
    activeIcon: washOn,
    inactiveIcon: washOff,
  },
  {
    category: "세차",
    name: "이용 내역",
    route: "/service-history",
    activeIcon: washOn,
    inactiveIcon: washOff,
  },
  {
    category: "분석",
    name: "매출 리포트",
    activeIcon: paymentOn,
    inactiveIcon: paymentOff,
    route: "/sales-report",
  },
  {
    category: "분석",
    name: "결제 내역",
    activeIcon: paymentOn,
    inactiveIcon: paymentOff,
    route: "/payment",
  },
  {
    category: "분석",
    name: "회원 관리",
    route: "/user",
    activeIcon: userOn,
    inactiveIcon: userOff,
  },
  {
    category: "시스템",
    name: "매장 관리",
    route: "/store",
    activeIcon: storeOn,
    inactiveIcon: storeOff,
  },
  {
    category: "시스템",
    name: "설정",
    route: "/setting",
    activeIcon: settingOn,
    inactiveIcon: settingOff,
  },
];

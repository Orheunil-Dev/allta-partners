import { StaticImageData } from "next/image";
import {
  dashboardIcon,
  passIcon,
  purchaseIcon,
  serviceHistoryIcon,
  storeIcon,
  userIcon,
} from "../../public/images";

export type MenuItem = {
  category: string;
  route?: string;
  icon?: StaticImageData;
  menus?: {
    name: string;
    route: string;
  }[];
};

export const menuItems: MenuItem[] = [
  {
    category: "대시보드",
    route: "/dashboard",
    icon: dashboardIcon,
  },
  {
    category: "매장 관리",
    route: "/store",
    icon: storeIcon,
  },
  {
    category: "이용 내역",
    route: "/service-history",
    icon: serviceHistoryIcon,
  },
  {
    category: "이용권 현황",
    icon: passIcon,
    menus: [
      {
        name: "구독권 현황",
        route: "/subscription",
      },
      {
        name: "일회권 현황",
        route: "/ticket",
      },
    ],
  },
  {
    category: "결제 관리",
    icon: purchaseIcon,
    menus: [
      {
        name: "회원 결제 내역",
        route: "/payment",
      },
    ],
  },
];

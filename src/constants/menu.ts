import { StaticImageData } from "next/image";
import {
  csIcon,
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
  minLevel?: number;
  maxLevel?: number;
  menus?: {
    name: string;
    route: string;
    minLevel?: number;
    maxLevel?: number;
  }[];
};

export const menuItems: MenuItem[] = [
  {
    category: "대시보드",
    route: "/dashboard",
    icon: dashboardIcon,
  },
  {
    category: "회원 관리",
    route: "/user",
    icon: userIcon,
    minLevel: 3,
  },
  {
    category: "이용 내역",
    route: "/service-history",
    icon: serviceHistoryIcon,
    maxLevel: 2,
  },
  {
    category: "이용권 현황",
    icon: passIcon,
    maxLevel: 2,
    menus: [
      {
        name: "구독권 현황",
        route: "/subscription",
      },
      {
        name: "일회권 현황",
        route: "/ticket",
      },
      {
        name: "현장권 현황",
        route: "/offline-ticket",
      },
    ],
  },
  {
    category: "결제 내역",
    icon: purchaseIcon,
    route: "/purchase",
    minLevel: 3,
  },
  {
    category: "결제 관리",
    icon: purchaseIcon,
    maxLevel: 2,
    menus: [
      {
        name: "회원 결제 내역",
        route: "/payment",
      },
    ],
  },
  {
    category: "매장 관리",
    icon: storeIcon,
    menus: [
      {
        name: "매장 정보",
        route: "/store",
      },
      {
        name: "직원 관리",
        route: "/staff",
      },
    ],
  },
  {
    category: "CS 관리",
    icon: csIcon,
    minLevel: 3,
    menus: [
      {
        name: "공지사항",
        route: "/notice",
      },
    ],
  },
];

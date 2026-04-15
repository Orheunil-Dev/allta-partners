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
  serviceHistoryOn,
  serviceHistoryOff,
  salesReportOn,
  saelsReportOff,
  crmOn,
  crmOff,
  marketingOn,
  marketingOff,
  carOn,
  carOff,
  operationOn,
  operationOff,
  weatherOn,
  weatherOff,
  salesTrendOn,
  salesTrendOff,
  fuelStockOn,
  fuelStockOff,
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
    category: "운영",
    name: "시재 관리",
    route: "/store-operation",
    activeIcon: operationOn,
    inactiveIcon: operationOff,
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
    activeIcon: serviceHistoryOn,
    inactiveIcon: serviceHistoryOff,
  },
  {
    category: "세차",
    name: "매출 분석",
    activeIcon: salesReportOn,
    inactiveIcon: saelsReportOff,
    route: "/sales-report",
  },
  {
    category: "세차",
    name: "매출 트렌드",
    route: "/sales-trend",
    activeIcon: salesTrendOn,
    inactiveIcon: salesTrendOff,
  },
  {
    category: "세차",
    name: "날씨 분석",
    route: "/weather",
    activeIcon: weatherOn,
    inactiveIcon: weatherOff,
  },
  // {
  //   category: "세차",
  //   name: "결제 내역",
  //   activeIcon: paymentOn,
  //   inactiveIcon: paymentOff,
  //   route: "/payment",
  // },
  // {
  //   category: "주유",
  //   name: "주유 내역",
  //   route: "/fuel-sales",
  //   activeIcon: salesReportOn,
  //   inactiveIcon: saelsReportOff,
  // },
  {
    category: "주유",
    name: "매출 분석",
    route: "/fuel-report",
    activeIcon: salesReportOn,
    inactiveIcon: saelsReportOff,
  },
  {
    category: "주유",
    name: "재고 관리",
    route: "/fuel-stock",
    activeIcon: fuelStockOn,
    inactiveIcon: fuelStockOff,
  },
  {
    category: "고객",
    name: "회원 관리",
    route: "/user",
    activeIcon: userOn,
    inactiveIcon: userOff,
  },
  {
    category: "고객",
    name: "마케팅",
    route: "/marketing",
    activeIcon: marketingOn,
    inactiveIcon: marketingOff,
  },
  {
    category: "고객",
    name: "CRM",
    route: "/crm",
    activeIcon: crmOn,
    inactiveIcon: crmOff,
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
    name: "차량 관리",
    route: "/car",
    activeIcon: carOn,
    inactiveIcon: carOff,
  },
  {
    category: "시스템",
    name: "설정",
    route: "/setting",
    activeIcon: settingOn,
    inactiveIcon: settingOff,
  },
];

import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLandmark,
  LuDatabase,
  LuHistory,
} from "react-icons/lu";


export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Income",
    icon: LuWalletMinimal,
    path: "/income",
  },
  {
    id: "03",
    label: "Expense",
    icon: LuHandCoins,
    path: "/expense",
  },
  {
    id: "04",
    label: "Accounts",
    icon: LuLandmark,
    path: "/accounts",
  },
  {
    id: "05",
    label: "History",
    icon: LuHistory,
    path: "/history",
  },
  {
    id: "06",
    label: "Data",
    icon: LuDatabase,
    path: "/data",
  },
];

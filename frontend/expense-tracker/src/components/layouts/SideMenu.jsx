import React from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-slate-900 border-r border-slate-800 p-5 sticky top-[61px] z-20">
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] transition-colors ${
            activeMenu === item.label
              ? "text-white bg-primary"
              : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
          } py-3 px-6 rounded-lg mb-3`}
          onClick={() => navigate(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

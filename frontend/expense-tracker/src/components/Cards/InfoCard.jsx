import React from "react";

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="flex gap-6 bg-slate-900 p-6 rounded-2xl shadow-lg shadow-black/20 border border-slate-800">
      <div className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}>
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-slate-400 mb-1">{label}</h6>
        <span className="text-[22px] text-slate-100">${value}</span>
      </div>
    </div>
  );
};

export default InfoCard;

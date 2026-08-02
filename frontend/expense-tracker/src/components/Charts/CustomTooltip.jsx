import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 shadow-lg shadow-black/30 rounded-lg p-2 border border-slate-700">
        <p className="text-xs font-semibold text-purple-300 mb-1">{payload[0].name}</p>
        <p className="text-sm text-slate-300">
          Amount: <span className="text-sm font-medium text-slate-100">${payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomTooltip;

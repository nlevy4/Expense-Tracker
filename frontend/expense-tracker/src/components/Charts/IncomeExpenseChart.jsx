import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-800 shadow-lg shadow-black/30 rounded-lg p-3 border border-slate-700">
      <p className="text-xs font-semibold text-purple-300 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm text-slate-300">
          {entry.name}:{" "}
          <span
            className="font-medium"
            style={{ color: entry.color }}
          >
            ${entry.value.toLocaleString()}
          </span>
        </p>
      ))}
    </div>
  );
};

const IncomeExpenseChart = ({ data }) => {
  return (
    <div className="mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
            formatter={(value) => <span className="text-slate-300">{value}</span>}
          />

          <Bar dataKey="income" name="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expense" name="Expenses" fill="#FA2C37" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeExpenseChart;

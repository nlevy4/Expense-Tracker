import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";

const CustomLineChart = ({ data }) => {

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 shadow-lg shadow-black/30 rounded-lg p-2 border border-slate-700">
          <p className="text-xs font-semibold text-purple-300 mb-1">{payload[0].payload.category}</p>
          <p className="text-sm text-slate-300">
            Amount: <span className="text-sm font-medium text-slate-100">${payload[0].payload.amount}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
            <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b6cf6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#8b6cf6" stopOpacity={0} />
            </linearGradient>
            </defs>

            <CartesianGrid stroke="none" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
            <Tooltip content={<CustomTooltip />} />

            <Area type="monotone" dataKey="amount" stroke="#8b6cf6"  fill="url(#incomeGradient)" strokeWidth={3} dot={{ r: 3, fill: "#ab8df8" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {

  // Function to alternate colors
  const getBarColor = (index) => {
    return index % 2 === 0 ? "#8b6cf6" : "#3f2d78";
  };

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
    <div className="mt-6">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
          <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />

          <Tooltip content={CustomTooltip} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />

          <Bar
            dataKey="amount"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
            activeDot={{ r: 8, fill: "yellow" }}
            activeStyle={{ fill: "green" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;

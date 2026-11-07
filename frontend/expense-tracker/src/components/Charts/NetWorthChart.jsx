import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import moment from "moment";

const NetWorthChart = ({ data }) => {
  // Bucket by week, keeping the latest known total as of each week
  // (data is sorted ascending, so later entries overwrite earlier ones)
  const weekMap = new Map();
  data.forEach((point) => {
    const weekStart = moment(point.date).startOf("isoWeek").format("YYYY-MM-DD");
    weekMap.set(weekStart, point.total);
  });

  const chartData = Array.from(weekMap.entries()).map(([weekStart, total]) => ({
    label: moment(weekStart).format("Do MMM"),
    weekLabel: `Week of ${moment(weekStart).format("Do MMM")}`,
    total,
  }));

  // Zoom the Y axis to the actual range instead of always starting at 0,
  // so week-to-week movement is visible instead of a near-flat line
  const totals = chartData.map((point) => point.total);
  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);
  const range = maxTotal - minTotal;
  const padding = range > 0 ? range * 0.15 : Math.max(Math.abs(maxTotal) * 0.1, 10);
  const yDomain = [Math.floor(minTotal - padding), Math.ceil(maxTotal + padding)];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 shadow-lg shadow-black/30 rounded-lg p-2 border border-slate-700">
          <p className="text-xs font-semibold text-purple-300 mb-1">{payload[0].payload.weekLabel}</p>
          <p className="text-sm text-slate-300">
            Net Worth: <span className="text-sm font-medium text-slate-100">${payload[0].payload.total}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b6cf6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#8b6cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="none" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
          <YAxis domain={yDomain} tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="none" />
          <Tooltip content={<CustomTooltip />} />

          <Area type="monotone" dataKey="total" stroke="#8b6cf6" fill="url(#netWorthGradient)" strokeWidth={3} dot={{ r: 3, fill: "#ab8df8" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NetWorthChart;

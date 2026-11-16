import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";
import { prepareIncomeCategoryPieChartData } from "../../utils/helper";

const COLORS = ["#875CF5", "#10B981", "#FA2C37", "#FF6900", "#3B82F6", "#F59E0B"];

const IncomeCategoryOverview = ({ transactions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(prepareIncomeCategoryPieChartData(transactions));
    return () => {};
  }, [transactions]);

  const totalIncome = chartData.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income by Category</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Your total income, and how much of it comes from each category.
          </p>
        </div>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome.toLocaleString()}`}
        showTextAnchor
        showLegendAmount
        colors={COLORS}
      />
    </div>
  );
};

export default IncomeCategoryOverview;

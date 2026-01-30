import { TotalPatientsLineChart } from "./LineGraph";
import { ChartPieLabel } from "./PieChart";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="flex gap-4 items-stretch overflow-hidden">
        {/* Pie Chart → 35% */}
        <div className="flex-[0.35] overflow-hidden">
          <ChartPieLabel />
        </div>

        {/* Line Chart → 65% */}
        <div className="flex-[0.65] overflow-hidden">
          <TotalPatientsLineChart />
        </div>
      </div>
    </div>
  );
}

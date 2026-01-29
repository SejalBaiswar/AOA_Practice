import { TotalPatientsLineChart } from "./LineGraph";
import { ChartPieLabel } from "./PieChart";

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="flex gap-4 items-stretch">
        {/* Pie Chart → 35% */}
        <div className="flex-[0.35]">
          <ChartPieLabel />
        </div>

        {/* Line Chart → 65% */}
        <div className="flex-[0.65]">
          <TotalPatientsLineChart />
        </div>
      </div>
    </div>
  );
}

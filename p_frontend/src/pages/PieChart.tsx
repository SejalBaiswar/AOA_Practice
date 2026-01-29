"use client";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../components/ui/chart";
export const Dashboard = "A pie chart with a label";
const chartData = [
  { status: "IN PROGRESS", products: 60, fill: "var(--color-chrome)" },
  { status: "PENDING", products: 30, fill: "var(--color-safari)" },
  { status: "COMPLETED", products: 87, fill: "var(--color-firefox)" },
];
const chartConfig = {
  products: {
    label: "Products",
  },
  chrome: {
    label: "IN PROGRESS",
    color: "var(--chart-1)",
  },
  safari: {
    label: "PENDING",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "COMPLETED",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;
export function ChartPieLabel() {
  return (
    <Card className="flex flex-col h-full min-h-[360px]">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status</CardTitle>
        <CardDescription>January 2026</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[500px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="products" label nameKey="status" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total orders staus for the last 1 month
        </div>
      </CardFooter>
    </Card>
  );
}

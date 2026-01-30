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
    <Card className="flex flex-col h-full min-h-[300px] overflow-hidden">
      <CardHeader className="items-center pb-1">
        <CardTitle>Order Status</CardTitle>
        <CardDescription>January 2026</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px]"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="products"
              nameKey="status"
              label
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col gap-1 text-sm pt-2">
        <div className="flex items-center gap-2 font-medium">
          Trending up by 5.2% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Showing total orders for last 1 month
        </div>
      </CardFooter>
    </Card>
  );
}

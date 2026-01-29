"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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

export const description = "Total patients line chart";

const chartData = [
  { month: "August", patients: 140 },
  { month: "September", patients: 190 },
  { month: "October", patients: 250 },
  { month: "November", patients: 280 },
  { month: "December", patients: 370 },
  { month: "January", patients: 90 },
];

const chartConfig = {
  patients: {
    label: "Total Patients",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function TotalPatientsLineChart() {
  return (
    <Card className="h-full min-h-[360px]">
      <CardHeader>
        <CardTitle>Total Patients</CardTitle>
        <CardDescription>August 2025 – January 2026</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Line
              dataKey="patients"
              type="natural"
              stroke="var(--color-patients)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-patients)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Patient growth trend <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total patients for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

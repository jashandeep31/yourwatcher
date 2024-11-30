"use client";

import dayjs from "dayjs";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { IExecution } from "../page";

const chartConfig = {
  status: {
    label: "Status",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function UptimeChart({
  executions,
}: {
  executions: IExecution[];
}) {
  const chartData = executions.map((execution) => {
    const status = execution.labels.find(
      (label) => label.key === "status"
    )?.value;
    const checkTimeLabel = execution.labels.find(
      (label) => label.key === "check_time"
    )?.value;
    const checkTime = dayjs(String(checkTimeLabel)).format("DD:MM   HH:mm:ss");

    return {
      checkTime: checkTime == "Invalid Date" ? "" : checkTime,
      status: status === "up" ? 1 : 0,
      color:
        status === "up" ? "hsl(var(--blue-500))" : "hsl(var(--destructive))",
    };
  });

  return (
    <Card className="overflow-auto">
      <CardHeader>
        <CardTitle>Website Uptime Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="checkTime"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide domain={[0, 1]} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Time
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.checkTime}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Status
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.status === 1 ? "Up" : "Down"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="status"
              fill="var(--color-status)"
              radius={[4, 4, 0, 0]}
              barSize={50}
            >
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {chartData.map((entry: any, index) => (
                <rect
                  key={`bar-${index}`}
                  x={entry.x}
                  y={entry.y}
                  width={entry.width}
                  height={entry.height}
                  fill={entry.color}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateBeamData } from "@/lib/beam-formulas";

interface DeflectionChartProps {
  w0: number;
  EI: number;
}

export function DeflectionChart({ w0, EI }: DeflectionChartProps) {
  const data = useMemo(() => {
    const beamData = generateBeamData(w0, EI, 100);
    return beamData.map((point) => ({
      x: point.x.toFixed(2),
      deflection: (point.deflection * 1000).toFixed(3),
    }));
  }, [w0, EI]);

  return (
    <Card id="deflection-chart" className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          Gráfica de Deflexión y(x)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Deflexión a lo largo de la viga (mm)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#d1d5db"
              opacity={0.7}
            />
            <XAxis
              dataKey="x"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              label={{
                value: "Posición x (m)",
                position: "insideBottom",
                offset: -10,
                fill: "#374151",
                fontSize: 12,
              }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              label={{
                value: "Deflexión (mm)",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
                fontSize: 12,
                offset: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
              labelStyle={{ color: "#111827", fontWeight: 600 }}
              itemStyle={{ color: "#4f46e5" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="deflection"
              stroke="#4f46e5"
              strokeWidth={2.5}
              dot={false}
              name="Deflexión"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

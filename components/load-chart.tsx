"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
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

interface LoadChartProps {
  w0: number;
}

export function LoadChart({ w0 }: LoadChartProps) {
  const data = useMemo(() => {
    const beamData = generateBeamData(w0, 1000, 100);
    return beamData.map((point) => ({
      x: point.x.toFixed(2),
      load: point.load.toFixed(2),
    }));
  }, [w0]);

  return (
    <Card id="load-chart" className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          Gráfica de Carga w(x)
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Distribución de carga a lo largo de la viga (kN/m)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
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
                value: "Carga (kN/m)",
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
              itemStyle={{ color: "#10b981" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#10b981"
              strokeWidth={2.5}
              fill="url(#loadGradient)"
              name="Carga w(x)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

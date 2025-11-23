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
      <CardHeader>
        <CardTitle className="text-lg">Gráfica de Carga w(x)</CardTitle>
        <CardDescription>
          Distribución de carga a lo largo de la viga (kN/m)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.5} />
            <XAxis
              dataKey="x"
              stroke="#aaa"
              tick={{ fill: "#aaa", fontSize: 12 }}
              label={{
                value: "Posición x (m)",
                position: "insideBottom",
                offset: -10,
                fill: "#ccc",
                fontSize: 13,
              }}
            />
            <YAxis
              stroke="#aaa"
              tick={{ fill: "#aaa", fontSize: 12 }}
              label={{
                value: "Carga (kN/m)",
                angle: -90,
                position: "insideLeft",
                fill: "#ccc",
                fontSize: 13,
                offset: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid #333",
              }}
              labelStyle={{ color: "#fff" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Area
              type="monotone"
              dataKey="load"
              stroke="#4ade80"
              strokeWidth={3}
              fill="url(#loadGradient)"
              name="Carga w(x)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

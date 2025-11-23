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
      deflection: (point.deflection * 1000).toFixed(3), // Convert to mm
    }));
  }, [w0, EI]);

  return (
    <Card id="deflection-chart" className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Gráfica de Deflexión y(x)</CardTitle>
        <CardDescription>Deflexión a lo largo de la viga (mm)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
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
                value: "Deflexión (mm)",
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
            <Line
              type="monotone"
              dataKey="deflection"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={false}
              name="Deflexión"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  isPositive: boolean;
}

export function SparklineChart({
  data,
  width = 100,
  height = 40,
  isPositive,
}: SparklineChartProps) {
  const chartData = useMemo(() => {
    return data.map((value, index) => ({
      value,
      index,
    }));
  }, [data]);

  const positiveGradient = {
    start: "#dcfce7", // light green
    end: "#22c55e",   // dark green
  };

  const negativeGradient = {
    start: "#fee2e2", // light red
    end: "#ef4444",   // dark red
  };

  const gradient = isPositive ? positiveGradient : negativeGradient;
  const strokeColor = isPositive ? "#15803d" : "#b91c1c";

  return (
    <div style={{ width, height }} className="overflow-visible">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={chartData} 
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`colorGradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradient.end} stopOpacity={0.5}/>
              <stop offset="95%" stopColor={gradient.start} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={1.5}
            fillOpacity={1}
            fill={`url(#colorGradient-${isPositive})`}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 
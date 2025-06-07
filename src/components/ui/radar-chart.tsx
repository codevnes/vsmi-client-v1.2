"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, PolarRadiusAxis } from "recharts";

interface RadarChartProps {
  data: Array<{
    subject: string;
    value: number;
  }>;
}

export function FscoreRadarChart({ data }: RadarChartProps) {
  return (
    <div className="w-full h-64 md:h-96 -mx-5">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="65%" 
          data={data}
          margin={{ top: 30, right: 50, bottom: 30, left: 50 }}
        >
          <PolarGrid gridType="circle" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fontSize: 11, 
              fontWeight: 500,
              fill: "#334155",
              dy: 3
            }}
            tickLine={false}
          />
          <PolarRadiusAxis angle={90} domain={[0, 1]} tick={false} />
          <Tooltip formatter={(value) => [value === 1 ? "Đạt" : "Không đạt"]} />
          <Radar
            name="F-Score"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 
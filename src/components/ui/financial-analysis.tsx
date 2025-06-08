"use client"

import { useState } from "react"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from "recharts"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface FinancialIndicator {
    id: string
    symbol: string
    year: number
    quarter: number | null
    eps: number
    epsIndustry: number | null
    pe: number | null
    peIndustry: number | null
    roa: number
    roe: number
    roaIndustry: number | null
    roeIndustry: number | null
    revenue: number | null
    margin: number | null
    totalDebtToEquity: number
    totalAssetsToEquity: number
    createdAt: string
    updatedAt: string
    stock: {
        name: string
        exchange: string
    }
}

interface FinancialAnalysisProps {
    data: FinancialIndicator[]
    symbol: string
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/95 backdrop-blur-sm border border-border/40 shadow-lg rounded-lg p-3 text-sm">
                <p className="font-medium text-foreground/80 mb-2">{label}</p>
                <div className="space-y-1.5">
                    {payload.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-medium tabular-nums">
                                {formatter
                                    ? formatter(entry.value, entry.name)
                                    : entry.value
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
};

export function FinancialAnalysis({ data, symbol }: FinancialAnalysisProps) {
    const [viewType, setViewType] = useState<"year" | "quarter">("year")

    // Ensure data is an array
    const financialData = Array.isArray(data) ? data : [];
    
    // If data is empty, show a placeholder message
    if (financialData.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center">
                    <div className="w-1 h-8 bg-slate-800 rounded-full mr-4"></div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Phân tích chỉ số tài chính</h2>
                        <p className="text-sm text-slate-500 mt-1">Không có dữ liệu</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
                        <p className="text-slate-500">Không có dữ liệu tài chính cho cổ phiếu {symbol}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Filter data based on the view type
    const yearlyData = financialData.filter(item => item.quarter === null)
        .sort((a, b) => a.year - b.year)

    const quarterlyData = financialData.filter(item => item.quarter !== null)
        .sort((a, b) => {
            if (a.year !== b.year) return a.year - b.year
            return (a.quarter || 0) - (b.quarter || 0)
        })

    // Format data for quarterly display
    const formattedQuarterlyData = quarterlyData.map(item => ({
        ...item,
        period: `Q${item.quarter}/${item.year}`
    }))

    // Get the most recent date for "updated at" display
    const lastUpdated = financialData.length > 0 
        ? new Date(financialData.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )[0].updatedAt).toLocaleDateString('vi-VN') 
        : '';

    return (
        <motion.div
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                    <div className="w-1 h-8 bg-slate-800 rounded-full mr-4"></div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Phân tích chỉ số tài chính</h2>
                        <p className="text-sm text-slate-500 mt-1">Cập nhật: {lastUpdated}</p>
                    </div>
                </div>
                <Tabs
                    value={viewType}
                    onValueChange={(value) => setViewType(value as "year" | "quarter")}
                    className="w-full sm:w-auto"
                >
                    <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex bg-slate-100">
                        <TabsTrigger value="year" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-slate-800">Theo năm</TabsTrigger>
                        <TabsTrigger value="quarter" className="flex-1 data-[state=active]:bg-white data-[state=active]:text-slate-800">Theo quý</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence mode="wait">
                    {viewType === "year" ? (
                        <>
                            <ChartCard
                                key="eps-yearly"
                                title="Lãi cơ bản trên cổ phiếu (EPS)"
                                subtitle="Đơn vị: VND"
                            >
                                <EPSChart data={yearlyData} />
                            </ChartCard>
                            <ChartCard
                                key="pe-yearly"
                                title="Chỉ số P/E"
                                subtitle="So sánh với ngành"
                            >
                                <PEChart data={yearlyData} />
                            </ChartCard>
                            <ChartCard
                                key="profit-yearly"
                                title="ROA / ROE"
                                subtitle="Hiệu suất sinh lời (%)"
                            >
                                <ProfitabilityChart data={yearlyData} />
                            </ChartCard>
                            <ChartCard
                                key="ratios-yearly"
                                title="Tỷ lệ tài chính"
                                subtitle="Cấu trúc vốn"
                            >
                                <FinancialRatiosChart data={yearlyData} />
                            </ChartCard>
                        </>
                    ) : (
                        <>
                            <ChartCard
                                key="eps-quarterly"
                                title="Lãi cơ bản trên cổ phiếu (EPS)"
                                subtitle="Đơn vị: VND"
                            >
                                <QuarterlyEPSChart data={formattedQuarterlyData} />
                            </ChartCard>
                            <ChartCard
                                key="profit-quarterly"
                                title="ROA / ROE"
                                subtitle="Hiệu suất sinh lời (%)"
                            >
                                <QuarterlyProfitabilityChart data={formattedQuarterlyData} />
                            </ChartCard>
                            <ChartCard
                                key="revenue-quarterly"
                                title="Doanh thu & Biên lợi nhuận"
                                subtitle="Tỷ VND / %"
                            >
                                <QuarterlyRevenueMarginChart data={formattedQuarterlyData} />
                            </ChartCard>
                            <ChartCard
                                key="ratios-quarterly"
                                title="Tỷ lệ tài chính"
                                subtitle="Cấu trúc vốn"
                            >
                                <QuarterlyFinancialRatiosChart data={formattedQuarterlyData} />
                            </ChartCard>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

// Reusable Chart Card component
function ChartCard({
    children,
    title,
    subtitle
}: {
    children: React.ReactNode,
    title: string,
    subtitle?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-2 border-b border-slate-100">
                    <CardTitle className="text-lg font-medium text-slate-800">{title}</CardTitle>
                    {subtitle && (
                        <p className="text-xs text-slate-500">{subtitle}</p>
                    )}
                </CardHeader>
                <CardContent className="pt-4 pb-4">
                    <div className="h-72">{children}</div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

// Chart Components for Yearly View
function EPSChart({ data }: { data: FinancialIndicator[] }) {
    const chartData = data.map(item => ({
        year: item.year,
        eps: item.eps,
        epsIndustry: item.epsIndustry
    }))

    const formatValue = (value: number) => `${Number(value).toLocaleString('vi-VN')} VND`;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <Bar dataKey="eps" name="EPS công ty" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="epsIndustry" name="EPS ngành" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function PEChart({ data }: { data: FinancialIndicator[] }) {
    const chartData = data.map(item => ({
        year: item.year,
        pe: item.pe,
        peIndustry: item.peIndustry
    }))

    const formatValue = (value: number) => `${Number(value).toFixed(2)}`;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <ReferenceLine y={0} stroke="#e5e5e5" />
                <Bar dataKey="pe" name="P/E công ty" fill="#dc2626" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="peIndustry" name="P/E ngành" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function ProfitabilityChart({ data }: { data: FinancialIndicator[] }) {
    const chartData = data.map(item => ({
        year: item.year,
        roa: item.roa * 100, // Convert to percentage
        roe: item.roe * 100,
        roaIndustry: item.roaIndustry ? item.roaIndustry * 100 : null,
        roeIndustry: item.roeIndustry ? item.roeIndustry * 100 : null
    }))

    const formatValue = (value: number) => `${Number(value).toFixed(2)}%`;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <ReferenceLine y={0} stroke="#e5e5e5" />
                <Line type="monotone" dataKey="roa" name="ROA công ty" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="roe" name="ROE công ty" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="roaIndustry" name="ROA ngành" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="roeIndustry" name="ROE ngành" stroke="#db2777" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="3 3" />
            </LineChart>
        </ResponsiveContainer>
    )
}

function FinancialRatiosChart({ data }: { data: FinancialIndicator[] }) {
    const chartData = data.map(item => ({
        year: item.year,
        totalDebtToEquity: item.totalDebtToEquity,
        totalAssetsToEquity: item.totalAssetsToEquity
    }))

    const formatValue = (value: number) => Number(value).toFixed(2);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <ReferenceLine y={0} stroke="#e5e5e5" />
                <Bar dataKey="totalDebtToEquity" name="Tổng nợ/VCSH" fill="#be185d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="totalAssetsToEquity" name="Tổng tài sản/VCSH" fill="#6d28d9" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
        </ResponsiveContainer>
    )
}

// Chart Components for Quarterly View
function QuarterlyEPSChart({ data }: { data: any[] }) {
    const formatValue = (value: number) => `${Number(value).toLocaleString('vi-VN')} VND`;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <Bar dataKey="eps" name="EPS công ty" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function QuarterlyProfitabilityChart({ data }: { data: any[] }) {
    const chartData = data.map(item => ({
        ...item,
        roa: item.roa * 100,
        roe: item.roe * 100
    }))

    const formatValue = (value: number) => `${Number(value).toFixed(2)}%`;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <ReferenceLine y={0} stroke="#e5e5e5" />
                <Line type="monotone" dataKey="roa" name="ROA" stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="roe" name="ROE" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
        </ResponsiveContainer>
    )
}

function QuarterlyRevenueMarginChart({ data }: { data: any[] }) {
    // Filter only entries that have revenue data
    const filteredData = data.filter(item => item.revenue !== null && item.margin !== null)
    
    // Format revenue in billions for better display
    const chartData = filteredData.map(item => ({
        ...item,
        revenue: item.revenue / 1000000000, // Convert to billions
        margin: item.margin * 100 // Convert to percentage
    }))

    const formatTooltip = (value: number, name: string) => {
        if (name === "revenue" || name === "Doanh thu (tỷ VND)") return `${Number(value).toFixed(2)} tỷ VND`;
        if (name === "margin" || name === "Biên lợi nhuận (%)") return `${Number(value).toFixed(2)}%`;
        return value;
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" unit="%" axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number, name: string) => formatTooltip(value, name)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu (tỷ VND)" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="margin" name="Biên lợi nhuận (%)" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </BarChart>
        </ResponsiveContainer>
    )
}

function QuarterlyFinancialRatiosChart({ data }: { data: any[] }) {
    const formatValue = (value: number) => Number(value).toFixed(2);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip formatter={(value: number) => formatValue(value)} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ marginTop: 10 }} />
                <Bar dataKey="totalDebtToEquity" name="Tổng nợ/VCSH" fill="#be185d" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="totalAssetsToEquity" name="Tổng tài sản/VCSH" fill="#6d28d9" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
        </ResponsiveContainer>
    )
} 
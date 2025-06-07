import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon, TrendingUpIcon, AreaChart, BarChart2 } from "lucide-react";
import { cva } from "class-variance-authority";

interface TechnicalAnalysisProps {
    // Basic information
    symbol: string;
    close?: number;
    
    // Oscillator indicators
    rsi14: number;
    rsiEvaluation: "MUA" | "BÁN" | "Trung Lập";
    stochasticK: number;
    stochasticEvaluation: "MUA" | "BÁN" | "Trung Lập";
    williamsR: number;
    williamsEvaluation: "MUA" | "BÁN" | "Trung Lập";
    ultimateOscillator: number;
    ultimateOscillatorEvaluation: "MUA" | "BÁN" | "Trung Lập";
    cci20?: number;
    cciEvaluation?: "MUA" | "BÁN" | "Trung Lập";
    stochasticRsiFast?: number;
    stochasticRsiFastEvaluation?: "MUA" | "BÁN" | "Trung Lập";
    macdLevel?: number;
    macdEvaluation?: "TĂNG" | "GIẢM";
    momentum10?: number;
    momentumEvaluation?: "TĂNG" | "GIẢM";
    
    // Trend indicators
    adx14?: number;
    adxEvaluation?: string;
    ma10?: number;
    ma10Evaluation?: "TĂNG" | "GIẢM";
    ma20?: number;
    ma20Evaluation?: "TĂNG" | "GIẢM";
    ma30?: number;
    ma30Evaluation?: "TĂNG" | "GIẢM";
    ma50: number;
    ma50Evaluation?: "TĂNG" | "GIẢM";
    ma100: number;
    ma100Evaluation?: "TĂNG" | "GIẢM";
    ma200: number;
    ma200Evaluation?: "TĂNG" | "GIẢM";
    hma9: number;
    hma9Evaluation?: "TĂNG" | "GIẢM";
    ichimokuBaseLine: number;
    ichimokuBaseLineEvaluation?: "TĂNG" | "GIẢM";

    // For compatibility with old data structure
    ma50Trend?: "TĂNG" | "GIẢM";
    ma100Trend?: "TĂNG" | "GIẢM";
    ma200Trend?: "TĂNG" | "GIẢM";
    hma9Trend?: "TĂNG" | "GIẢM";
    ichimokuBaseLineTrend?: "TĂNG" | "GIẢM";

    // Metadata
    createdAt?: string;
    updatedAt?: string;
    stock?: {
        name: string;
        exchange: string;
        industry?: string;
    };
}

const tagVariants = cva(
    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
    {
        variants: {
            variant: {
                buy: "bg-gradient-to-r from-green-100 to-green-50 text-green-700 border border-green-200",
                sell: "bg-gradient-to-r from-red-100 to-red-50 text-red-700 border border-red-200",
                neutral: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border border-amber-200",
                up: "text-green-600 font-medium",
                down: "text-red-600 font-medium",
                trend: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border border-blue-200",
            },
        },
        defaultVariants: {
            variant: "neutral",
        },
    }
);

export function TechnicalAnalysis(props: TechnicalAnalysisProps) {
    // Use updatedAt from props if available, otherwise current date
    const updateDate = props.updatedAt 
        ? new Date(props.updatedAt) 
        : new Date();
    const formattedDate = format(updateDate, "dd/MM/yyyy", { locale: vi });

    const getEvaluationVariant = (evaluation: string) => {
        switch (evaluation) {
            case "MUA":
                return "buy";
            case "BÁN":
                return "sell";
            case "Trung Lập":
                return "neutral";
            case "Có xu hướng":
                return "trend";
            default:
                return "neutral";
        }
    };

    const getTrendVariant = (trend: string) => {
        return trend === "TĂNG" ? "up" : "down";
    };

    // For compatibility with old data structure
    const getMa50Evaluation = () => props.ma50Evaluation || props.ma50Trend || "TĂNG";
    const getMa100Evaluation = () => props.ma100Evaluation || props.ma100Trend || "TĂNG";
    const getMa200Evaluation = () => props.ma200Evaluation || props.ma200Trend || "TĂNG";
    const getHma9Evaluation = () => props.hma9Evaluation || props.hma9Trend || "TĂNG";
    const getIchimokuEvaluation = () => props.ichimokuBaseLineEvaluation || props.ichimokuBaseLineTrend || "TĂNG";

    // Helper to format numbers with commas for thousands
    const formatNumber = (num: number) => num.toLocaleString('vi-VN');

    // Calculate the summary based on evaluations
    const calculateSummary = () => {
        const indicators = [
            props.rsiEvaluation,
            props.stochasticEvaluation,
            props.williamsEvaluation,
            props.ultimateOscillatorEvaluation,
            props.cciEvaluation,
            props.stochasticRsiFastEvaluation,
        ].filter(Boolean);

        const buy = indicators.filter(i => i === "MUA").length;
        const sell = indicators.filter(i => i === "BÁN").length;
        const neutral = indicators.filter(i => i === "Trung Lập").length;

        return { buy, sell, neutral };
    };

    const summary = calculateSummary();
    
    return (
        <Card className="w-full border border-gray-100 rounded-2xl shadow-0 overflow-hidden bg-white/70 backdrop-blur-sm">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <CardHeader className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="w-1 h-8 bg-gray-800 rounded-full mr-4"></div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl font-bold text-gray-800">Phân tích kỹ thuật</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">Cập nhật: {formattedDate}</p>
                        </div>
                        {props.close && (
                            <div className="bg-slate-50 px-4 py-2 rounded-lg text-center">
                                <p className="text-sm text-slate-500">Giá đóng cửa</p>
                                <p className="text-xl font-bold text-slate-800">{formatNumber(props.close)} đ</p>
                            </div>
                        )}
                    </div>
                </CardHeader>
            </div>

            {/* Summary section */}
            <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Mua</p>
                        <p className="text-2xl font-bold text-green-600">{summary.buy}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Trung lập</p>
                        <p className="text-2xl font-bold text-amber-600">{summary.neutral}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Bán</p>
                        <p className="text-2xl font-bold text-red-600">{summary.sell}</p>
                    </div>
                </div>
            </div>

            <CardContent className="p-0 lg:flex">
                {/* Oscillator indicators */}
                <div className="p-6 border-b border-gray-100 lg:w-1/2 lg:border-r lg:border-b-0">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="p-1.5 rounded-lg bg-blue-50">
                            <BarChart3Icon className="h-5 w-5 text-blue-500" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">Nhóm chỉ báo dao động</h3>
                    </div>

                    <div className="space-y-4">
                        {/* RSI */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">RSI 14</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.rsi14.toFixed(2)}</p>
                            </div>
                            <div className="w-28 text-right">
                                <span className={tagVariants({ variant: getEvaluationVariant(props.rsiEvaluation) })}>
                                    {props.rsiEvaluation}
                                </span>
                            </div>
                        </div>

                        {/* Stochastic */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Stochastic %K</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.stochasticK.toFixed(2)}</p>
                            </div>
                            <div className="w-28 text-right">
                                <span className={tagVariants({ variant: getEvaluationVariant(props.stochasticEvaluation) })}>
                                    {props.stochasticEvaluation}
                                </span>
                            </div>
                        </div>

                        {/* Williams */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Williams %R</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.williamsR.toFixed(2)}</p>
                            </div>
                            <div className="w-28 text-right">
                                <span className={tagVariants({ variant: getEvaluationVariant(props.williamsEvaluation) })}>
                                    {props.williamsEvaluation}
                                </span>
                            </div>
                        </div>

                        {/* Ultimate Oscillator */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Ultimate Oscillator</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.ultimateOscillator.toFixed(2)}</p>
                            </div>
                            <div className="w-28 text-right">
                                <span className={tagVariants({ variant: getEvaluationVariant(props.ultimateOscillatorEvaluation) })}>
                                    {props.ultimateOscillatorEvaluation}
                                </span>
                            </div>
                        </div>

                        {/* CCI */}
                        {props.cci20 !== undefined && props.cciEvaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">CCI 20</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.cci20.toFixed(2)}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <span className={tagVariants({ variant: getEvaluationVariant(props.cciEvaluation) })}>
                                        {props.cciEvaluation}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Stochastic RSI Fast */}
                        {props.stochasticRsiFast !== undefined && props.stochasticRsiFastEvaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Stochastic RSI Fast</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.stochasticRsiFast.toFixed(2)}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <span className={tagVariants({ variant: getEvaluationVariant(props.stochasticRsiFastEvaluation) })}>
                                        {props.stochasticRsiFastEvaluation}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* MACD */}
                        {props.macdLevel !== undefined && props.macdEvaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">MACD Level</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.macdLevel.toFixed(2)}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(props.macdEvaluation) })}`}>
                                        {props.macdEvaluation === "TĂNG" ? (
                                            <div className="rounded-full bg-green-100 p-0.5">
                                                <ArrowUpIcon className="h-3 w-3" />
                                            </div>
                                        ) : (
                                            <div className="rounded-full bg-red-100 p-0.5">
                                                <ArrowDownIcon className="h-3 w-3" />
                                            </div>
                                        )}
                                        <span>{props.macdEvaluation}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Momentum */}
                        {props.momentum10 !== undefined && props.momentumEvaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">Momentum 10</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.momentum10.toLocaleString()}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(props.momentumEvaluation) })}`}>
                                        {props.momentumEvaluation === "TĂNG" ? (
                                            <div className="rounded-full bg-green-100 p-0.5">
                                                <ArrowUpIcon className="h-3 w-3" />
                                            </div>
                                        ) : (
                                            <div className="rounded-full bg-red-100 p-0.5">
                                                <ArrowDownIcon className="h-3 w-3" />
                                            </div>
                                        )}
                                        <span>{props.momentumEvaluation}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trend indicators */}
                <div className="p-6 bg-gradient-to-br from-white to-gray-50 lg:w-1/2">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="p-1.5 rounded-lg bg-rose-50">
                            <TrendingUpIcon className="h-5 w-5 text-rose-500" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800">Nhóm chỉ báo xu hướng</h3>
                    </div>

                    <div className="space-y-4">
                        {/* ADX */}
                        {props.adx14 !== undefined && props.adxEvaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">ADX 14</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.adx14.toFixed(2)}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <span className={tagVariants({ variant: getEvaluationVariant(props.adxEvaluation) })}>
                                        {props.adxEvaluation}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* MA10 */}
                        {props.ma10 !== undefined && props.ma10Evaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">MA10</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.ma10.toLocaleString()}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(props.ma10Evaluation) })}`}>
                                        {props.ma10Evaluation === "TĂNG" ? (
                                            <div className="rounded-full bg-green-100 p-0.5">
                                                <ArrowUpIcon className="h-3 w-3" />
                                            </div>
                                        ) : (
                                            <div className="rounded-full bg-red-100 p-0.5">
                                                <ArrowDownIcon className="h-3 w-3" />
                                            </div>
                                        )}
                                        <span>{props.ma10Evaluation}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MA20 */}
                        {props.ma20 !== undefined && props.ma20Evaluation && (
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">MA20</p>
                                </div>
                                <div className="w-24 text-right">
                                    <p className="text-gray-700">{props.ma20.toLocaleString()}</p>
                                </div>
                                <div className="w-28 text-right">
                                    <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(props.ma20Evaluation) })}`}>
                                        {props.ma20Evaluation === "TĂNG" ? (
                                            <div className="rounded-full bg-green-100 p-0.5">
                                                <ArrowUpIcon className="h-3 w-3" />
                                            </div>
                                        ) : (
                                            <div className="rounded-full bg-red-100 p-0.5">
                                                <ArrowDownIcon className="h-3 w-3" />
                                            </div>
                                        )}
                                        <span>{props.ma20Evaluation}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MA50 */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">MA50</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.ma50.toLocaleString()}</p>
                            </div>
                            <div className="w-28 text-right">
                                <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(getMa50Evaluation()) })}`}>
                                    {getMa50Evaluation() === "TĂNG" ? (
                                        <div className="rounded-full bg-green-100 p-0.5">
                                            <ArrowUpIcon className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 p-0.5">
                                            <ArrowDownIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span>{getMa50Evaluation()}</span>
                                </div>
                            </div>
                        </div>

                        {/* MA100 */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">MA100</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.ma100.toLocaleString()}</p>
                            </div>
                            <div className="w-28 text-right">
                                <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(getMa100Evaluation()) })}`}>
                                    {getMa100Evaluation() === "TĂNG" ? (
                                        <div className="rounded-full bg-green-100 p-0.5">
                                            <ArrowUpIcon className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 p-0.5">
                                            <ArrowDownIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span>{getMa100Evaluation()}</span>
                                </div>
                            </div>
                        </div>

                        {/* MA200 */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">MA200</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.ma200.toLocaleString()}</p>
                            </div>
                            <div className="w-28 text-right">
                                <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(getMa200Evaluation()) })}`}>
                                    {getMa200Evaluation() === "TĂNG" ? (
                                        <div className="rounded-full bg-green-100 p-0.5">
                                            <ArrowUpIcon className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 p-0.5">
                                            <ArrowDownIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span>{getMa200Evaluation()}</span>
                                </div>
                            </div>
                        </div>

                        {/* HMA9 */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">HMA9</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.hma9.toLocaleString()}</p>
                            </div>
                            <div className="w-28 text-right">
                                <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(getHma9Evaluation()) })}`}>
                                    {getHma9Evaluation() === "TĂNG" ? (
                                        <div className="rounded-full bg-green-100 p-0.5">
                                            <ArrowUpIcon className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 p-0.5">
                                            <ArrowDownIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span>{getHma9Evaluation()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ichimoku */}
                        <div className="flex items-center">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">Ichimoku Base Line</p>
                            </div>
                            <div className="w-24 text-right">
                                <p className="text-gray-700">{props.ichimokuBaseLine.toLocaleString()}</p>
                            </div>
                            <div className="w-28 text-right">
                                <div className={`inline-flex items-center gap-1 ${tagVariants({ variant: getTrendVariant(getIchimokuEvaluation()) })}`}>
                                    {getIchimokuEvaluation() === "TĂNG" ? (
                                        <div className="rounded-full bg-green-100 p-0.5">
                                            <ArrowUpIcon className="h-3 w-3" />
                                        </div>
                                    ) : (
                                        <div className="rounded-full bg-red-100 p-0.5">
                                            <ArrowDownIcon className="h-3 w-3" />
                                        </div>
                                    )}
                                    <span>{getIchimokuEvaluation()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 
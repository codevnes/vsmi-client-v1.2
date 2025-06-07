"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowUpIcon, ArrowDownIcon, EyeIcon, BarChart3Icon, TrendingUpIcon, LineChart, AreaChart, InfoIcon, ShieldIcon, TimerIcon, AlertCircleIcon, CheckCircleIcon } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TradingRecommendationProps {
  id: string
  symbol: string
  analysisDate: string
  inputData: {
    data: any[]
    symbol: string
  }
  analysisResult: string
  tradingRecommendation: string
  suggestedBuyRange: string
  stopLossLevel: string
  createdAt: string
  updatedAt: string
}

export function TradingRecommendation(props: TradingRecommendationProps) {
  // Format date for display
  const analysisDate = new Date(props.analysisDate)
  const formattedDate = format(analysisDate, "dd/MM/yyyy", { locale: vi })
  
  // Extract recommendation status
  const recommendationStatus = props.analysisResult.includes("Quan sát") 
    ? "Quan sát / chờ mua" 
    : props.analysisResult.includes("Mua") 
      ? "Mua" 
      : props.analysisResult.includes("Bán") 
        ? "Bán" 
        : "Quan sát"

  // Extract key indicators from the latest data point
  const latestData = props.inputData.data[props.inputData.data.length - 1]
  
  // Extract volume trend
  const volumeTrend = props.inputData.data.length > 1 && 
    props.inputData.data[props.inputData.data.length - 1].volume > 
    props.inputData.data[props.inputData.data.length - 2].volume
    ? "Tăng"
    : "Giảm"

  // Format numbers with commas
  const formatNumber = (num: number) => num.toLocaleString('vi-VN')

  // Get recommendation badge variant and icon
  const getRecommendationVariant = () => {
    if (recommendationStatus.includes("Mua")) return "default"
    if (recommendationStatus.includes("Bán")) return "destructive"
    return "secondary"
  }

  const getRecommendationIcon = () => {
    if (recommendationStatus.includes("Mua")) return <CheckCircleIcon className="h-4 w-4" />
    if (recommendationStatus.includes("Bán")) return <AlertCircleIcon className="h-4 w-4" />
    return <EyeIcon className="h-4 w-4" />
  }

  // Get recommendation status colors for styling
  const getRecommendationColors = () => {
    if (recommendationStatus.includes("Mua")) {
      return {
        border: "border-green-200",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        text: "text-green-600",
      }
    }
    if (recommendationStatus.includes("Bán")) {
      return {
        border: "border-red-200",
        bg: "bg-red-50",
        iconBg: "bg-red-100",
        text: "text-red-600",
      }
    }
    return {
      border: "border-orange-200",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      text: "text-orange-600",
    }
  }

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    return trend === "Tăng" 
      ? <ArrowUpIcon className="h-4 w-4 text-green-500" /> 
      : <ArrowDownIcon className="h-4 w-4 text-red-500" />
  }

  // Process markdown sections for better display
  const processMarkdown = () => {
    const analysis = props.analysisResult
    const sections = [
      { 
        title: "Khuyến nghị giao dịch", 
        icon: <BarChart3Icon className="h-5 w-5 text-blue-500" />,
        content: analysis.split("2. **Kết luận tổng hợp")[0].replace("1. **Khuyến nghị giao dịch:**", "")
      },
      { 
        title: "Kết luận tổng hợp", 
        icon: <InfoIcon className="h-5 w-5 text-purple-500" />,
        content: analysis.includes("2. **Kết luận tổng hợp") 
          ? analysis.split("2. **Kết luận tổng hợp")[1] 
          : ""
      }
    ]
    
    return sections
  }

  const analysisSections = processMarkdown()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full border border-slate-100 rounded-xl shadow-sm overflow-hidden bg-white">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <CardHeader className="px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center">
                  <motion.div 
                    className="w-1 h-8 bg-slate-800 rounded-full mr-4"
                    animate={{ height: [28, 32, 28] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  ></motion.div>
                  <div>
                    <div className="flex items-center gap-3">
                      <motion.h2 
                        className="text-2xl font-bold text-slate-800"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {props.symbol}
                      </motion.h2>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Badge 
                          variant={getRecommendationVariant()} 
                          className={cn(
                            "text-md px-4 py-1.5 font-semibold shadow-sm flex items-center gap-1.5 transition-all duration-200",
                            "animate-pulse-subtle"
                          )}
                        >
                          {getRecommendationIcon()}
                          {recommendationStatus}
                        </Badge>
                      </motion.div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">Ngày phân tích: {formattedDate}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-0">
            {/* Recommendation Status - Featured Section */}
            <motion.div 
              className={cn(
                "m-6 mb-2 p-5 rounded-lg border",
                getRecommendationColors().border,
                getRecommendationColors().bg,
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className={cn(
                      "p-3 rounded-full",
                      getRecommendationColors().iconBg
                    )}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      {getRecommendationIcon()}
                    </motion.div>
                  </motion.div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-600">Khuyến nghị</h3>
                    <p className={cn(
                      "text-xl font-bold",
                      getRecommendationColors().text
                    )}>
                      {recommendationStatus}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <motion.div 
                    className="rounded-lg bg-white/80 backdrop-blur-sm p-3"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-green-50">
                        <TrendingUpIcon className="h-4 w-4 text-green-500" />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-700">Vùng giá mua</h3>
                    </div>
                    <p className="text-base font-bold text-green-600">
                      {props.suggestedBuyRange.replace("**", "")}
                    </p>
                  </motion.div>

                  <motion.div 
                    className="rounded-lg bg-white/80 backdrop-blur-sm p-3"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-1.5 rounded-lg bg-red-50">
                        <ShieldIcon className="h-4 w-4 text-red-500" />
                      </div>
                      <h3 className="text-xs font-semibold text-slate-700">Cắt lỗ</h3>
                    </div>
                    <p className="text-base font-bold text-red-600">
                      {props.stopLossLevel.replace("**", "")}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 pt-2">
              {/* Volume */}
              <motion.div 
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="p-1.5 rounded-lg bg-blue-50"
                    animate={{ rotate: [0, 10, 0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  >
                    <AreaChart className="h-4 w-4 text-blue-500" />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-slate-700">Khối lượng giao dịch</h3>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-slate-700">
                    {formatNumber(latestData.volume)}
                  </p>
                  <motion.div 
                    className="flex items-center gap-1 text-sm"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {getTrendIcon(volumeTrend)}
                    <span className={volumeTrend === "Tăng" ? "text-green-600" : "text-red-600"}>
                      {volumeTrend}
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Key Indicators */}
              <motion.div 
                className="rounded-lg border border-slate-100 bg-slate-50 p-4 col-span-1 md:col-span-2 lg:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div 
                    className="p-1.5 rounded-lg bg-purple-50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <LineChart className="h-4 w-4 text-purple-500" />
                  </motion.div>
                  <h3 className="text-sm font-semibold text-slate-700">Chỉ báo nổi bật</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <motion.div 
                    className="flex flex-col bg-white rounded-md p-2 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-slate-600 text-xs">RSI</span>
                    <span className="font-medium">{latestData.rsi14.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">(yếu)</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col bg-white rounded-md p-2 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-slate-600 text-xs">ADX</span>
                    <span className="font-medium">{latestData.adx14.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">(xu hướng yếu)</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col bg-white rounded-md p-2 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-slate-600 text-xs">MACD Hist</span>
                    <span className="font-medium">{latestData.macdHistogram.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">{latestData.macdHistogram > 0 ? "(tích cực)" : "(tiêu cực)"}</span>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col bg-white rounded-md p-2 shadow-sm"
                    whileHover={{ y: -2 }}
                  >
                    <span className="text-slate-600 text-xs">Stoch RSI</span>
                    <span className="font-medium">{latestData.stochRsiK.toFixed(2)}</span>
                    <span className="text-xs text-slate-500">&nbsp;</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Analysis Tabs */}
            <motion.div 
              className="p-6 pt-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="mb-4 grid grid-cols-2 w-full md:w-auto bg-slate-100">
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-white">
                    <BarChart3Icon className="h-4 w-4 mr-2" />
                    Phân tích kỹ thuật
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="data-[state=active]:bg-white">
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Tóm tắt tổng hợp
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="mt-0">
                  <motion.div 
                    className="bg-white rounded-lg p-4 border border-slate-100 prose prose-slate max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div 
                        className="p-1.5 rounded-lg bg-blue-50"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      >
                        {analysisSections[0].icon}
                      </motion.div>
                      <h3 className="text-base font-semibold text-slate-800 m-0">
                        {analysisSections[0].title}
                      </h3>
                    </div>
                    <div className="text-sm text-slate-700 markdown-content pl-9">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {analysisSections[0].content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                </TabsContent>
                
                <TabsContent value="summary" className="mt-0">
                  <motion.div 
                    className="bg-white rounded-lg p-4 border border-slate-100 prose prose-slate max-w-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div 
                        className="p-1.5 rounded-lg bg-purple-50"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      >
                        {analysisSections[1].icon}
                      </motion.div>
                      <h3 className="text-base font-semibold text-slate-800 m-0">
                        {analysisSections[1].title}
                      </h3>
                    </div>
                    <div className="text-sm text-slate-700 markdown-content pl-9">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {analysisSections[1].content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 
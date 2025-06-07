import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FundamentalDataType } from "@/lib/mock-data";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FscoreRadarChart } from "./radar-chart";

interface FundamentalAnalysisProps extends FundamentalDataType {
  updateDate?: Date;
}

export function FundamentalAnalysis({
  symbol,
  roa,
  cfo,
  deltaRoa,
  cfoMinusNetProfit,
  deltaLongTermDebt,
  deltaCurrentRatio,
  newlyIssuedShares,
  deltaGrossMargin,
  deltaAssetTurnover,
  roaPositive,
  cfoPositive,
  deltaRoaPositive,
  cfoGreaterThanNetProfit,
  deltaLongTermDebtNegative,
  deltaCurrentRatioPositive,
  noNewSharesIssued,
  deltaGrossMarginPositive,
  deltaAssetTurnoverPositive,
  updateDate = new Date(),
}: FundamentalAnalysisProps) {
  // Calculate F-Score
  const profitabilityScore = [roaPositive, cfoPositive, deltaRoaPositive, cfoGreaterThanNetProfit]
    .filter(Boolean).length;
  const leverageScore = [deltaLongTermDebtNegative, deltaCurrentRatioPositive, noNewSharesIssued]
    .filter(Boolean).length;
  const efficiencyScore = [deltaGrossMarginPositive, deltaAssetTurnoverPositive]
    .filter(Boolean).length;
  const totalScore = profitabilityScore + leverageScore + efficiencyScore;

  // Format numbers for display
  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 1000) {
      return `${(num / 1000).toFixed(2)} tỷ VND`;
    }
    return `${num.toFixed(2)}%`;
  };

  // Data for radar chart
  const radarData = [
    {
      subject: "ROA dương",
      value: roaPositive ? 1 : 0,
    },
    {
      subject: "CFO dương",
      value: cfoPositive ? 1 : 0,
    },
    {
      subject: "ΔROA tăng",
      value: deltaRoaPositive ? 1 : 0,
    },
    {
      subject: "CFO > LNST",
      value: cfoGreaterThanNetProfit ? 1 : 0,
    },
    {
      subject: "Nợ DH giảm",
      value: deltaLongTermDebtNegative ? 1 : 0,
    },
    {
      subject: "Thanh khoản tăng",
      value: deltaCurrentRatioPositive ? 1 : 0,
    },
    {
      subject: "Không phát hành CP",
      value: noNewSharesIssued ? 1 : 0,
    },
    {
      subject: "LN gộp tăng",
      value: deltaGrossMarginPositive ? 1 : 0,
    },
    {
      subject: "Vòng quay TS tăng",
      value: deltaAssetTurnoverPositive ? 1 : 0,
    },
  ];

  return (
    <Card className="w-full border-none shadow-0 bg-white/80 backdrop-blur-sm">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
        <CardHeader className="px-6 py-4">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-gray-800 rounded-full mr-4"></div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800">Phân tích cơ bản</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Cập nhật:  {format(updateDate, "dd/MM/yyyy", { locale: vi })}</p>
            </div>
          </div>
        </CardHeader>
      </div>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Financial indicators */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Chỉ số tài chính</h3>

            {/* Group A: Profitability */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm bg-primary/10 px-3 py-1.5 rounded-md inline-block">A. Khả năng sinh lời</h4>
              <div className="space-y-2 text-sm pl-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tỷ suất lợi nhuận trên tài sản:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    roa > 0 ? "text-green-600 bg-green-50" :
                      roa < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {(roa * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dòng tiền từ hoạt động kinh doanh:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    cfo > 0 ? "text-green-600 bg-green-50" :
                      cfo < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {formatNumber(cfo)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tăng trưởng ROA so với năm trước:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    deltaRoa > 0 ? "text-green-600 bg-green-50" :
                      deltaRoa < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {deltaRoa > 0 ? "+" : ""}{(deltaRoa * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">So sánh dòng tiền KD với LNST:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    cfoMinusNetProfit > 0 ? "text-green-600 bg-green-50" :
                      cfoMinusNetProfit < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {cfoMinusNetProfit > 0 ? "+" : ""}{formatNumber(cfoMinusNetProfit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Group B: Leverage & Liquidity */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm bg-primary/10 px-3 py-1.5 rounded-md inline-block">B. Đòn bẩy & thanh khoản</h4>
              <div className="space-y-2 text-sm pl-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Nợ dài hạn giảm:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    deltaLongTermDebt < 0 ? "text-green-600 bg-green-50" :
                      deltaLongTermDebt > 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {formatNumber(deltaLongTermDebt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tăng hệ số thanh toán hiện hành:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    deltaCurrentRatio > 0 ? "text-green-600 bg-green-50" :
                      deltaCurrentRatio < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {deltaCurrentRatio > 0 ? "+" : ""}{(deltaCurrentRatio * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Phát hành cổ phiếu mới:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    newlyIssuedShares > 0 ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                  )}>
                    {newlyIssuedShares > 0 ? newlyIssuedShares.toLocaleString() : "Không"}
                  </span>
                </div>
              </div>
            </div>

            {/* Group C: Operating Efficiency */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm bg-primary/10 px-3 py-1.5 rounded-md inline-block">C. Hiệu quả hoạt động</h4>
              <div className="space-y-2 text-sm pl-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tăng trưởng biên lợi nhuận gộp:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    deltaGrossMargin > 0 ? "text-green-600 bg-green-50" :
                      deltaGrossMargin < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {deltaGrossMargin > 0 ? "+" : ""}{(deltaGrossMargin * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tăng trưởng vòng quay tài sản:</span>
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded",
                    deltaAssetTurnover > 0 ? "text-green-600 bg-green-50" :
                      deltaAssetTurnover < 0 ? "text-red-600 bg-red-50" : ""
                  )}>
                    {deltaAssetTurnover > 0 ? "+" : ""}{(deltaAssetTurnover * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle column - F-Score Radar Chart */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-4 self-stretch text-center">Biểu đồ F-Score</h3>
            <div className="flex-1 flex items-center justify-center w-full">
              <FscoreRadarChart data={radarData} />
            </div>
          </div>

          {/* Right column - F-Score Points Table */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Bảng điểm F-Score</h3>
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Sinh lời:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < profitabilityScore ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-xl font-bold">{profitabilityScore}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Đòn bẩy:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < leverageScore ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-xl font-bold">{leverageScore}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Hiệu quả:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < efficiencyScore ? 'bg-primary' : 'bg-gray-200'}`}></div>
                    ))}
                  </div>
                  <span className="text-xl font-bold">{efficiencyScore}</span>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-semibold text-slate-900">Tổng điểm:</span>
                <div className="bg-primary/10 px-4 py-2 rounded-lg">
                  <span className="text-3xl font-bold text-primary">{totalScore}/9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
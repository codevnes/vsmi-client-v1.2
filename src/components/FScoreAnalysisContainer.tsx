"use client";

import { useFScoreAnalysis } from "@/hooks/useFScoreAnalysis";
import { FScoreAnalysis } from "@/components/ui/f-score-analysis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface FScoreAnalysisContainerProps {
  symbol: string;
}

export function FScoreAnalysisContainer({ symbol }: FScoreAnalysisContainerProps) {
  const { data, isLoading, error } = useFScoreAnalysis(symbol);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>
          Không thể tải dữ liệu phân tích F-Score. {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Thông báo</AlertTitle>
        <AlertDescription>
          Không có dữ liệu phân tích F-Score cho cổ phiếu {symbol}.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <FScoreAnalysis
      symbol={data.symbol}
      analysisDate={data.analysisDate}
      totalScore={data.totalScore}
      pe={data.pe}
      peIndustry={data.peIndustry}
      categories={data.categories}
      swot={data.swot}
      fullAnalysis={data.fullAnalysis}
    />
  );
} 
import { useState, useEffect } from "react";
import { FScoreAnalysisData } from "@/types/fscore";
import { fscoreService } from "@/services/fscore.service";

interface UseFScoreAnalysisResult {
  data: FScoreAnalysisData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useFScoreAnalysis(symbol: string): UseFScoreAnalysisResult {
  const [data, setData] = useState<FScoreAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fscoreService.getFScoreAnalysis(symbol);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Lỗi không xác định'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchData();
    }
  }, [symbol]);

  const refetch = async () => {
    await fetchData();
  };

  return { data, isLoading, error, refetch };
} 
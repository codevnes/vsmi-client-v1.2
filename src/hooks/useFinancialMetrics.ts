'use client';

import { useState, useEffect } from 'react';
import { FinancialIndicator, fetchFinancialIndicators } from '@/services/financialMetricsService';

/**
 * Custom hook to fetch and manage financial metrics data
 * @param symbol The stock symbol to fetch data for
 * @returns Object with loading state, error state, and financial metrics data
 */
export function useFinancialMetrics(symbol: string) {
  const [data, setData] = useState<FinancialIndicator[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const financialData = await fetchFinancialIndicators(symbol);
        
        if (isMounted) {
          setData(financialData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { data, isLoading, error };
} 
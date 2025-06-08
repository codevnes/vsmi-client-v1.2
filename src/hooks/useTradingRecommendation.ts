'use client';

import { useState, useEffect } from 'react';
import { TradingRecommendation, fetchStockData, extractTradingRecommendation } from '@/services/stockService';

/**
 * Custom hook to fetch and manage trading recommendation data
 * @param symbol The stock symbol to fetch data for
 * @returns Object with loading state, error state, and trading recommendation data
 */
export function useTradingRecommendation(symbol: string) {
  const [data, setData] = useState<TradingRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const stockData = await fetchStockData(symbol);
        const recommendationData = extractTradingRecommendation(stockData);
        
        if (isMounted) {
          setData(recommendationData);
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
'use client';

import { useState, useEffect } from 'react';
import { StockProfile, fetchStockProfile } from '@/services/stockProfileService';

/**
 * Custom hook to fetch and manage stock profile data
 * @param symbol The stock symbol to fetch data for
 * @returns Object with loading state, error state, and stock profile data
 */
export function useStockProfile(symbol: string) {
  const [data, setData] = useState<StockProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const stockProfileData = await fetchStockProfile(symbol);
        
        if (isMounted) {
          setData(stockProfileData);
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
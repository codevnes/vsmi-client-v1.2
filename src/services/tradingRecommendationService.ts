// Define the trading recommendation type
export interface TradingRecommendation {
  id: string;
  symbol: string;
  analysisDate: string;
  inputData: {
    data: any[];
    symbol: string;
  };
  analysisResult: string;
  tradingRecommendation: string;
  suggestedBuyRange: string;
  stopLossLevel: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetches trading recommendation data for a given stock symbol
 * @param symbol The stock symbol to fetch data for
 * @returns Promise with the trading recommendation data
 */
export async function fetchTradingRecommendation(symbol: string): Promise<TradingRecommendation | null> {
  try {
    const response = await fetch(`http://localhost:3030/api/chatgpt-analyses/${symbol}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`No trading recommendation found for ${symbol}`);
        return null;
      }
      throw new Error(`Failed to fetch trading recommendation: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the response is directly usable or needs to be extracted from a wrapper
    if (data && typeof data === 'object') {
      // Some APIs wrap the data in a data property
      if (data.data && typeof data.data === 'object') {
        return data.data;
      }
      // Otherwise return the data object directly
      return data;
    }
    
    throw new Error('Invalid trading recommendation data format');
  } catch (error) {
    console.error(`Error fetching trading recommendation for ${symbol}:`, error);
    return null;
  }
} 
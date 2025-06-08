// Define the stock profile type
export interface StockProfile {
  symbol: string;
  price: number;
  profit: number;
  volume: number;
  pe: number;
  eps: number;
  roa: number;
  roe: number;
  stock: {
    name: string;
    exchange: string;
    industry: string;
  };
}

/**
 * Fetches stock profile data for a given stock symbol
 * @param symbol The stock symbol to fetch data for
 * @returns Promise with the stock profile data
 */
export async function fetchStockProfile(symbol: string): Promise<StockProfile> {
  try {
    const response = await fetch(`http://localhost:3030/api/stock-profiles/${symbol}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock profile: ${response.status}`);
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
    
    throw new Error('Invalid stock profile data format');
  } catch (error) {
    console.error(`Error fetching stock profile for ${symbol}:`, error);
    
    // Return a default profile as fallback
    return {
      symbol: symbol,
      price: 0,
      profit: 0,
      volume: 0,
      pe: 0,
      eps: 0,
      roa: 0,
      roe: 0,
      stock: {
        name: "Unknown",
        exchange: "Unknown",
        industry: "Unknown"
      }
    };
  }
} 
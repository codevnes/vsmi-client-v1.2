// Define the financial indicator type
export interface FinancialIndicator {
  id: string;
  symbol: string;
  year: number;
  quarter: number | null;
  eps: number;
  epsIndustry: number | null;
  pe: number | null;
  peIndustry: number | null;
  roa: number;
  roe: number;
  roaIndustry: number | null;
  roeIndustry: number | null;
  revenue: number | null;
  margin: number | null;
  totalDebtToEquity: number;
  totalAssetsToEquity: number;
  createdAt: string;
  updatedAt: string;
  stock: {
    name: string;
    exchange: string;
  };
}

/**
 * Fetches financial indicators data for a given stock symbol
 * @param symbol The stock symbol to fetch data for
 * @returns Promise with an array of financial indicators
 */
export async function fetchFinancialIndicators(symbol: string): Promise<FinancialIndicator[]> {
  try {
    const response = await fetch(`http://localhost:3030/api/financial-metrics/${symbol}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch financial metrics: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if the response is an array, if not, try to extract the array from the response
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // Check if the data has a property that contains an array
      // Common API patterns include { data: [...] }, { results: [...] }, etc.
      const possibleArrayKeys = ['data', 'results', 'items', 'metrics', 'indicators', 'financialIndicators'];
      
      for (const key of possibleArrayKeys) {
        if (data[key] && Array.isArray(data[key])) {
          return data[key];
        }
      }
      
      // If no array is found but the object is iterable, convert it to an array
      if (Object.keys(data).length > 0) {
        console.warn('API returned an object instead of an array. Attempting to convert to array.');
        return [data].filter(item => item !== null && typeof item === 'object');
      }
    }
    
    console.warn('API did not return valid financial metrics data. Returning empty array.');
    return [];
  } catch (error) {
    console.error(`Error fetching financial metrics for ${symbol}:`, error);
    return [];
  }
} 
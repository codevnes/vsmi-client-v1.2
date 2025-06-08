import { FScoreAnalysisData, FScoreRawData } from "@/types/fscore";
import { prepareFScoreData } from "@/lib/fscore-utils";
import { fetchStockData, extractFScoreAnalysis } from "./stockDataService";

export const fscoreService = {
  /**
   * Lấy dữ liệu phân tích F-Score cho một mã chứng khoán
   */
  async getFScoreAnalysis(symbol: string): Promise<FScoreAnalysisData | null> {
    try {
      // Fetch all stock data from the combined API endpoint
      const stockData = await fetchStockData(symbol);
      
      // Extract F-Score data
      const fscoreData = extractFScoreAnalysis(stockData);
      
      if (!fscoreData) {
        console.warn(`No F-Score data found for ${symbol}`);
        return null;
      }
      
      // Process the raw data into the format needed by the component
      return prepareFScoreData(fscoreData as unknown as FScoreRawData);
    } catch (error) {
      console.error(`Lỗi khi lấy dữ liệu F-Score cho ${symbol}:`, error);
      throw error;
    }
  }
}; 
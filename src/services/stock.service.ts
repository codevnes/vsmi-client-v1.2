import { Stock, StockDetail, StockListResponse, StockDetailResponse, StockSearchParams } from "@/types/stock";
import { API_BASE_URL } from "@/config/api";

const API_URL = `${API_BASE_URL}/api`;

export const stockService = {
  /**
   * Lấy danh sách chứng khoán với phân trang và tìm kiếm
   */
  async getStocks(params: StockSearchParams = {}): Promise<StockListResponse> {
    
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.exchange) searchParams.append("exchange", params.exchange);
    if (params.industry) searchParams.append("industry", params.industry);
    
    const url = `${API_URL}/stocks?${searchParams.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return await response.json();
  },
  
  /**
   * Tìm kiếm cổ phiếu theo từ khóa
   */
  async searchStocks(query: string, limit: number = 5): Promise<Stock[]> {
    try {
      const response = await this.getStocks({
        search: query,
        limit: limit,
        page: 1
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tìm kiếm cổ phiếu:", error);
      return [];
    }
  },
  
  /**
   * Lấy thông tin chi tiết của một mã chứng khoán
   */
  async getStockBySymbol(symbol: string): Promise<StockDetail> {
    
    const response = await fetch(`${API_URL}/stocks/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data: StockDetailResponse = await response.json();
    return data.stock;
  }
}; 
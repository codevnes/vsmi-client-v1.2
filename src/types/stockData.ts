export interface StockData {
  id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trendQ: number;
  fq: number;
  bandDown: number | null;
  bandUp: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface StockDataResponse {
  message: string;
  data: StockData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StockDataParams {
  symbol: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
} 
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  profile?: StockProfile;
}

export interface StockProfile {
  id: string;
  symbol: string;
  price: number;
  profit: number;
  volume: number;
  pe: number;
}

export interface FinancialMetrics {
  id: string;
  symbol: string;
  year: number;
  quarter: number;
  eps: number;
  pe: number;
  roe: number;
  roa: number;
}

export interface StockDetail extends Stock {
  financialMetrics?: FinancialMetrics[];
}

export interface StockSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  exchange?: string;
  industry?: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockListResponse {
  message: string;
  data: Stock[];
  pagination: PaginationData;
}

export interface StockDetailResponse {
  message: string;
  stock: StockDetail;
} 
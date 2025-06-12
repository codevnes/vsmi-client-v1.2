import { SelectedStocksQueryParams, SelectedStocksResponse } from "@/types/selectedStocks";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getSelectedStocks(params: SelectedStocksQueryParams = {}): Promise<SelectedStocksResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.sort) queryParams.append('sort', params.sort);
  if (params.order) queryParams.append('order', params.order);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const url = `${API_BASE_URL}/selected-stocks${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error fetching selected stocks: ${response.statusText}`);
  }
  
  return response.json();
} 
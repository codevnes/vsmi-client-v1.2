// marketData.ts - Utility for generating mock market data

// Function to generate random value between min and max
function randomValue(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Function to generate random percentage change between min and max
function randomPercentage(min: number, max: number): number {
  return parseFloat(randomValue(min, max).toFixed(2));
}

// Function to format date to YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Interface for stock data
export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change: number;
  changePercent: number;
}

// Interface for index data
export interface IndexData {
  date: string;
  value: number;
  change: number;
  changePercent: number;
  advancers: number;
  decliners: number;
  unchanged: number;
  totalVolume: number;
  totalValue: number;
}

// Interface for company data
export interface CompanyData {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividend: number;
  yearlyData: StockData[];
}

// Generate daily data for a stock/index
function generateDailyData(
  startDate: Date,
  endDate: Date,
  initialValue: number,
  volatility: number
): StockData[] {
  const data: StockData[] = [];
  let currentDate = new Date(startDate);
  let previousClose = initialValue;

  while (currentDate <= endDate) {
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
      currentDate.setDate(currentDate.getDate() + 1);
      continue;
    }

    // Generate random change percentage based on volatility
    const changePercent = randomPercentage(-volatility, volatility);
    const change = parseFloat((previousClose * (changePercent / 100)).toFixed(2));
    const close = parseFloat((previousClose + change).toFixed(2));

    // Ensure we don't go below a minimum value
    const finalClose = Math.max(close, previousClose * 0.5);
    
    // Generate high, low, open values
    const high = parseFloat((finalClose * (1 + randomValue(0, 0.03))).toFixed(2));
    const low = parseFloat((finalClose * (1 - randomValue(0, 0.03))).toFixed(2));
    const open = parseFloat(randomValue(low, high).toFixed(2));

    // Generate volume
    const volume = Math.floor(randomValue(100000, 10000000));

    data.push({
      date: formatDate(currentDate),
      open,
      high,
      low,
      close: finalClose,
      volume,
      change: parseFloat((finalClose - previousClose).toFixed(2)),
      changePercent: parseFloat(((finalClose - previousClose) * 100 / previousClose).toFixed(2))
    });

    previousClose = finalClose;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
}

// Generate data for a market index
export function generateIndexData(
  name: string,
  startDate: Date,
  endDate: Date,
  initialValue: number,
  volatility: number
): { name: string; data: IndexData[] } {
  const stockData = generateDailyData(startDate, endDate, initialValue, volatility);
  
  const indexData: IndexData[] = stockData.map(day => {
    const advancers = Math.floor(randomValue(100, 300));
    const decliners = Math.floor(randomValue(50, 250));
    const unchanged = Math.floor(randomValue(10, 50));
    
    return {
      date: day.date,
      value: day.close,
      change: day.change,
      changePercent: day.changePercent,
      advancers,
      decliners,
      unchanged,
      totalVolume: day.volume * 1000,
      totalValue: day.volume * day.close * 10000
    };
  });
  
  return { name, data: indexData };
}

// Generate data for a list of stocks
export function generateStocksData(count: number): CompanyData[] {
  const sectors = [
    'Ngân hàng', 'Bất động sản', 'Chứng khoán', 'Dầu khí', 
    'Xây dựng', 'Bán lẻ', 'Công nghệ', 'Sản xuất', 'Tiêu dùng', 
    'Y tế', 'Viễn thông', 'Vận tải', 'Thép', 'Điện', 'Thực phẩm'
  ];
  
  const companyPrefixes = ['Tập đoàn', 'Công ty', 'Tổng công ty'];
  const companyTypes = ['Cổ phần', 'TNHH', 'Đầu tư'];
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 5);
  
  const result: CompanyData[] = [];
  
  for (let i = 0; i < count; i++) {
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const symbol = generateRandomSymbol();
    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const type = companyTypes[Math.floor(Math.random() * companyTypes.length)];
    const name = `${prefix} ${type} ${generateRandomName(sector)}`;
    
    const initialValue = parseFloat(randomValue(10, 100).toFixed(2));
    const volatility = randomValue(0.5, 3);
    
    const yearlyData = generateDailyData(startDate, endDate, initialValue, volatility);
    const lastPrice = yearlyData[yearlyData.length - 1].close;
    
    result.push({
      symbol,
      name,
      sector,
      marketCap: parseFloat((lastPrice * randomValue(10000000, 1000000000)).toFixed(0)),
      peRatio: parseFloat(randomValue(5, 30).toFixed(2)),
      eps: parseFloat(randomValue(1000, 10000).toFixed(0)),
      dividend: parseFloat(randomValue(0, 10).toFixed(2)),
      yearlyData
    });
  }
  
  return result;
}

// Generate random stock symbol (3-4 letters)
function generateRandomSymbol(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const length = Math.random() > 0.5 ? 3 : 4;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

// Generate random company name based on sector
function generateRandomName(sector: string): string {
  const sectorKeywords: Record<string, string[]> = {
    'Ngân hàng': ['Việt Thịnh', 'Phát Đạt', 'Thương mại', 'Quốc tế', 'Đầu tư'],
    'Bất động sản': ['Địa ốc', 'Phát triển', 'Xây dựng', 'Đô thị', 'Đất Việt'],
    'Chứng khoán': ['Tài chính', 'Đầu tư', 'Chứng khoán', 'Quản lý quỹ', 'Tư vấn'],
    'Dầu khí': ['Dầu khí', 'Năng lượng', 'Xăng dầu', 'Khí đốt', 'Hóa dầu'],
    'Xây dựng': ['Xây dựng', 'Phát triển', 'Kiến trúc', 'Cơ khí', 'Công trình'],
    'Bán lẻ': ['Thương mại', 'Bán lẻ', 'Siêu thị', 'Chuỗi cửa hàng', 'Thị trường'],
    'Công nghệ': ['Công nghệ', 'Phần mềm', 'Giải pháp', 'Tích hợp', 'Kỹ thuật số'],
    'Sản xuất': ['Sản xuất', 'Chế tạo', 'Thiết bị', 'Máy móc', 'Công nghiệp'],
    'Tiêu dùng': ['Tiêu dùng', 'Hàng hóa', 'Sản phẩm', 'Dịch vụ', 'Gia dụng'],
    'Y tế': ['Y tế', 'Dược phẩm', 'Thiết bị y tế', 'Bệnh viện', 'Chăm sóc sức khỏe'],
    'Viễn thông': ['Viễn thông', 'Truyền thông', 'Thông tin', 'Mạng lưới', 'Kết nối'],
    'Vận tải': ['Vận tải', 'Logistics', 'Giao thông', 'Kho vận', 'Vận chuyển'],
    'Thép': ['Thép', 'Kim loại', 'Luyện kim', 'Cơ khí', 'Vật liệu'],
    'Điện': ['Điện lực', 'Năng lượng', 'Phát điện', 'Điện năng', 'Năng lượng tái tạo'],
    'Thực phẩm': ['Thực phẩm', 'Đồ uống', 'Nông sản', 'Chế biến', 'Xuất khẩu']
  };
  
  const keywords = sectorKeywords[sector] || ['Việt Nam', 'Phát triển', 'Thành công', 'Tiên phong'];
  const keyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  return `${keyword} ${sector}`;
}

// Generate 5 years of data for the main Vietnamese stock market indices
export function generateMarketIndicesData(): { vnIndex: IndexData[]; hnxIndex: IndexData[]; upcomIndex: IndexData[] } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 5);
  
  const vnIndex = generateIndexData('VN-Index', startDate, endDate, 1000, 1.5);
  const hnxIndex = generateIndexData('HNX-Index', startDate, endDate, 200, 2);
  const upcomIndex = generateIndexData('UPCOM-Index', startDate, endDate, 80, 2.5);
  
  return {
    vnIndex: vnIndex.data,
    hnxIndex: hnxIndex.data,
    upcomIndex: upcomIndex.data
  };
}

// Generate a complete dataset with indices and stocks
export function generateCompleteMarketData(stockCount = 100): {
  indices: { vnIndex: IndexData[]; hnxIndex: IndexData[]; upcomIndex: IndexData[] };
  stocks: CompanyData[];
} {
  return {
    indices: generateMarketIndicesData(),
    stocks: generateStocksData(stockCount)
  };
}

// Export a default function to get 5 years of market data
export default function getMarketData(stockCount = 100) {
  return generateCompleteMarketData(stockCount);
} 
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  pe: number;
  eps: number;
  roe: number;
  sparkline: number[];
  volume?: number;
}

export const bestStocks: StockData[] = [
  {
    symbol: "FPT",
    name: "FPT Corporation",
    price: 125600,
    change: 3.2,
    pe: 18.2,
    eps: 6870,
    roe: 22.4,
    volume: 1342500,
    sparkline: [118400, 119800, 123000, 121500, 122800, 124100, 125600],
  },
  {
    symbol: "VNM",
    name: "Vinamilk",
    price: 74200,
    change: -1.3,
    pe: 15.7,
    eps: 4800,
    roe: 18.2,
    volume: 985300,
    sparkline: [76500, 75800, 75200, 74700, 74500, 74300, 74200],
  },
  {
    symbol: "VHM",
    name: "Vinhomes",
    price: 46300,
    change: 2.1,
    pe: 9.2,
    eps: 4950,
    roe: 15.6,
    volume: 1156700,
    sparkline: [44100, 44800, 45300, 45900, 46100, 46200, 46300],
  },
  {
    symbol: "MWG",
    name: "Mobile World Group",
    price: 53800,
    change: 4.1,
    pe: 14.5,
    eps: 3635,
    roe: 19.8,
    volume: 892400,
    sparkline: [49600, 50400, 51200, 52100, 52800, 53500, 53800],
  },
  {
    symbol: "VIC",
    name: "Vingroup",
    price: 67100,
    change: -2.4,
    pe: 21.2,
    eps: 3215,
    roe: 12.4,
    volume: 765800,
    sparkline: [70100, 69600, 69000, 68500, 68100, 67600, 67100],
  },
  {
    symbol: "HPG",
    name: "Hòa Phát Group",
    price: 28900,
    change: 3.5,
    pe: 11.8,
    eps: 2415,
    roe: 16.7,
    volume: 1587600,
    sparkline: [26800, 27200, 27600, 28100, 28400, 28700, 28900],
  },
]; 
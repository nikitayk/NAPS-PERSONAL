import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastUpdated: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
}

export interface ChartData {
  dates: string[];
  prices: number[];
  volumes: number[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

class MarketService {
  private async request<T>(endpoint: string, options = {}): Promise<T> {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_URL}${endpoint}`,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        ...options,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }

  async getQuote(symbol: string): Promise<MarketQuote> {
    return this.request<MarketQuote>(`/stock-quote?symbol=${symbol}`);
  }

  async getChartData(symbol: string, timeframe: '1D' | '1W' | '1M' | '1Y' = '1D'): Promise<ChartData> {
    return this.request<ChartData>(`/price-chart?symbol=${symbol}&timeframe=${timeframe}`);
  }

  async getMarketStatus(): Promise<MarketIndex[]> {
    return this.request<MarketIndex[]>('/market-status');
  }

  async getPopularStocks(): Promise<MarketQuote[]> {
    return this.request<MarketQuote[]>('/popular-stocks');
  }

  async searchStocks(query: string): Promise<{ symbol: string; name: string }[]> {
    return this.request<{ symbol: string; name: string }[]>(`/search-stocks?q=${query}`);
  }

  async getWatchlist(): Promise<MarketQuote[]> {
    return this.request<MarketQuote[]>('/watchlist');
  }

  async addToWatchlist(symbol: string): Promise<void> {
    return this.request<void>('/watchlist/add', {
      method: 'POST',
      data: { symbol },
    });
  }

  async removeFromWatchlist(symbol: string): Promise<void> {
    return this.request<void>('/watchlist/remove', {
      method: 'POST',
      data: { symbol },
    });
  }
}

export const marketService = new MarketService(); 
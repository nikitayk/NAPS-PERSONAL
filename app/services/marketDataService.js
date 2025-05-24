// marketDataService.js - Market data fetching service integrated with backend API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Generic API request handler
   */
  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Get market overview data
   */
  async getMarketOverview() {
    const cacheKey = 'market_overview';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/overview');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get market indices (S&P 500, NASDAQ, DOW, etc.)
   */
  async getMarketIndices() {
    const cacheKey = 'market_indices';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/indices');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get trending stocks
   */
  async getTrendingStocks(limit = 10) {
    const cacheKey = `trending_stocks_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/market/trending?limit=${limit}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get market movers (gainers, losers, most active)
   */
  async getMarketMovers(type = 'gainers', limit = 10) {
    const cacheKey = `market_movers_${type}_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/market/movers?type=${type}&limit=${limit}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get sector performance
   */
  async getSectorPerformance() {
    const cacheKey = 'sector_performance';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/sectors');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get market news
   */
  async getMarketNews(limit = 20, category = 'general') {
    const cacheKey = `market_news_${category}_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/market/news?limit=${limit}&category=${category}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get currency exchange rates
   */
  async getCurrencyRates() {
    const cacheKey = 'currency_rates';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/currencies');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get cryptocurrency data
   */
  async getCryptoData(limit = 10) {
    const cacheKey = `crypto_data_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/market/crypto?limit=${limit}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get commodity prices
   */
  async getCommodityPrices() {
    const cacheKey = 'commodity_prices';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/commodities');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get economic calendar events
   */
  async getEconomicCalendar(startDate, endDate) {
    const cacheKey = `economic_calendar_${startDate}_${endDate}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const data = await this.makeRequest(`/market/economic-calendar?${params.toString()}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Search market data
   */
  async searchMarket(query, type = 'all') {
    // Don't cache search results as they're dynamic
    return await this.makeRequest(`/market/search?q=${encodeURIComponent(query)}&type=${type}`);
  }

  /**
   * Get market statistics
   */
  async getMarketStatistics() {
    const cacheKey = 'market_statistics';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest('/market/statistics');
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Cache management methods
   */
  isCacheValid(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  setCache(cacheKey, data) {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache(cacheKey = null) {
    if (cacheKey) {
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get real-time market data (WebSocket connection)
   */
  subscribeToRealTimeData(symbols, callback) {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const ws = new WebSocket(`${wsUrl}/market/realtime`);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbols: Array.isArray(symbols) ? symbols : [symbols]
      }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return ws;
  }
}

export default new MarketDataService();
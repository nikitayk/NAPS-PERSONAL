// stockService.js - Stock data and operations service integrated with backend API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class StockService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 2 * 60 * 1000; // 2 minutes for stock data
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
   * Get stock quote by symbol
   */
  async getStockQuote(symbol) {
    const cacheKey = `quote_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/quote`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get multiple stock quotes
   */
  async getMultipleQuotes(symbols) {
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;
    const data = await this.makeRequest(`/stocks/quotes?symbols=${symbolsParam.toUpperCase()}`);
    
    // Cache individual quotes
    if (data && Array.isArray(data)) {
      data.forEach(quote => {
        if (quote.symbol) {
          this.setCache(`quote_${quote.symbol}`, quote);
        }
      });
    }
    
    return data;
  }

  /**
   * Get stock historical data
   */
  async getHistoricalData(symbol, period = '1y', interval = '1d') {
    const cacheKey = `historical_${symbol.toUpperCase()}_${period}_${interval}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/historical?period=${period}&interval=${interval}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock company information
   */
  async getCompanyInfo(symbol) {
    const cacheKey = `company_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/company`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock financial statements
   */
  async getFinancials(symbol, type = 'annual') {
    const cacheKey = `financials_${symbol.toUpperCase()}_${type}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/financials?type=${type}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock news
   */
  async getStockNews(symbol, limit = 10) {
    const cacheKey = `news_${symbol.toUpperCase()}_${limit}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/news?limit=${limit}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Search stocks
   */
  async searchStocks(query, limit = 10) {
    // Don't cache search results
    return await this.makeRequest(`/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Get stock recommendations/analysis
   */
  async getStockAnalysis(symbol) {
    const cacheKey = `analysis_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/analysis`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock options data
   */
  async getOptionsData(symbol, expiration = null) {
    const endpoint = expiration 
      ? `/stocks/${symbol.toUpperCase()}/options?expiration=${expiration}`
      : `/stocks/${symbol.toUpperCase()}/options`;
    
    const cacheKey = `options_${symbol.toUpperCase()}_${expiration || 'all'}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(endpoint);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock technical indicators
   */
  async getTechnicalIndicators(symbol, indicators = ['sma', 'ema', 'rsi']) {
    const indicatorsParam = Array.isArray(indicators) ? indicators.join(',') : indicators;
    const cacheKey = `technical_${symbol.toUpperCase()}_${indicatorsParam}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/technical?indicators=${indicatorsParam}`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get stock earnings data
   */
  async getEarnings(symbol) {
    const cacheKey = `earnings_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/earnings`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get dividend information
   */
  async getDividends(symbol) {
    const cacheKey = `dividends_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/dividends`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get insider trading data
   */
  async getInsiderTrading(symbol) {
    const cacheKey = `insider_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/insider`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get institutional holdings
   */
  async getInstitutionalHoldings(symbol) {
    const cacheKey = `institutional_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/institutional`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Get peer comparison
   */
  async getPeerComparison(symbol) {
    const cacheKey = `peers_${symbol.toUpperCase()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey).data;
    }

    const data = await this.makeRequest(`/stocks/${symbol.toUpperCase()}/peers`);
    this.setCache(cacheKey, data);
    return data;
  }

  /**
   * Add stock to watchlist
   */
  async addToWatchlist(symbol, watchlistId = null) {
    const payload = {
      symbol: symbol.toUpperCase(),
      ...(watchlistId && { watchlistId })
    };

    return await this.makeRequest('/stocks/watchlist', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Remove stock from watchlist
   */
  async removeFromWatchlist(symbol, watchlistId = null) {
    const params = new URLSearchParams({ symbol: symbol.toUpperCase() });
    if (watchlistId) params.append('watchlistId', watchlistId);

    return await this.makeRequest(`/stocks/watchlist?${params.toString()}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get user's watchlist
   */
  async getWatchlist(watchlistId = null) {
    const endpoint = watchlistId ? `/stocks/watchlist/${watchlistId}` : '/stocks/watchlist';
    return await this.makeRequest(endpoint);
  }

  /**
   * Get stock alerts
   */
  async getStockAlerts(symbol = null) {
    const endpoint = symbol ? `/stocks/alerts?symbol=${symbol.toUpperCase()}` : '/stocks/alerts';
    return await this.makeRequest(endpoint);
  }

  /**
   * Create stock alert
   */
  async createAlert(symbol, condition, value, alertType = 'price') {
    const payload = {
      symbol: symbol.toUpperCase(),
      condition,
      value,
      alertType
    };

    return await this.makeRequest('/stocks/alerts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  /**
   * Delete stock alert
   */
  async deleteAlert(alertId) {
    return await this.makeRequest(`/stocks/alerts/${alertId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Get stock screener results
   */
  async getScreenerResults(filters) {
    return await this.makeRequest('/stocks/screener', {
      method: 'POST',
      body: JSON.stringify(filters)
    });
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
   * Subscribe to real-time stock updates
   */
  subscribeToStock(symbol, callback) {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    const ws = new WebSocket(`${wsUrl}/stocks/realtime`);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'subscribe',
        symbol: symbol.toUpperCase()
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

export default new StockService();
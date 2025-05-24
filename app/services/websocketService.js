// websocketService.js - WebSocket connection management service

class WebSocketService {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.baseUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    this.isConnected = false;
    this.subscribers = new Map();
    this.heartbeatInterval = null;
  }

  /**
   * Get authentication token
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Create a new WebSocket connection
   */
  connect(endpoint, options = {}) {
    const connectionId = `${endpoint}_${Date.now()}`;
    const wsUrl = `${this.baseUrl}${endpoint}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log(`WebSocket connected to ${endpoint}`);
        this.isConnected = true;
        this.reconnectAttempts.set(connectionId, 0);
        
        // Send authentication if token exists
        const token = this.getAuthToken();
        if (token) {
          this.send(ws, {
            type: 'auth',
            token: token
          });
        }

        // Start heartbeat
        this.startHeartbeat(ws);
        
        if (options.onOpen) {
          options.onOpen();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data, options);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          if (options.onError) {
            options.onError(error);
          }
        }
      };

      ws.onclose = (event) => {
        console.log(`WebSocket connection closed for ${endpoint}`, event.code, event.reason);
        this.isConnected = false;
        this.stopHeartbeat();
        
        if (options.onClose) {
          options.onClose(event);
        }

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.shouldReconnect(connectionId)) {
          this.attemptReconnect(endpoint, options, connectionId);
        }
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${endpoint}:`, error);
        if (options.onError) {
          options.onError(error);
        }
      };

      this.connections.set(connectionId, ws);
      return { ws, connectionId };
      
    } catch (error) {
      console.error(`Failed to create WebSocket connection to ${endpoint}:`, error);
      if (options.onError) {
        options.onError(error);
      }
      return null;
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data, options) {
    // Handle different message types
    switch (data.type) {
      case 'heartbeat':
        // Respond to heartbeat
        break;
      case 'error':
        console.error('WebSocket server error:', data.message);
        if (options.onError) {
          options.onError(new Error(data.message));
        }
        break;
      case 'auth_success':
        console.log('WebSocket authentication successful');
        break;
      case 'auth_error':
        console.error('WebSocket authentication failed:', data.message);
        break;
      default:
        // Forward message to callback
        if (options.onMessage) {
          options.onMessage(data);
        }
        
        // Notify subscribers
        this.notifySubscribers(data);
        break;
    }
  }

  /**
   * Send message through WebSocket
   */
  send(ws, data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
      return true;
    }
    return false;
  }

  /**
   * Subscribe to specific data types
   */
  subscribe(dataType, callback) {
    if (!this.subscribers.has(dataType)) {
      this.subscribers.set(dataType, new Set());
    }
    this.subscribers.get(dataType).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(dataType);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.subscribers.delete(dataType);
        }
      }
    };
  }

  /**
   * Notify subscribers of new data
   */
  notifySubscribers(data) {
    const dataType = data.type || data.event;
    if (dataType && this.subscribers.has(dataType)) {
      this.subscribers.get(dataType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  /**
   * Start heartbeat to keep connection alive
   */
  startHeartbeat(ws) {
    this.heartbeatInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        this.send(ws, { type: 'ping' });
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Check if should attempt reconnection
   */
  shouldReconnect(connectionId) {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    return attempts < this.maxReconnectAttempts;
  }

  /**
   * Attempt to reconnect
   */
  attemptReconnect(endpoint, options, connectionId) {
    const attempts = this.reconnectAttempts.get(connectionId) || 0;
    this.reconnectAttempts.set(connectionId, attempts + 1);

    const delay = this.reconnectDelay * Math.pow(2, attempts);
    
    console.log(`Attempting to reconnect to ${endpoint} in ${delay}ms (attempt ${attempts + 1})`);
    
    setTimeout(() => {
      if (this.shouldReconnect(connectionId)) {
        this.connect(endpoint, options);
      }
    }, delay);
  }

  /**
   * Connect to market data stream
   */
  connectMarketData(onMessage, onError = null) {
    return this.connect('/market/stream', {
      onMessage,
      onError,
      onOpen: () => {
        console.log('Connected to market data stream');
      }
    });
  }

  /**
   * Connect to stock price updates
   */
  connectStockUpdates(symbols, onMessage, onError = null) {
    const connection = this.connect('/stocks/stream', {
      onMessage,
      onError,
      onOpen: () => {
        console.log('Connected to stock updates stream');
      }
    });

    if (connection) {
      // Subscribe to specific symbols once connected
      setTimeout(() => {
        this.send(connection.ws, {
          type: 'subscribe',
          symbols: Array.isArray(symbols) ? symbols : [symbols]
        });
      }, 100);
    }

    return connection;
  }

  /**
   * Connect to portfolio updates
   */
  connectPortfolioUpdates(onMessage, onError = null) {
    return this.connect('/portfolio/stream', {
      onMessage,
      onError,
      onOpen: () => {
        console.log('Connected to portfolio updates stream');
      }
    });
  }

  /**
   * Connect to news feed
   */
  connectNewsFeed(onMessage, onError = null) {
    return this.connect('/news/stream', {
      onMessage,
      onError,
      onOpen: () => {
        console.log('Connected to news feed stream');
      }
    });
  }

  /**
   * Connect to alerts stream
   */
  connectAlerts(onMessage, onError = null) {
    return this.connect('/alerts/stream', {
      onMessage,
      onError,
      onOpen: () => {
        console.log('Connected to alerts stream');
      }
    });
  }

  /**
   * Send subscription message for specific symbols
   */
  subscribeToSymbols(ws, symbols) {
    return this.send(ws, {
      type: 'subscribe',
      symbols: Array.isArray(symbols) ? symbols : [symbols]
    });
  }

  /**
   * Send unsubscription message for specific symbols
   */
  unsubscribeFromSymbols(ws, symbols) {
    return this.send(ws, {
      type: 'unsubscribe',
      symbols: Array.isArray(symbols) ? symbols : [symbols]
    });
  }

  /**
   * Close specific connection
   */
  closeConnection(connectionId) {
    const ws = this.connections.get(connectionId);
    if (ws) {
      ws.close(1000, 'Connection closed by client');
      this.connections.delete(connectionId);
      this.reconnectAttempts.delete(connectionId);
    }
  }

  /**
   * Close all connections
   */
  closeAllConnections() {
    this.connections.forEach((ws, connectionId) => {
      ws.close(1000, 'Closing all connections');
    });
    this.connections.clear();
    this.reconnectAttempts.clear();
    this.subscribers.clear();
    this.stopHeartbeat();
  }

  /**
   * Get connection status
   */
  getConnectionStatus(connectionId) {
    const ws = this.connections.get(connectionId);
    if (!ws) return 'disconnected';
    
    switch (ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'closed';
      default:
        return 'unknown';
    }
  }

  /**
   * Check if any connection is active
   */
  hasActiveConnections() {
    return Array.from(this.connections.values()).some(
      ws => ws.readyState === WebSocket.OPEN
    );
  }
}

export default new WebSocketService();
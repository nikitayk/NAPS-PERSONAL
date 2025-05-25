class WebSocketService {
  private ws: WebSocket | null = null;
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private eventListeners: Map<string, Set<() => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.handleOpen();
        this.emit('open');
      };
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = () => {
        this.handleClose();
        this.emit('close');
      };
      this.ws.onerror = (error) => {
        this.handleError(error);
        this.emit('error');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  private handleOpen() {
    console.log('WebSocket connected');
    this.reconnectAttempts = 0;
    // Resubscribe to all symbols
    this.subscribers.forEach((_, symbol) => {
      this.sendMessage({
        type: 'subscribe',
        symbol,
      });
    });
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      const symbol = data.symbol;
      const subscribers = this.subscribers.get(symbol);
      if (subscribers) {
        subscribers.forEach(callback => callback(data));
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose() {
    console.log('WebSocket disconnected');
    this.handleReconnect();
  }

  private handleError(error: Event) {
    console.error('WebSocket error:', error);
    this.handleReconnect();
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  public subscribe(symbol: string, callback: (data: any) => void) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'subscribe',
          symbol,
        });
      }
    }
    this.subscribers.get(symbol)?.add(callback);
  }

  public unsubscribe(symbol: string, callback: (data: any) => void) {
    const subscribers = this.subscribers.get(symbol);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.sendMessage({
            type: 'unsubscribe',
            symbol,
          });
        }
      }
    }
  }

  private sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Event listener methods
  public on(event: 'open' | 'close' | 'error', callback: () => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  public off(event: 'open' | 'close' | 'error', callback: () => void) {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: 'open' | 'close' | 'error') {
    this.eventListeners.get(event)?.forEach(callback => callback());
  }
}

export const websocketService = new WebSocketService(process.env.NEXT_PUBLIC_WS_URL || 'wss://api.example.com/ws'); 
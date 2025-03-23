import axios from 'axios';
const YAHOO_API_KEY = '5bca484526msh7223d55e80ba5b4p1fb399jsnbfe34a741d3e';
const YAHOO_API_HOST = 'yahoo-finance15.p.rapidapi.com';
const BASE_URL = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock';

const CACHE_DURATION = 30000; // 30 seconds
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout
const RETRY_DELAY = 1000; // 1 second delay between retries
const MAX_RETRIES = 3;

const options = {
  headers: {
    'X-RapidAPI-Key': YAHOO_API_KEY,
    'X-RapidAPI-Host': YAHOO_API_HOST
  },
  timeout: REQUEST_TIMEOUT
};

// Create axios instance with default config
const api = axios.create(options);

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => {
    if (!response || !response.data) {
      return Promise.reject(new Error('No data received'));
    }
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return Promise.resolve({ data: null });
    }
    return Promise.reject(error);
  }
);

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sector?: string;
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  interpretation: 'Bullish' | 'Bearish' | 'Neutral';
  details: string;
}

export interface FinancialMetric {
  name: string;
  value: string;
  details: string;
}

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};

// Mock data for technical indicators
const getMockTechnicalIndicators = (symbol: string): TechnicalIndicator[] => [
  {
    name: 'RSI',
    value: '65.5',
    interpretation: 'Neutral',
    details: 'Relative Strength Index indicates moderate momentum'
  },
  {
    name: 'MACD',
    value: '2.3',
    interpretation: 'Bullish',
    details: 'Moving Average Convergence Divergence shows positive trend'
  },
  {
    name: 'Bollinger Bands',
    value: 'Upper: 165.2',
    interpretation: 'Neutral',
    details: 'Price is within normal range'
  }
];

// Mock data for financial metrics
const getMockFinancialMetrics = (symbol: string): FinancialMetric[] => [
  {
    name: 'P/E Ratio',
    value: '28.5',
    details: 'Price to Earnings ratio indicates fair valuation'
  },
  {
    name: 'Market Cap',
    value: '$2.8T',
    details: 'Total market value of outstanding shares'
  },
  {
    name: 'Profit Margin',
    value: '25.3%',
    details: 'Net income as a percentage of revenue'
  }
];

// Mock data for company details
const getMockCompanyDetails = (symbol: string) => ({
  name: FALLBACK_DATA[symbol]?.name || symbol,
  sector: FALLBACK_DATA[symbol]?.sector || 'Technology'
});

// Fallback data for major stocks
const FALLBACK_DATA: Record<string, StockData> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 161.75,
    change: 2.5,
    changePercent: 1.57,
    volume: 12345678,
    high: 162.50,
    low: 160.00,
    open: 160.25,
    previousClose: 159.25,
    sector: 'Technology'
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 238.45,
    change: 3.2,
    changePercent: 1.36,
    volume: 9876543,
    high: 239.00,
    low: 237.00,
    open: 237.50,
    previousClose: 235.25,
    sector: 'Technology'
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 2185.75,
    change: 15.5,
    changePercent: 0.71,
    volume: 2345678,
    high: 2190.00,
    low: 2180.00,
    open: 2182.00,
    previousClose: 2170.25,
    sector: 'Technology'
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 3125.98,
    change: 45.2,
    changePercent: 1.47,
    volume: 3456789,
    high: 3130.00,
    low: 3120.00,
    open: 3122.00,
    previousClose: 3080.78,
    sector: 'Consumer Cyclical'
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 685.25,
    change: -12.5,
    changePercent: -1.79,
    volume: 4567890,
    high: 690.00,
    low: 682.00,
    open: 688.00,
    previousClose: 697.75,
    sector: 'Automotive'
  }
};

const getFallbackData = (symbol: string): StockData | null => {
  return FALLBACK_DATA[symbol] || null;
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add error handling utility
const handleApiError = (error: any, fallback: any) => {
  console.error('API Error:', error);
  if (axios.isCancel(error)) {
    console.log('Request canceled:', error.message);
  }
  return fallback;
};

async function makeRequestWithRetry(url: string, config: any = {}, retries = MAX_RETRIES): Promise<any> {
  try {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      source.cancel('Request timeout');
    }, REQUEST_TIMEOUT);

    const response = await api.get(url, {
      ...config,
      cancelToken: source.token
    });

    clearTimeout(timeoutId);
    const data = response?.data;
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid data format');
    }
    return data;
  } catch (error) {
    if (retries > 0 && !axios.isCancel(error)) {
      await delay(RETRY_DELAY);
      return makeRequestWithRetry(url, config, retries - 1);
    }
    throw error;
  }
}

// Utility function to create a promise that resolves immediately but allows background updates
function createImmediatePromise<T>(initialValue: T, backgroundTask?: () => Promise<void>): Promise<T> {
  return new Promise<T>((resolve) => {
    // Resolve immediately with initial value
    resolve(initialValue);
    
    // Execute background task if provided
    if (backgroundTask) {
      backgroundTask().catch(error => {
        console.error('Background task failed:', error);
      });
    }
  });
}

export const stockApi = {
  async getStockQuote(symbol: string): Promise<StockData> {
    const cacheKey = `quote-${symbol}`;
    const cached = cache[cacheKey];
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const fallback = getFallbackData(symbol);
    const initialResponse = fallback || FALLBACK_DATA['AAPL'];

    try {
      return createImmediatePromise(initialResponse, async () => {
        try {
          const response = await api.get(`${BASE_URL}/history`, {
            params: {
              symbol: symbol,
              interval: '5m',
              diffandsplits: 'false'
            }
          });

          if (response?.data?.data && Array.isArray(response.data.data)) {
            const latestData = response.data.data[response.data.data.length - 1];
            if (latestData) {
              const stockData: StockData = {
                symbol,
                name: initialResponse.name,
                price: parseFloat(latestData.Close) || initialResponse.price,
                change: parseFloat(latestData.Close) - parseFloat(latestData.Open) || initialResponse.change,
                changePercent: ((parseFloat(latestData.Close) - parseFloat(latestData.Open)) / parseFloat(latestData.Open) * 100) || initialResponse.changePercent,
                volume: parseInt(latestData.Volume) || initialResponse.volume,
                high: parseFloat(latestData.High) || initialResponse.high,
                low: parseFloat(latestData.Low) || initialResponse.low,
                open: parseFloat(latestData.Open) || initialResponse.open,
                previousClose: parseFloat(response.data.data[response.data.data.length - 2]?.Close) || initialResponse.previousClose,
                sector: initialResponse.sector
              };

              cache[cacheKey] = {
                data: stockData,
                timestamp: Date.now()
              };
            }
          }
        } catch (error) {
          console.error('Background fetch failed:', error);
        }
      });
    } catch (error) {
      return handleApiError(error, initialResponse);
    }
  },

  async searchStocks(query: string): Promise<Array<StockData>> {
    if (!query.trim()) {
      return Promise.resolve([]);
    }

    const matchingStocks = Object.values(FALLBACK_DATA).filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    try {
      return createImmediatePromise(matchingStocks, async () => {
        try {
          const response = await api.get(`${BASE_URL}/search`, {
            params: {
              query: query
            }
          });

          if (response?.data?.data && Array.isArray(response.data.data)) {
            const additionalStocks = response.data.data
              .filter(item => item && !matchingStocks.some(s => s.symbol === item.symbol))
              .map(item => ({
                symbol: item.symbol,
                name: item.name || item.symbol,
                price: parseFloat(item.price) || 0,
                change: parseFloat(item.change) || 0,
                changePercent: parseFloat(item.changePercent) || 0,
                volume: parseInt(item.volume) || 0,
                high: parseFloat(item.high) || 0,
                low: parseFloat(item.low) || 0,
                open: parseFloat(item.open) || 0,
                previousClose: parseFloat(item.previousClose) || 0
              }));

            cache[`search-${query}`] = {
              data: [...matchingStocks, ...additionalStocks],
              timestamp: Date.now()
            };
          }
        } catch (error) {
          console.error('Background fetch failed:', error);
        }
      });
    } catch (error) {
      return handleApiError(error, matchingStocks);
    }
  },

  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    try {
      return getMockTechnicalIndicators(symbol);
    } catch (error) {
      return handleApiError(error, getMockTechnicalIndicators(symbol));
    }
  },

  async getFinancialMetrics(symbol: string): Promise<FinancialMetric[]> {
    try {
      return getMockFinancialMetrics(symbol);
    } catch (error) {
      return handleApiError(error, getMockFinancialMetrics(symbol));
    }
  },

  async getCompanyDetails(symbol: string): Promise<any> {
    try {
      const fallback = getFallbackData(symbol);
      if (fallback) {
        return {
          name: fallback.name,
          sector: fallback.sector,
          description: `${fallback.name} is a company in the ${fallback.sector} sector.`
        };
      }
      return {
        name: symbol,
        sector: 'Unknown',
        description: `Information about ${symbol} is not available.`
      };
    } catch (error) {
      return handleApiError(error, {
        name: symbol,
        sector: 'Unknown',
        description: 'Unable to fetch company details at this time.'
      });
    }
  }
};

export default stockApi; 
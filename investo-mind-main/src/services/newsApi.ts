import axios, { AxiosError } from 'axios';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'X-Api-Key': API_KEY
  }
});

// Helper function to get cached data
function getCachedData<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  
  const now = Date.now();
  if (now - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
}

// Helper function to set cached data
function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Helper function to handle retries
async function retryRequest<T>(requestFn: () => Promise<T>, retries = 3): Promise<T> {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && error instanceof AxiosError) {
      // Only retry on network errors or 5xx server errors
      if (!error.response || (error.response.status >= 500 && error.response.status < 600)) {
        console.log(`Retrying request... (${4 - retries}/3)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return retryRequest(requestFn, retries - 1);
      }
    }
    throw error;
  }
}

export interface NewsItem {
  title: string;
  source: {
    name: string;
  };
  publishedAt: string;
  description: string;
  url: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  impact?: 'high' | 'medium' | 'low';
}

export interface NewsResponse {
  articles: NewsItem[];
  totalResults: number;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  overall: string;
}

// Helper function to analyze sentiment
function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['surge', 'rise', 'gain', 'up', 'higher', 'positive', 'growth', 'profit', 'success', 'bullish'];
  const negativeWords = ['fall', 'drop', 'decline', 'down', 'lower', 'negative', 'loss', 'risk', 'bearish', 'crash'];
  
  const words = text.toLowerCase().split(' ');
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Helper function to determine impact
function determineImpact(text: string): 'high' | 'medium' | 'low' {
  const highImpactWords = ['crisis', 'crash', 'surge', 'breakthrough', 'revolutionary', 'major', 'significant', 'critical'];
  const mediumImpactWords = ['change', 'update', 'report', 'announcement', 'development', 'trend', 'market'];
  
  const words = text.toLowerCase().split(' ');
  let highImpactCount = 0;
  let mediumImpactCount = 0;
  
  words.forEach(word => {
    if (highImpactWords.includes(word)) highImpactCount++;
    if (mediumImpactWords.includes(word)) mediumImpactCount++;
  });
  
  if (highImpactCount > 0) return 'high';
  if (mediumImpactCount > 0) return 'medium';
  return 'low';
}

// Transform news item to include sentiment and impact
function transformNewsItem(item: any): NewsItem {
  return {
    ...item,
    sentiment: analyzeSentiment(item.title + ' ' + item.description),
    impact: determineImpact(item.title + ' ' + item.description)
  };
}

export const newsApi = {
  // Fetch all news data in one request
  fetchAllNewsData: async (query: string = ''): Promise<{
    news: NewsResponse;
    sentiment: SentimentData;
    trending: Array<{ name: string; sentiment: string }>;
  }> => {
    const cacheKey = `news_data_${query}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await retryRequest(async () => {
        const result = await api.get('/everything', {
          params: {
            q: query || '(finance OR stock OR market OR trading OR investment)',
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 50,
          },
        });

        if (!result.data || !result.data.articles) {
          throw new Error('Invalid response format from API');
        }

        return result;
      });

      const articles = response.data.articles.map(transformNewsItem);
      
      // Process articles for news
      const news: NewsResponse = {
        articles: articles.slice(0, 10),
        totalResults: articles.length
      };

      // Process articles for sentiment
      const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0,
      };

      articles.forEach(article => {
        sentimentCounts[article.sentiment || 'neutral']++;
      });

      const totalArticles = articles.length || 1;
      const sentiment: SentimentData = {
        positive: Math.round((sentimentCounts.positive / totalArticles) * 100),
        neutral: Math.round((sentimentCounts.neutral / totalArticles) * 100),
        negative: Math.round((sentimentCounts.negative / totalArticles) * 100),
        overall: sentimentCounts.positive > sentimentCounts.negative ? 'Bullish' : 'Bearish',
      };

      // Process articles for trending topics
      const topics = new Map<string, { count: number; sentiments: { positive: number; negative: number; neutral: number } }>();

      articles.forEach(article => {
        // Extract keywords from title and description
        const text = `${article.title} ${article.description}`.toLowerCase();
        const words = text.split(/\W+/).filter(word => word.length > 4);
        
        words.forEach(word => {
          if (!topics.has(word)) {
            topics.set(word, { 
              count: 0, 
              sentiments: { positive: 0, negative: 0, neutral: 0 } 
            });
          }
          
          const topic = topics.get(word)!;
          topic.count++;
          topic.sentiments[article.sentiment || 'neutral']++;
        });
      });

      const trending = Array.from(topics.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([name, data]) => {
          const { sentiments } = data;
          const total = sentiments.positive + sentiments.negative + sentiments.neutral;
          let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
          
          if (sentiments.positive / total > 0.4) sentiment = 'positive';
          else if (sentiments.negative / total > 0.4) sentiment = 'negative';
          
          return { name, sentiment };
        });

      const result = { news, sentiment, trending };
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching news data:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch news data: ${error.message}`);
      }
      throw new Error('Failed to fetch news data: Unknown error');
    }
  },

  // Wrapper methods that use the cached data
  getFinancialNews: async (query: string = '', timeFrame: string = '24h'): Promise<NewsResponse> => {
    const data = await newsApi.fetchAllNewsData(query);
    return data.news;
  },

  getMarketSentiment: async (): Promise<SentimentData> => {
    const data = await newsApi.fetchAllNewsData();
    return data.sentiment;
  },

  getTrendingTopics: async () => {
    const data = await newsApi.fetchAllNewsData();
    return data.trending;
  },
};

// Helper function to get date based on time frame
function getTimeFrameDate(timeFrame: string): string {
  const now = new Date();
  switch (timeFrame) {
    case '6h':
      return new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString();
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  }
} 
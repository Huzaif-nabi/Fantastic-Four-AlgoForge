import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  priceData: {
    timestamp: number;
    price: number;
  }[];
}

interface StockCardProps {
  stockData: StockData;
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stockData, selectedInterval, onIntervalChange }) => {
  const { min, max } = getMinMaxValues(stockData.priceData);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-finance-blue">
      <div className="mb-4">
        <h2 className="text-lg text-gray-600 dark:text-gray-300">Stock Price</h2>
        <div className="flex items-baseline">
          <h1 className="text-3xl font-bold mr-2 text-gray-900 dark:text-white">{stockData.symbol} - ${stockData.currentPrice.toFixed(2)}</h1>
          <span className={`text-lg ${stockData.priceChange >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
            {stockData.priceChange >= 0 ? '↗' : '↘'} {stockData.priceChange.toFixed(2)} ({stockData.percentChange.toFixed(2)}%)
          </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">{stockData.companyName}</p>
      </div>
      
      <div className="flex gap-2 mb-4">
        <button 
          className={`px-3 py-1 rounded-full ${selectedInterval === '1d' ? 'bg-finance-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          onClick={() => onIntervalChange('1d')}
        >
          1D
        </button>
        <button 
          className={`px-3 py-1 rounded-full ${selectedInterval === '1w' ? 'bg-finance-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          onClick={() => onIntervalChange('1w')}
        >
          1W
        </button>
        <button 
          className={`px-3 py-1 rounded-full ${selectedInterval === '1m' ? 'bg-finance-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          onClick={() => onIntervalChange('1m')}
        >
          1M
        </button>
        <button 
          className={`px-3 py-1 rounded-full ${selectedInterval === '3m' ? 'bg-finance-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          onClick={() => onIntervalChange('3m')}
        >
          3M
        </button>
        <button 
          className={`px-3 py-1 rounded-full ${selectedInterval === '1y' ? 'bg-finance-teal text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
          onClick={() => onIntervalChange('1y')}
        >
          1Y
        </button>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stockData.priceData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => formatXAxis(timestamp, selectedInterval)}
              padding={{ left: 10, right: 10 }}
              stroke="#6B7280"
            />
            <YAxis 
              domain={[min, max]} 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tickCount={4}
              stroke="#6B7280"
            />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Price']} 
              labelFormatter={(timestamp) => formatXAxis(timestamp, selectedInterval)}
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={stockData.priceChange >= 0 ? "#10B981" : "#EF4444"} 
              dot={false}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const TechStocksDashboard: React.FC = () => {
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<string>('1d');
  
  const stockSymbols = ['AAPL', 'AMZN', 'NVDA', 'MSFT', 'TSLA'];
  const companyNames = {
    'AAPL': 'Apple Inc.',
    'AMZN': 'Amazon.com Inc.',
    'NVDA': 'NVIDIA Corporation',
    'MSFT': 'Microsoft Corporation',
    'TSLA': 'Tesla, Inc.'
  };

  useEffect(() => {
    const fetchAllStockData = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch data from an API
        // For demo purposes, we're generating mock data
        const allStocksData = stockSymbols.map(symbol => generateMockDataForStock(symbol));
        setStocksData(allStocksData);
        setError(null);
      } catch (err) {
        setError('Error fetching stock data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStockData();
    
    // For real-time updates
    const intervalId = setInterval(fetchAllStockData, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [selectedInterval]);

  const generateMockDataForStock = (symbol: string): StockData => {
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(9, 30, 0, 0); // Market open at 9:30 AM
    
    const priceData = [];
    
    // Base prices for different stocks
    const basePrices: { [key: string]: number } = {
      'AAPL': 161.75,
      'AMZN': 178.25,
      'NVDA': 920.50,
      'MSFT': 425.30,
      'TSLA': 180.75
    };
    
    // Volatility factors (higher number = more volatile)
    const volatility: { [key: string]: number } = {
      'AAPL': 1.0,
      'AMZN': 1.2,
      'NVDA': 1.8,
      'MSFT': 0.8,
      'TSLA': 2.0
    };
    
    let startPrice = basePrices[symbol] || 100;
    let currentPrice = startPrice;
    
    // Number of data points based on interval
    let dataPoints = 14;
    let timeIncrement = 30; // minutes
    
    if (selectedInterval === '1w') {
      dataPoints = 7;
      timeIncrement = 24 * 60; // daily
    } else if (selectedInterval === '1m') {
      dataPoints = 30;
      timeIncrement = 24 * 60;
    } else if (selectedInterval === '3m') {
      dataPoints = 12;
      timeIncrement = 7 * 24 * 60; // weekly
    } else if (selectedInterval === '1y') {
      dataPoints = 12;
      timeIncrement = 30 * 24 * 60; // monthly
    }
    
    // Generate data points
    for (let i = 0; i < dataPoints; i++) {
      const pointTime = new Date(startTime);
      
      if (selectedInterval === '1d') {
        pointTime.setMinutes(startTime.getMinutes() + i * timeIncrement);
      } else {
        pointTime.setMinutes(startTime.getMinutes() + i * timeIncrement);
      }
      
      // Random price movement with volatility factor
      const movement = (Math.random() - 0.45) * volatility[symbol];
      currentPrice += movement;
      
      priceData.push({
        timestamp: pointTime.getTime(),
        price: parseFloat(currentPrice.toFixed(2))
      });
    }
    
    const lastPrice = priceData[priceData.length - 1].price;
    const firstPrice = priceData[0].price;
    const priceChange = parseFloat((lastPrice - firstPrice).toFixed(2));
    const percentChange = parseFloat(((priceChange / firstPrice) * 100).toFixed(2));
    
    return {
      symbol,
      companyName: companyNames[symbol as keyof typeof companyNames] || symbol,
      currentPrice: lastPrice,
      priceChange,
      percentChange,
      priceData
    };
  };

  const handleIntervalChange = (interval: string) => {
    setSelectedInterval(interval);
  };

  if (loading && stocksData.length === 0) {
    return <div className="flex justify-center p-8 text-gray-600 dark:text-gray-300">Loading stock data...</div>;
  }

  if (error && stocksData.length === 0) {
    return <div className="text-finance-negative p-4">{error}</div>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Tech Stocks Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocksData.map(stockData => (
          <StockCard 
            key={stockData.symbol}
            stockData={stockData}
            selectedInterval={selectedInterval}
            onIntervalChange={handleIntervalChange}
          />
        ))}
      </div>
    </div>
  );
};

// Helper functions
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

const formatXAxis = (timestamp: number, interval: string) => {
  if (interval === '1d') {
    return formatTime(timestamp);
  } else {
    return formatDate(timestamp);
  }
};

const getMinMaxValues = (data: { timestamp: number; price: number }[]) => {
  if (data.length === 0) return { min: 0, max: 0 };
  
  let min = data[0].price;
  let max = data[0].price;
  
  data.forEach(item => {
    if (item.price < min) min = item.price;
    if (item.price > max) max = item.price;
  });
  
  // Add some padding
  min = parseFloat((min - 0.01 * min).toFixed(2));
  max = parseFloat((max + 0.01 * max).toFixed(2));
  
  return { min, max };
};

export default TechStocksDashboard; 

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StockChartProps {
  symbol: string;
  name: string;
}

const StockChart = ({ symbol, name }: StockChartProps) => {
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  
  // Generate mock stock data based on the selected time range
  useEffect(() => {
    setIsLoading(true);
    
    const generateMockData = () => {
      let startPrice: number;
      let volatility: number;
      let dataPoints: number;
      let dateFormat: string;
      
      switch (timeRange) {
        case '1D':
          startPrice = 150 + Math.random() * 10;
          volatility = 0.5;
          dataPoints = 24;
          dateFormat = 'HH:mm';
          break;
        case '1W':
          startPrice = 145 + Math.random() * 15;
          volatility = 1;
          dataPoints = 7;
          dateFormat = 'ddd';
          break;
        case '1M':
          startPrice = 140 + Math.random() * 20;
          volatility = 2;
          dataPoints = 30;
          dateFormat = 'DD MMM';
          break;
        case '3M':
          startPrice = 135 + Math.random() * 25;
          volatility = 4;
          dataPoints = 12;
          dateFormat = 'DD MMM';
          break;
        case '1Y':
          startPrice = 130 + Math.random() * 30;
          volatility = 8;
          dataPoints = 12;
          dateFormat = 'MMM YY';
          break;
        default:
          startPrice = 150;
          volatility = 2;
          dataPoints = 30;
          dateFormat = 'DD MMM';
      }
      
      const mockData = [];
      let currentValue = startPrice;
      
      // Create a trend bias (up or down) for the whole period
      const trendBias = Math.random() * 0.3 - 0.1; // Slightly biased towards upward trend
      
      for (let i = 0; i < dataPoints; i++) {
        // Random walk with trend bias
        const change = (Math.random() - 0.5) * volatility + trendBias;
        currentValue = Math.max(currentValue + change, 0); // Ensure stock price doesn't go negative
        
        const date = new Date();
        switch (timeRange) {
          case '1D':
            date.setHours(9 + Math.floor(i / 2), (i % 2) * 30);
            break;
          case '1W':
            date.setDate(date.getDate() - (6 - i));
            break;
          case '1M':
            date.setDate(date.getDate() - (29 - i));
            break;
          case '3M':
            date.setDate(date.getDate() - 90 + (i * 7));
            break;
          case '1Y':
            date.setMonth(date.getMonth() - 11 + i);
            break;
        }
        
        mockData.push({
          date: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: timeRange === '1D' ? 'numeric' : undefined,
            minute: timeRange === '1D' ? 'numeric' : undefined,
          }),
          value: currentValue.toFixed(2),
        });
      }
      
      // Set the current price to the last value
      const finalPrice = parseFloat(mockData[mockData.length - 1].value);
      setCurrentPrice(finalPrice);
      
      // Calculate price and percentage change
      const initialPrice = parseFloat(mockData[0].value);
      const absoluteChange = finalPrice - initialPrice;
      setPriceChange(absoluteChange);
      setPercentChange((absoluteChange / initialPrice) * 100);
      
      return mockData;
    };
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange, symbol]);
  
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardDescription>Stock Price</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center">
              {isLoading ? (
                <div className="h-8 w-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
              ) : (
                <>
                  {symbol} - ${currentPrice.toFixed(2)}
                  <span className={`ml-2 text-sm flex items-center ${priceChange >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                    {priceChange >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(priceChange).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
                  </span>
                </>
              )}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{name}</p>
          </div>
          
          <div className="flex space-x-1">
            {(['1D', '1W', '1M', '3M', '1Y'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                className={`h-8 px-2 text-xs ${
                  timeRange === range 
                    ? 'bg-finance-blue text-white dark:bg-finance-teal' 
                    : 'text-gray-500'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 h-64">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-40 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                tickLine={false}
                axisLine={false}
                padding={{ top: 20, bottom: 20 }}
                width={50}
              />
              <Tooltip
                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #E5E7EB'
                }}
                formatter={(value) => [`$${value}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={priceChange >= 0 ? '#10B981' : '#EF4444'} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: priceChange >= 0 ? '#10B981' : '#EF4444', stroke: 'white', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;

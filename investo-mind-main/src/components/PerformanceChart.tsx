import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { StockData } from "@/services/stockApi";

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface PerformanceChartProps {
  investments: Investment[];
  stockData: Record<string, StockData>;
}

const PerformanceChart = ({ investments, stockData }: PerformanceChartProps) => {
  // Generate performance data for the chart
  const generatePerformanceData = () => {
    const data = [];
    const today = new Date();
    const days = 30; // Show last 30 days

    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Calculate portfolio value for this date
      const portfolioValue = investments.reduce((total, investment) => {
        const currentPrice = stockData[investment.symbol]?.price || 0;
        return total + (currentPrice * investment.shares);
      }, 0);

      data.push({
        date: dateStr,
        value: portfolioValue
      });
    }

    return data;
  };

  const performanceData = generatePerformanceData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0D9488"
                strokeWidth={2}
                dot={false}
                name="Portfolio Value"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
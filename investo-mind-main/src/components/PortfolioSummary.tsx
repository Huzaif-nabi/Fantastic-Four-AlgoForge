
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, Coins, BarChart2, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioStats {
  totalValue: number;
  dailyChange: number;
  monthlyChange: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskScore: number;
  diversificationScore: number;
  topPerformer: {
    symbol: string;
    name: string;
    change: number;
  };
  worstPerformer: {
    symbol: string;
    name: string;
    change: number;
  };
}

const PortfolioSummary = () => {
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    dailyChange: 0,
    monthlyChange: 0,
    riskLevel: 'Moderate',
    riskScore: 65,
    diversificationScore: 82,
    topPerformer: {
      symbol: '',
      name: '',
      change: 0
    },
    worstPerformer: {
      symbol: '',
      name: '',
      change: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading portfolio data
    const timer = setTimeout(() => {
      setPortfolioStats({
        totalValue: 126532.87,
        dailyChange: 2.4,
        monthlyChange: 8.7,
        riskLevel: 'Moderate',
        riskScore: 65,
        diversificationScore: 82,
        topPerformer: {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          change: 4.2
        },
        worstPerformer: {
          symbol: 'META',
          name: 'Meta Platforms Inc.',
          change: -1.8
        }
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
      {/* Portfolio Value */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <Coins className="mr-2 h-4 w-4 text-gray-500" />
            Total Portfolio Value
          </CardDescription>
          <CardTitle className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
            ) : (
              <>
                ${portfolioStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-5 w-24 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
          ) : (
            <div className="flex items-center space-x-2 text-sm">
              <span className={`flex items-center ${portfolioStats.dailyChange >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                {portfolioStats.dailyChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(portfolioStats.dailyChange)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">Today</span>
              <span className={`flex items-center ml-2 ${portfolioStats.monthlyChange >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                {portfolioStats.monthlyChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {Math.abs(portfolioStats.monthlyChange)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">This Month</span>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Risk Assessment */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4 text-gray-500" />
            Risk Assessment
          </CardDescription>
          <CardTitle className="flex justify-between items-center">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
            ) : (
              <>
                <span>{portfolioStats.riskLevel}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  portfolioStats.riskLevel === 'Low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  portfolioStats.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {portfolioStats.riskScore}/100
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
          ) : (
            <Progress
              value={portfolioStats.riskScore}
              className="h-2"
              indicatorClassName={
                portfolioStats.riskLevel === 'Low' ? 'bg-finance-positive' :
                portfolioStats.riskLevel === 'Moderate' ? 'bg-yellow-500' :
                'bg-finance-negative'
              }
            />
          )}
        </CardContent>
      </Card>
      
      {/* Portfolio Diversification */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <PieChart className="mr-2 h-4 w-4 text-gray-500" />
            Diversification Score
          </CardDescription>
          <CardTitle className="flex justify-between items-center">
            {loading ? (
              <div className="h-8 w-20 animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
            ) : (
              <>
                <span>Very Good</span>
                <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {portfolioStats.diversificationScore}/100
                </span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-4 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
          ) : (
            <Progress value={portfolioStats.diversificationScore} className="h-2 bg-gray-200 dark:bg-gray-700">
              <div className="h-full bg-finance-teal" style={{ width: `${portfolioStats.diversificationScore}%` }}></div>
            </Progress>
          )}
        </CardContent>
      </Card>
      
      {/* Performance Highlights */}
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
            Performance Highlights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {loading ? (
            <>
              <div className="h-6 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
              <div className="h-6 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-2">
                    {portfolioStats.topPerformer.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{portfolioStats.topPerformer.symbol}</div>
                    <div className="text-xs text-gray-500">{portfolioStats.topPerformer.name}</div>
                  </div>
                </div>
                <div className="text-finance-positive flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {portfolioStats.topPerformer.change}%
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold mr-2">
                    {portfolioStats.worstPerformer.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{portfolioStats.worstPerformer.symbol}</div>
                    <div className="text-xs text-gray-500">{portfolioStats.worstPerformer.name}</div>
                  </div>
                </div>
                <div className="text-finance-negative flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {Math.abs(portfolioStats.worstPerformer.change)}%
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;

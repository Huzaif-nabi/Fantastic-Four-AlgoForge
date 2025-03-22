
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockChart from "@/components/StockChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, LineChart, BarChart2, Cpu, Calendar, ArrowRight, TrendingUp, TrendingDown, Layers } from 'lucide-react';

const StockAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>('AAPL');
  
  // Mock stock data
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', aiScore: 86 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', aiScore: 91 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', aiScore: 84 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', aiScore: 82 },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', aiScore: 78 },
  ];
  
  // Mock prediction data
  const predictionData = {
    shortTerm: { direction: 'up', probability: 72, change: '+3.8%' },
    mediumTerm: { direction: 'up', probability: 68, change: '+8.2%' },
    longTerm: { direction: 'neutral', probability: 52, change: '+1.5%' },
  };
  
  // Mock technical indicators
  const technicalIndicators = [
    { name: 'RSI', value: 62, interpretation: 'Neutral', details: 'Not overbought, room to run' },
    { name: 'MACD', value: 'Positive', interpretation: 'Bullish', details: 'Recent crossover signals uptrend' },
    { name: 'Moving Averages', value: '8/10', interpretation: 'Bullish', details: '8 of 10 MAs signal buy' },
    { name: 'Bollinger Bands', value: 'Middle', interpretation: 'Neutral', details: 'Price near middle band' },
  ];
  
  // Mock financial metrics
  const financialMetrics = [
    { name: 'P/E Ratio', value: '28.5', comparison: 'Above sector average of 25.3' },
    { name: 'Revenue Growth', value: '12.4% YoY', comparison: 'Strong, above sector average' },
    { name: 'Profit Margin', value: '22.8%', comparison: 'Excellent, top quartile for sector' },
    { name: 'Debt-to-Equity', value: '1.25', comparison: 'Moderate leverage, manageable' },
    { name: 'Cash Reserves', value: '$72.3B', comparison: 'Strong balance sheet' },
  ];
  
  // Function to filter stocks based on search query
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-finance-blue-dark">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Analysis</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              AI-powered stock analysis and predictions
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stock Search Panel */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 sticky top-24">
                <CardHeader>
                  <CardTitle>Search Stocks</CardTitle>
                  <CardDescription>Find and analyze any stock</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search by symbol or name..."
                      className="pl-9 w-full bg-white dark:bg-finance-blue-dark border-gray-200 dark:border-gray-800 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {filteredStocks.map((stock) => (
                      <div 
                        key={stock.symbol}
                        className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                          selectedStock === stock.symbol 
                            ? 'bg-finance-teal/10 border border-finance-teal/20' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                        }`}
                        onClick={() => setSelectedStock(stock.symbol)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold mr-3 ${
                            selectedStock === stock.symbol ? 'bg-finance-teal' : 'bg-finance-blue-light'
                          }`}>
                            {stock.symbol.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{stock.symbol}</p>
                            <p className="text-xs text-gray-500">{stock.name}</p>
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                          {stock.sector}
                        </div>
                      </div>
                    ))}
                    
                    {filteredStocks.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No stocks found matching "{searchQuery}"</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Stock Analysis Panel */}
            <div className="lg:col-span-3 space-y-6">
              {selectedStock ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <StockChart 
                        symbol={selectedStock} 
                        name={stocks.find(s => s.symbol === selectedStock)?.name || ''} 
                      />
                    </div>
                    
                    <div className="md:col-span-1">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 h-full">
                        <CardHeader className="pb-2">
                          <CardTitle className="flex items-center">
                            <Cpu className="mr-2 h-5 w-5 text-finance-teal" />
                            AI Analysis Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center justify-center p-4">
                            <div className="relative w-32 h-32 mb-4">
                              <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle 
                                  className="text-gray-200 dark:text-gray-700 stroke-current" 
                                  strokeWidth="10" 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="transparent"
                                ></circle>
                                <circle 
                                  className="text-finance-teal stroke-current" 
                                  strokeWidth="10" 
                                  strokeLinecap="round" 
                                  cx="50" 
                                  cy="50" 
                                  r="40" 
                                  fill="transparent"
                                  strokeDasharray="251.2"
                                  strokeDashoffset={251.2 - (251.2 * (stocks.find(s => s.symbol === selectedStock)?.aiScore || 0)) / 100}
                                  transform="rotate(-90 50 50)"
                                ></circle>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">
                                  {stocks.find(s => s.symbol === selectedStock)?.aiScore || 0}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Investment Attractiveness</p>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Strong Buy
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h4 className="font-medium mb-2">Key Strengths</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-finance-positive mr-2 mt-0.5" />
                                <span>Strong revenue growth trajectory</span>
                              </li>
                              <li className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-finance-positive mr-2 mt-0.5" />
                                <span>Market leader in core product categories</span>
                              </li>
                              <li className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-finance-positive mr-2 mt-0.5" />
                                <span>Robust R&D pipeline</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="predictions" className="w-full">
                    <TabsList className="bg-white dark:bg-finance-blue mb-4 rounded-lg border border-gray-200 dark:border-gray-800 p-1 w-full">
                      <TabsTrigger value="predictions" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                        <LineChart className="h-4 w-4 mr-2" />
                        Predictions
                      </TabsTrigger>
                      <TabsTrigger value="technical" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Technical Analysis
                      </TabsTrigger>
                      <TabsTrigger value="fundamentals" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                        <Layers className="h-4 w-4 mr-2" />
                        Fundamentals
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="predictions" className="mt-2">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <LineChart className="mr-2 h-5 w-5 text-finance-teal" />
                            AI Price Predictions
                          </CardTitle>
                          <CardDescription>
                            Predictions based on our deep learning models and market sentiment analysis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(predictionData).map(([term, data]) => (
                              <div 
                                key={term} 
                                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-finance-blue"
                              >
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium capitalize">
                                    {term.replace(/([A-Z])/g, ' $1').trim()}
                                  </h3>
                                  <div className={`flex items-center p-1.5 rounded-full ${
                                    data.direction === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    data.direction === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                  }`}>
                                    {data.direction === 'up' ? (
                                      <TrendingUp className="h-4 w-4" />
                                    ) : data.direction === 'down' ? (
                                      <TrendingDown className="h-4 w-4" />
                                    ) : (
                                      <ArrowRight className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2 mb-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {term === 'shortTerm' ? '1-2 Weeks' :
                                     term === 'mediumTerm' ? '1-3 Months' : '6-12 Months'}
                                  </span>
                                </div>
                                
                                <div className="flex items-end justify-between mb-2">
                                  <div>
                                    <div className="text-3xl font-bold mb-1">
                                      {data.change}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Expected change
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-medium">
                                      {data.probability}%
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Confidence
                                    </div>
                                  </div>
                                </div>
                                
                                <Progress 
                                  value={data.probability} 
                                  className="h-1.5 mt-2" 
                                  indicatorClassName={
                                    data.direction === 'up' ? 'bg-finance-positive' :
                                    data.direction === 'down' ? 'bg-finance-negative' : 'bg-gray-500'
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200 flex items-start">
                            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p>
                              Our AI models are continuously learning and adapting. Predictions are based on historical data, market trends, and sentiment analysis from news and social media. Past performance doesn't guarantee future results.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="technical" className="mt-2">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle>Technical Analysis</CardTitle>
                          <CardDescription>
                            Technical indicators and chart patterns
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {technicalIndicators.map((indicator, index) => (
                              <div 
                                key={index}
                                className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-finance-blue"
                              >
                                <div className="flex justify-between mb-2">
                                  <h3 className="font-medium">{indicator.name}</h3>
                                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    indicator.interpretation === 'Bullish' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    indicator.interpretation === 'Bearish' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  }`}>
                                    {indicator.interpretation}
                                  </span>
                                </div>
                                <div className="text-lg font-bold">{indicator.value}</div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{indicator.details}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6 text-center">
                            <Button className="bg-finance-teal hover:bg-finance-teal-dark text-white">
                              View Detailed Technical Analysis
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="fundamentals" className="mt-2">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle>Fundamental Analysis</CardTitle>
                          <CardDescription>
                            Financial metrics and company fundamentals
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Metric</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Value</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Context</th>
                                </tr>
                              </thead>
                              <tbody>
                                {financialMetrics.map((metric, index) => (
                                  <tr 
                                    key={index}
                                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                  >
                                    <td className="py-3 px-4 font-medium">{metric.name}</td>
                                    <td className="py-3 px-4">{metric.value}</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{metric.comparison}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-6 text-center">
                            <Button className="bg-finance-teal hover:bg-finance-teal-dark text-white">
                              View Full Financial Reports
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <Card className="border border-gray-200 dark:border-gray-800">
                  <CardContent className="flex flex-col items-center justify-center p-12">
                    <LineChart className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Stock Selected</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                      Select a stock from the list to view detailed analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StockAnalysis;

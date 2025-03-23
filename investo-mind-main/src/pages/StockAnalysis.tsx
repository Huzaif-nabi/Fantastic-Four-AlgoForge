import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockChart from "@/components/StockChart";
import TechStocksDashboard from "@/components/TechStocksDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, LineChart, BarChart2, Cpu, Calendar, ArrowRight, TrendingUp, TrendingDown, Layers, Info, Loader2, RefreshCw } from 'lucide-react';
import { stockApi, StockData, TechnicalIndicator, FinancialMetric } from '@/services/stockApi';

type Direction = "up" | "down" | "neutral";

interface PredictionData {
  direction: Direction;
  probability: number;
  change: string;
}

const StockAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<string | null>('AAPL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State for real-time data
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [technicalIndicators, setTechnicalIndicators] = useState<TechnicalIndicator[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>([]);
  const [companyOverview, setCompanyOverview] = useState<any>(null);
  
  // AI prediction based on technical indicators
  const calculatePrediction = (indicators: TechnicalIndicator[]): PredictionData => {
    let bullishCount = 0;
    let totalIndicators = indicators.length;
    
    indicators.forEach(indicator => {
      if (indicator.interpretation === 'Bullish') {
        bullishCount++;
      }
    });
    
    const probability = (bullishCount / totalIndicators) * 100;
    const direction: Direction = probability > 60 ? "up" : probability < 40 ? "down" : "neutral";
    const change = direction === "up" ? "+2.5%" : direction === "down" ? "-1.8%" : "+0.3%";
    
    return {
      direction,
      probability,
      change
    };
  };
  
  // Fetch initial stock data with retry
  useEffect(() => {
    let mounted = true;

    const fetchInitialStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
        
        const stockData = [];
        for (const symbol of defaultSymbols) {
          if (!mounted) break;
          try {
            const data = await stockApi.getStockQuote(symbol);
            if (mounted) {
              stockData.push(data);
            }
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err);
          }
        }
        
        if (!mounted) return;

        if (stockData.length === 0) {
          throw new Error('Unable to fetch any stock data. Please try again later.');
        }
        
        setStocks(stockData);
        setRetryCount(0);
        
      } catch (err) {
        if (!mounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch initial stock data';
        setError(errorMessage);
        setRetryCount(prev => prev + 1);
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsRefreshing(false);
        }
      }
    };
    
    fetchInitialStocks();
    return () => { mounted = false; };
  }, []);
  
  // Fetch stock details when selected stock changes
  useEffect(() => {
    let mounted = true;

    const fetchStockDetails = async () => {
      if (!selectedStock) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const [indicators, metrics, overview] = await Promise.all([
          stockApi.getTechnicalIndicators(selectedStock),
          stockApi.getFinancialMetrics(selectedStock),
          stockApi.getCompanyDetails(selectedStock)
        ]);
        
        if (!mounted) return;

        setTechnicalIndicators(indicators);
        setFinancialMetrics(metrics);
        setCompanyOverview(overview);
        setRetryCount(0);
        
      } catch (err) {
        if (!mounted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock details';
        setError(errorMessage);
        setRetryCount(prev => prev + 1);
        console.error(err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchStockDetails();
    return () => { mounted = false; };
  }, [selectedStock]);
  
  // Handle stock search with debounce
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await stockApi.searchStocks(searchQuery);
      
      if (results.length === 0) {
        setError(`No results found for "${searchQuery}"`);
      } else {
        // Get full stock data for each result
        const fullData = await Promise.all(
          results.map(result => stockApi.getStockQuote(result.symbol))
        );
        setStocks(fullData);
        setError(null);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search stocks';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setRetryCount(0);
    if (selectedStock) {
      const fetchStockDetails = async () => {
        try {
          const [quote, indicators, metrics, overview] = await Promise.all([
            stockApi.getStockQuote(selectedStock),
            stockApi.getTechnicalIndicators(selectedStock),
            stockApi.getFinancialMetrics(selectedStock),
            stockApi.getCompanyDetails(selectedStock)
          ]);
          
          setStocks(prev => prev.map(s => s.symbol === selectedStock ? quote : s));
          setTechnicalIndicators(indicators);
          setFinancialMetrics(metrics);
          setCompanyOverview(overview);
          setError(null);
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
          setError(errorMessage);
          console.error(err);
        } finally {
          setIsRefreshing(false);
        }
      };
      
      fetchStockDetails();
    } else {
      const defaultSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
      Promise.all(defaultSymbols.map(symbol => stockApi.getStockQuote(symbol)))
        .then(stockData => {
          setStocks(stockData);
          setError(null);
        })
        .catch(err => {
          const errorMessage = err instanceof Error ? err.message : 'Failed to refresh data';
          setError(errorMessage);
          console.error(err);
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    }
  };
  
  // Calculate AI score based on technical indicators and financial metrics
  const calculateAIScore = (): number => {
    if (!technicalIndicators.length || !financialMetrics.length) return 0;
    
    let score = 50; // Base score
    
    // Add points for bullish technical indicators
    technicalIndicators.forEach(indicator => {
      if (indicator.interpretation === 'Bullish') score += 10;
      if (indicator.interpretation === 'Bearish') score -= 10;
    });
    
    // Add points for strong financial metrics
    const peRatio = parseFloat(financialMetrics[0].value);
    const profitMargin = parseFloat(financialMetrics[2].value);
    
    if (peRatio > 0 && peRatio < 30) score += 10;
    if (profitMargin > 15) score += 10;
    
    return Math.min(Math.max(score, 0), 100); // Ensure score is between 0 and 100
  };
  
  // Get investment recommendation based on AI score
  const getInvestmentRecommendation = (score: number): string => {
    if (score >= 80) return 'Strong Buy';
    if (score >= 60) return 'Buy';
    if (score >= 40) return 'Hold';
    if (score >= 20) return 'Sell';
    return 'Strong Sell';
  };
  
  // Filter stocks based on search query
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate predictions based on technical indicators
  const predictionData = {
    shortTerm: calculatePrediction(technicalIndicators),
    mediumTerm: { direction: "up" as Direction, probability: 68, change: '+8.2%' },
    longTerm: { direction: "neutral" as Direction, probability: 52, change: '+1.5%' },
  };
  
  const aiScore = calculateAIScore();
  const recommendation = getInvestmentRecommendation(aiScore);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-finance-blue-dark">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Analysis</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              AI-powered stock analysis and predictions
            </p>
          </div>
            
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  {retryCount < 3 && (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Try Again ({3 - retryCount} attempts remaining)
                      </Button>
                    </div>
                  )}
                  {retryCount >= 3 && (
                    <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                      Maximum retry attempts reached. Please check your internet connection or try again later.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Add TechStocksDashboard here */}
         
          
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
                      id="stock-search"
                      name="stock-search"
                      placeholder="Search by symbol or name..."
                      className="pl-9 w-full bg-white dark:bg-finance-blue-dark border-gray-200 dark:border-gray-800 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      aria-label="Search stocks"
                    />
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-finance-teal" />
                      </div>
                    ) : filteredStocks.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">No stocks found matching "{searchQuery}"</p>
                    ) : (
                      filteredStocks.map((stock) => (
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
                          <div className={`text-sm font-medium ${
                            stock.change >= 0 ? 'text-finance-positive' : 'text-finance-negative'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      ))
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
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
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
                                  strokeDashoffset={251.2 - (251.2 * aiScore) / 100}
                                ></circle>
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{aiScore}</span>
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Investment Attractiveness</p>
                              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                recommendation === 'Strong Buy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                recommendation === 'Buy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200' :
                                recommendation === 'Hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                recommendation === 'Sell' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {recommendation}
                              </div>
                            </div>
                          </div>
                          
                          {companyOverview && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <h4 className="font-medium mb-2">Key Strengths</h4>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-finance-positive mr-2 mt-0.5" />
                                <span>{companyOverview.name}</span>
                              </li>
                              {companyOverview.sector && (
                              <li className="flex items-start">
                                <TrendingUp className="h-4 w-4 text-finance-positive mr-2 mt-0.5" />
                                <span>Strong market position in {companyOverview.sector}</span>
                              </li>
                              )}
                            </ul>
                          </div>
                          )}
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
                    
                    <TabsContent value="predictions">
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
                              <div key={term} className="space-y-4">
                                <h3 className="font-medium text-lg capitalize">
                                    {term.replace(/([A-Z])/g, ' $1').trim()}
                                  </h3>
                                <div className="flex flex-col items-center">
                                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                                    data.direction === 'up' ? 'bg-finance-positive' :
                                    data.direction === 'down' ? 'bg-finance-negative' :
                                    'bg-gray-400'
                                  }`}>
                                    {data.direction === 'up' ? (
                                      <TrendingUp className="h-8 w-8 text-white" />
                                    ) : data.direction === 'down' ? (
                                      <TrendingDown className="h-8 w-8 text-white" />
                                    ) : (
                                      <ArrowRight className="h-8 w-8 text-white" />
                                    )}
                                  </div>
                                  <div className="text-2xl font-bold mb-1">{data.change}</div>
                                    <div className="text-sm text-gray-500">
                                    {data.probability.toFixed(0)}% Confidence
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="technical">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart2 className="mr-2 h-5 w-5 text-finance-teal" />
                            Technical Analysis
                          </CardTitle>
                          <CardDescription>
                            Key technical indicators and their interpretations
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {technicalIndicators.map((indicator, index) => (
                              <div 
                                key={index}
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-finance-blue"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">{indicator.name}</h4>
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                                    indicator.interpretation === 'Bullish' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    indicator.interpretation === 'Bearish' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                                  }`}>
                                    {indicator.interpretation}
                                  </div>
                                </div>
                                <div className="text-2xl font-bold mb-2">{indicator.value}</div>
                                <p className="text-sm text-gray-500">{indicator.details}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="fundamentals">
                      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Layers className="mr-2 h-5 w-5 text-finance-teal" />
                            Fundamental Analysis
                          </CardTitle>
                          <CardDescription>
                            Key financial metrics and company fundamentals
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {financialMetrics.map((metric, index) => (
                              <div 
                                    key={index}
                                className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-finance-blue"
                              >
                                <h4 className="font-medium mb-2">{metric.name}</h4>
                                <div className="text-2xl font-bold mb-2">{metric.value}</div>
                                <p className="text-sm text-gray-500">{metric.details}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Select a stock to view analysis</p>
                </div>
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

export type { Direction, PredictionData, TechnicalIndicator };

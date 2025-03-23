import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioSummary from "@/components/PortfolioSummary";
import StockChart from "@/components/StockChart";
import RiskAssessment from "@/components/RiskAssessment";
import NewsCard from "@/components/NewsCard";
import Portfolio from "@/components/Portfolio";
import PerformanceChart from "@/components/PerformanceChart";
import AddInvestmentDialog from "@/components/AddInvestmentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Briefcase, TrendingUp, RefreshCw } from "lucide-react";
import { stockApi, StockData } from '@/services/stockApi';
import { toast } from "@/components/ui/use-toast";

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface Transaction {
  date: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
}

const STORAGE_KEYS = {
  INVESTMENTS: 'investomind_investments',
  TRANSACTIONS: 'investomind_transactions',
  STOCK_DATA: 'investomind_stockdata'
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [investments, setInvestments] = useState<Investment[]>(() => {
    // Load investments from localStorage on initial render
    const savedInvestments = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return savedInvestments ? JSON.parse(savedInvestments) : [];
  });
  const [stockData, setStockData] = useState<Record<string, StockData>>({});
  const [loading, setLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(() => {
    // Load transactions from localStorage on initial render
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  // Load initial data from localStorage
  useEffect(() => {
    const savedInvestments = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    const savedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    const savedStockData = localStorage.getItem(STORAGE_KEYS.STOCK_DATA);

    if (savedInvestments) {
      setInvestments(JSON.parse(savedInvestments));
    }
    if (savedTransactions) {
      setTransactionHistory(JSON.parse(savedTransactions));
    }
    if (savedStockData) {
      setStockData(JSON.parse(savedStockData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STOCK_DATA, JSON.stringify(stockData));
  }, [stockData]);

  // Calculate portfolio value
  const calculatePortfolioValue = () => {
    if (!investments.length) return 0;
    
    const total = investments.reduce((total, investment) => {
      const stockInfo = stockData[investment.symbol];
      const currentPrice = stockInfo?.price || investment.purchasePrice;
      return total + (currentPrice * investment.shares);
    }, 0);
    
    return Number(total.toFixed(2));
  };

  // Calculate portfolio performance
  const calculatePortfolioPerformance = () => {
    if (!investments.length) return { change: 0, changePercent: 0 };

    const totalValue = calculatePortfolioValue();
    const totalCost = investments.reduce((total, investment) => {
      return total + (investment.purchasePrice * investment.shares);
    }, 0);
    
    const change = Number((totalValue - totalCost).toFixed(2));
    const changePercent = Number(((change / totalCost) * 100).toFixed(2));
    
    return {
      change,
      changePercent: isNaN(changePercent) ? 0 : changePercent
    };
  };

  // Fetch stock data for all investments
  const fetchStockData = async () => {
    if (investments.length === 0) {
      setStockData({});
      return;
    }

    try {
      setLoading(true);
      const data: Record<string, StockData> = {};
      
      // Fetch data for all investments in parallel
      const promises = investments.map(investment => 
        stockApi.getStockQuote(investment.symbol)
          .then(quote => {
            data[investment.symbol] = {
              ...quote,
              price: Number(quote.price),
              change: Number(quote.change),
              changePercent: Number(quote.changePercent),
              high: Number(quote.high),
              low: Number(quote.low),
              open: Number(quote.open),
              previousClose: Number(quote.previousClose),
              volume: Number(quote.volume)
            };
          })
          .catch(error => {
            console.error(`Error fetching data for ${investment.symbol}:`, error);
            // Use fallback data or last known price
            data[investment.symbol] = {
              symbol: investment.symbol,
              name: investment.name,
              price: Number(investment.purchasePrice),
              change: 0,
              changePercent: 0,
              volume: 0,
              high: Number(investment.purchasePrice),
              low: Number(investment.purchasePrice),
              open: Number(investment.purchasePrice),
              previousClose: Number(investment.purchasePrice)
            };
          })
      );

      await Promise.all(promises);
      setStockData(data);
      
      // Log the fetched data for debugging
      console.log('Fetched stock data:', data);
      
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Effect to update stock data periodically
  useEffect(() => {
    // Fetch immediately when investments change
    fetchStockData();
    
    // Set up interval for real-time updates (every 30 seconds)
    const interval = setInterval(fetchStockData, 30 * 1000);
    return () => clearInterval(interval);
  }, [investments]);

  // Handle adding new investment
  const handleAddInvestment = async (investment: Investment) => {
    try {
      // First fetch the current stock data for the new investment
      const quote = await stockApi.getStockQuote(investment.symbol);
      
      // Update stock data with the new quote
      const updatedStockData = {
        ...stockData,
        [investment.symbol]: {
          ...quote,
          price: Number(quote.price),
          change: Number(quote.change),
          changePercent: Number(quote.changePercent)
        }
      };
      setStockData(updatedStockData);

      // Add or update the investment
      const updatedInvestments = [...investments];
      const existingIndex = updatedInvestments.findIndex(inv => inv.symbol === investment.symbol);
      
      if (existingIndex >= 0) {
        // Update existing investment
        const existing = updatedInvestments[existingIndex];
        const newShares = existing.shares + investment.shares;
        const newAvgPrice = ((existing.shares * existing.purchasePrice) + 
                           (investment.shares * investment.purchasePrice)) / newShares;
        
        updatedInvestments[existingIndex] = {
          ...existing,
          shares: newShares,
          purchasePrice: Number(newAvgPrice.toFixed(2))
        };
      } else {
        // Add new investment
        updatedInvestments.push({
          ...investment,
          purchasePrice: Number(investment.purchasePrice.toFixed(2))
        });
      }
      
      // Update investments state
      setInvestments(updatedInvestments);

      // Add to transaction history
      const newTransaction: Transaction = {
        date: new Date().toISOString(),
        symbol: investment.symbol,
        type: 'buy',
        shares: investment.shares,
        price: Number(investment.purchasePrice)
      };
      setTransactionHistory(prev => [...prev, newTransaction]);

      toast({
        title: "Investment Added",
        description: `Successfully added ${investment.shares} shares of ${investment.symbol}`,
      });

    } catch (error) {
      console.error(`Error adding investment for ${investment.symbol}:`, error);
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle updating existing investment
  const handleUpdateInvestment = async (symbol: string, newShares: number) => {
    try {
      const investment = investments.find(inv => inv.symbol === symbol);
      if (!investment) return;

      const currentPrice = stockData[symbol]?.price || investment.purchasePrice;
      const sharesDiff = newShares - investment.shares;

      // Update transaction history
      const newTransaction: Transaction = {
        date: new Date().toISOString(),
        symbol,
        type: sharesDiff > 0 ? 'buy' : 'sell',
        shares: Math.abs(sharesDiff),
        price: currentPrice
      };
      setTransactionHistory(prev => [...prev, newTransaction]);

      // Update investments
      if (newShares === 0) {
        // Remove investment if shares become 0
        const updatedInvestments = investments.filter(inv => inv.symbol !== symbol);
        setInvestments(updatedInvestments);
        
        toast({
          title: "Investment Removed",
          description: `Successfully sold all shares of ${symbol}`,
        });
      } else {
        // Update investment shares
        const updatedInvestments = investments.map(inv =>
          inv.symbol === symbol
            ? { ...inv, shares: newShares }
            : inv
        );
        setInvestments(updatedInvestments);

        toast({
          title: "Investment Updated",
          description: `Successfully ${sharesDiff > 0 ? 'bought' : 'sold'} ${Math.abs(sharesDiff)} shares of ${symbol}`,
        });
      }

      // Fetch updated stock data
      await fetchStockData();
    } catch (error) {
      console.error(`Error updating investment for ${symbol}:`, error);
      toast({
        title: "Error",
        description: "Failed to update investment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-finance-blue-dark">
      <Navbar />
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Welcome back! Here's an overview of your investments.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <AddInvestmentDialog 
                onAddInvestment={handleAddInvestment}
                existingInvestments={investments}
                onUpdateInvestment={handleUpdateInvestment}
              />
              <Button 
                variant="outline" 
                className="flex items-center"
                onClick={fetchStockData}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
            </div>
          </div>

          <PortfolioSummary 
            totalValue={calculatePortfolioValue()}
            performance={calculatePortfolioPerformance()}
            investments={investments}
            stockData={stockData}
          />

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="bg-white dark:bg-finance-blue rounded-lg border border-gray-200 dark:border-gray-800 p-1">
              <TabsTrigger value="overview"><BarChart3 className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
              <TabsTrigger value="portfolio"><Briefcase className="h-4 w-4 mr-2" /> Portfolio</TabsTrigger>
              <TabsTrigger value="performance"><TrendingUp className="h-4 w-4 mr-2" /> Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-2">
              {investments.length > 0 ? (
                <>
                  {investments.map((investment) => (
                    <StockChart 
                      key={investment.symbol}
                      symbol={investment.symbol}
                      name={investment.name}
                    />
                  ))}
                  <RiskAssessment investments={investments} stockData={stockData} />
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No investments yet. Add your first investment to get started!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6 mt-2">
              <Portfolio 
                investments={investments}
                stockData={stockData}
                onUpdate={handleUpdateInvestment}
              />
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-2">
              <PerformanceChart 
                investments={investments}
                stockData={stockData}
              />
              
              {/* Transaction History */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {transactionHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Date</th>
                            <th className="text-left py-2">Symbol</th>
                            <th className="text-left py-2">Type</th>
                            <th className="text-right py-2">Shares</th>
                            <th className="text-right py-2">Price</th>
                            <th className="text-right py-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionHistory.slice().reverse().map((transaction, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                              <td className="py-2">{transaction.symbol}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  transaction.type === 'buy' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {transaction.type.toUpperCase()}
                                </span>
                              </td>
                              <td className="text-right py-2">{transaction.shares}</td>
                              <td className="text-right py-2">${transaction.price.toFixed(2)}</td>
                              <td className="text-right py-2">
                                ${(transaction.shares * transaction.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">No transactions yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

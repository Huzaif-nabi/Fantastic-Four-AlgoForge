import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, TrendingDown, BarChart2, PieChart, DollarSign, 
  AlertCircle, Plus, Trash2
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockData } from "@/services/stockApi";

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface PortfolioProps {
  investments: Investment[];
  stockData: Record<string, StockData>;
  onUpdate: (symbol: string, newShares: number) => void;
}

const Portfolio = ({ investments, stockData, onUpdate }: PortfolioProps) => {
  const [activeTab, setActiveTab] = useState('holdings');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate position value and performance
  const calculatePosition = (investment: Investment) => {
    const currentPrice = stockData[investment.symbol]?.price || investment.purchasePrice;
    const positionValue = currentPrice * investment.shares;
    const costBasis = investment.purchasePrice * investment.shares;
    const change = positionValue - costBasis;
    const changePercent = costBasis > 0 ? ((change / costBasis) * 100) : 0;

    return {
      value: positionValue,
      change,
      changePercent,
      currentPrice,
      costBasis
    };
  };

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!investments.length) return 0;
    
    return investments.reduce((total, investment) => {
      const position = calculatePosition(investment);
      return total + position.value;
    }, 0);
  };
  
  // Calculate total gain/loss
  const calculateTotalGainLoss = () => {
    if (!investments.length) return 0;
    
    return investments.reduce((total, investment) => {
      const position = calculatePosition(investment);
      return total + position.change;
    }, 0);
  };
  
  // Calculate total percent change
  const calculatePercentChange = () => {
    if (!investments.length) return 0;
    
    const totalCostBasis = investments.reduce((total, investment) => {
      const position = calculatePosition(investment);
      return total + position.costBasis;
    }, 0);
    
    const totalValue = calculateTotalValue();
    return totalCostBasis > 0 ? ((totalValue - totalCostBasis) / totalCostBasis) * 100 : 0;
  };
  
  // Filter investments based on search
  const filteredInvestments = investments.filter(investment => 
    investment.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    investment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate sector allocation
  const calculateSectorAllocation = () => {
    const sectors = investments.reduce((acc, investment) => {
      const sector = stockData[investment.symbol]?.sector || 'Other';
      const currentPrice = stockData[investment.symbol]?.price || investment.purchasePrice;
      const value = currentPrice * investment.shares;
      
      acc[sector] = (acc[sector] || 0) + value;
      return acc;
    }, {} as Record<string, number>);

    const totalValue = calculateTotalValue();
    
    return Object.entries(sectors).map(([name, value]) => ({
      name,
      percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
    }));
  };

  const sectorAllocation = calculateSectorAllocation();
  
  return (
    <div className="space-y-6">
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-xl">Your Portfolio</CardTitle>
              <CardDescription>Manage and track your investments</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white dark:bg-finance-blue rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div className="text-gray-500 dark:text-gray-400 text-sm">Total Portfolio Value</div>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mt-2">
                ${calculateTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {investments.length} {investments.length === 1 ? 'stock' : 'stocks'}
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-finance-blue rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div className="text-gray-500 dark:text-gray-400 text-sm">Total Gain/Loss</div>
                {calculateTotalGainLoss() >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-finance-positive" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-finance-negative" />
                )}
              </div>
              <div className={`text-2xl font-bold mt-2 ${calculateTotalGainLoss() >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                {calculateTotalGainLoss() >= 0 ? '+' : ''}
                ${Math.abs(calculateTotalGainLoss()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm ${calculatePercentChange() >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                {calculatePercentChange() >= 0 ? '+' : ''}
                {calculatePercentChange().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
              </div>
            </div>
            
            <div className="p-4 bg-white dark:bg-finance-blue rounded-lg border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-start">
                <div className="text-gray-500 dark:text-gray-400 text-sm">Total Holdings</div>
                <BarChart2 className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-bold mt-2">
                {investments.reduce((total, inv) => total + inv.shares, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Across {new Set(investments.map(inv => stockData[inv.symbol]?.sector || 'Other')).size} sectors
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white dark:bg-finance-blue mb-4 rounded-lg border border-gray-200 dark:border-gray-800 p-1 w-full">
              <TabsTrigger value="holdings" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                <BarChart2 className="h-4 w-4 mr-2" />
                Holdings
              </TabsTrigger>
              <TabsTrigger value="allocation" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                <PieChart className="h-4 w-4 mr-2" />
                Allocation
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex-1 data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="holdings" className="mt-2">
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search holdings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {filteredInvestments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                        <TableHead className="text-right">Purchase Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">Position Value</TableHead>
                        <TableHead className="text-right">Performance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvestments.map((investment) => {
                        const position = calculatePosition(investment);
                        return (
                          <TableRow key={investment.symbol}>
                            <TableCell className="font-medium">{investment.symbol}</TableCell>
                            <TableCell>{investment.name}</TableCell>
                            <TableCell className="text-right">{investment.shares.toLocaleString()}</TableCell>
                            <TableCell className="text-right">${investment.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right">${position.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right">${position.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell className="text-right">
                              <span className={`flex items-center justify-end ${position.changePercent >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                                {position.changePercent >= 0 ? (
                                  <TrendingUp className="mr-1 h-4 w-4" />
                                ) : (
                                  <TrendingDown className="mr-1 h-4 w-4" />
                                )}
                                {position.changePercent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onUpdate(investment.symbol, 0)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No holdings found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery ? `No results matching "${searchQuery}"` : "You don't have any stocks in your portfolio yet."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" onClick={() => setSearchQuery('')}>Clear Search</Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="allocation" className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-finance-blue p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium mb-4">Sector Allocation</h3>
                  <div className="space-y-4">
                    {sectorAllocation.map((sector, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{sector.name}</span>
                          <span className="text-sm text-gray-500">{sector.percentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={sector.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-finance-blue p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-medium mb-4">Diversification Analysis</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Sector Diversification</span>
                        <span className="text-sm text-gray-500">{Math.min(sectorAllocation.length * 20, 100)}/100</span>
                      </div>
                      <Progress value={Math.min(sectorAllocation.length * 20, 100)} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {sectorAllocation.length < 5 
                          ? "Consider diversifying across more sectors"
                          : "Good sector diversification"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-2">
              <div className="bg-white dark:bg-finance-blue p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-medium mb-4">Portfolio Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Total Return</h4>
                    <div className={`text-2xl font-bold ${calculateTotalGainLoss() >= 0 ? 'text-finance-positive' : 'text-finance-negative'}`}>
                      {calculateTotalGainLoss() >= 0 ? '+' : ''}
                      ${Math.abs(calculateTotalGainLoss()).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-sm ml-2">
                        ({calculatePercentChange() >= 0 ? '+' : ''}{calculatePercentChange().toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Portfolio;
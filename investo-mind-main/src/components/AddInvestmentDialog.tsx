import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { stockApi } from "@/services/stockApi";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Investment {
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  purchaseDate: string;
}

interface AddInvestmentDialogProps {
  onAddInvestment: (investment: Investment) => void;
  existingInvestments: Investment[];
  onUpdateInvestment: (symbol: string, newShares: number) => void;
}

// Predefined popular stocks
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
];

// Sector-based stock suggestions
const SECTOR_STOCKS = {
  Technology: [
    { symbol: 'AMD', name: 'Advanced Micro Devices, Inc.' },
    { symbol: 'CRM', name: 'Salesforce, Inc.' },
    { symbol: 'INTC', name: 'Intel Corporation' },
    { symbol: 'CSCO', name: 'Cisco Systems, Inc.' },
  ],
  Financial: [
    { symbol: 'BAC', name: 'Bank of America Corporation' },
    { symbol: 'GS', name: 'Goldman Sachs Group, Inc.' },
    { symbol: 'MS', name: 'Morgan Stanley' },
    { symbol: 'BLK', name: 'BlackRock, Inc.' },
  ],
  Healthcare: [
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'PFE', name: 'Pfizer Inc.' },
    { symbol: 'UNH', name: 'UnitedHealth Group Incorporated' },
    { symbol: 'ABBV', name: 'AbbVie Inc.' },
  ],
  'Consumer Cyclical': [
    { symbol: 'NKE', name: 'Nike, Inc.' },
    { symbol: 'SBUX', name: 'Starbucks Corporation' },
    { symbol: 'HD', name: 'The Home Depot, Inc.' },
    { symbol: 'MCD', name: "McDonald's Corporation" },
  ],
  Energy: [
    { symbol: 'XOM', name: 'Exxon Mobil Corporation' },
    { symbol: 'CVX', name: 'Chevron Corporation' },
    { symbol: 'COP', name: 'ConocoPhillips' },
    { symbol: 'SLB', name: 'Schlumberger Limited' },
  ],
};

const AddInvestmentDialog = ({ onAddInvestment, existingInvestments, onUpdateInvestment }: AddInvestmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [shares, setShares] = useState("");
  const [transactionType, setTransactionType] = useState("buy");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("popular");
  const [selectedSector, setSelectedSector] = useState<keyof typeof SECTOR_STOCKS>("Technology");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await stockApi.searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching stocks:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = async (stock: { symbol: string; name: string }) => {
    setSelectedStock(stock);
    setSearchResults([]);
    setSearchQuery("");
    
    try {
      const quote = await stockApi.getStockQuote(stock.symbol);
      setCurrentPrice(quote.price);
    } catch (error) {
      console.error("Error fetching stock price:", error);
      setCurrentPrice(null);
    }
  };

  const handleSubmit = () => {
    if (!selectedStock || !shares || !currentPrice) return;

    const sharesNum = parseFloat(shares);
    if (isNaN(sharesNum) || sharesNum <= 0) return;

    const existingInvestment = existingInvestments.find(inv => inv.symbol === selectedStock.symbol);

    if (existingInvestment) {
      // Update existing investment
      const newShares = transactionType === "buy" 
        ? existingInvestment.shares + sharesNum
        : existingInvestment.shares - sharesNum;

      if (newShares < 0) {
        alert("Cannot sell more shares than you own!");
        return;
      }

      onUpdateInvestment(selectedStock.symbol, newShares);
    } else {
      // Add new investment
      if (transactionType === "sell") {
        alert("Cannot sell shares of a stock you don't own!");
        return;
      }

      const newInvestment: Investment = {
        symbol: selectedStock.symbol,
        name: selectedStock.name,
        shares: sharesNum,
        purchasePrice: currentPrice,
        purchaseDate: new Date().toISOString().split('T')[0]
      };
      onAddInvestment(newInvestment);
    }

    // Reset form
    setSelectedStock(null);
    setShares("");
    setCurrentPrice(null);
    setOpen(false);
  };

  const renderStockButton = (stock: { symbol: string; name: string; sector?: string }) => (
    <button
      key={stock.symbol}
      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700 last:border-0"
      onClick={() => handleStockSelect(stock)}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{stock.symbol}</div>
          <div className="text-sm text-gray-500">{stock.name}</div>
        </div>
        {stock.sector && (
          <div className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
            {stock.sector}
          </div>
        )}
      </div>
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-finance-teal hover:bg-finance-teal-dark">
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!selectedStock ? (
            <div className="space-y-4">
              <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="popular" className="flex-1">Popular Stocks</TabsTrigger>
                  <TabsTrigger value="sectors" className="flex-1">Browse by Sector</TabsTrigger>
                  <TabsTrigger value="search" className="flex-1">Search</TabsTrigger>
                </TabsList>

                <TabsContent value="popular" className="border rounded-md mt-4">
                  <div className="max-h-[400px] overflow-y-auto">
                    {POPULAR_STOCKS.map(stock => renderStockButton(stock))}
                  </div>
                </TabsContent>

                <TabsContent value="sectors" className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(SECTOR_STOCKS).map(sector => (
                      <Button
                        key={sector}
                        variant={selectedSector === sector ? "default" : "outline"}
                        onClick={() => setSelectedSector(sector as keyof typeof SECTOR_STOCKS)}
                        className="text-xs"
                      >
                        {sector}
                      </Button>
                    ))}
                  </div>
                  <div className="border rounded-md">
                    <div className="max-h-[400px] overflow-y-auto">
                      {SECTOR_STOCKS[selectedSector].map(stock => renderStockButton({ ...stock, sector: selectedSector }))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="search" className="space-y-4 mt-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search stock symbol or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button onClick={handleSearch} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="border rounded-md">
                      <div className="max-h-[400px] overflow-y-auto">
                        {searchResults.map(stock => renderStockButton(stock))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="font-medium text-lg">{selectedStock.symbol}</div>
                <div className="text-gray-500">{selectedStock.name}</div>
                {currentPrice && (
                  <div className="mt-2 flex items-center text-lg">
                    <span className="text-finance-teal font-medium">
                      ${currentPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <RadioGroup
                  defaultValue="buy"
                  value={transactionType}
                  onValueChange={setTransactionType}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="buy" id="buy" />
                    <Label htmlFor="buy">Buy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sell" id="sell" />
                    <Label htmlFor="sell">Sell</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Number of Shares</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  placeholder="Enter number of shares"
                />
              </div>

              {currentPrice && shares && !isNaN(parseFloat(shares)) && (
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Share Price:</span>
                    <span>${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Number of Shares:</span>
                    <span>{shares}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total Value:</span>
                    <span>${(currentPrice * parseFloat(shares)).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedStock(null)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={!shares || isNaN(parseFloat(shares))}>
                  {transactionType === "buy" ? "Buy Shares" : "Sell Shares"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestmentDialog; 
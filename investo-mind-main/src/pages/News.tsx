
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart2, TrendingUp, TrendingDown, Newspaper, Filter, RefreshCw, Clock, LayoutGrid, LayoutList } from 'lucide-react';

const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [sentimentData, setSentimentData] = useState({
    positive: 62,
    neutral: 28,
    negative: 10,
    overall: 'Bullish'
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mock news data
  const newsItems = [
    {
      title: "Federal Reserve Signals Potential Rate Cut in Coming Months",
      source: "Financial Times",
      date: "2h ago",
      summary: "The Federal Reserve has indicated it may begin cutting interest rates in the coming months amid signs of cooling inflation, according to the latest meeting minutes.",
      url: "#",
      sentiment: "positive" as const,
      impact: "high" as const
    },
    {
      title: "Tech Sector Leads Market Rally as AI Investments Surge",
      source: "Bloomberg",
      date: "5h ago",
      summary: "Technology stocks are leading a broader market rally as investors pour money into companies developing artificial intelligence solutions.",
      url: "#",
      sentiment: "positive" as const,
      impact: "medium" as const
    },
    {
      title: "Oil Prices Fall on Concerns of Global Demand Slowdown",
      source: "Reuters",
      date: "8h ago",
      summary: "Crude oil prices dropped on Wednesday as traders worried about slowing global economic growth and its potential impact on fuel demand.",
      url: "#",
      sentiment: "negative" as const,
      impact: "medium" as const
    },
    {
      title: "Major Retail Chain Announces Store Closures Amid Shift to Online Sales",
      source: "CNBC",
      date: "10h ago",
      summary: "A leading retail chain announced plans to close 150 physical stores nationwide as it accelerates its digital transformation strategy.",
      url: "#",
      sentiment: "neutral" as const,
      impact: "medium" as const
    },
    {
      title: "Pharmaceutical Giant Receives FDA Approval for Breakthrough Drug",
      source: "Wall Street Journal",
      date: "12h ago",
      summary: "A major pharmaceutical company received FDA approval for its groundbreaking treatment, potentially generating billions in revenue.",
      url: "#",
      sentiment: "positive" as const,
      impact: "high" as const
    },
    {
      title: "Central Bank of Europe Maintains Current Interest Rates",
      source: "Reuters",
      date: "1d ago",
      summary: "The European Central Bank announced it would keep interest rates unchanged following its latest policy meeting, meeting market expectations.",
      url: "#",
      sentiment: "neutral" as const,
      impact: "low" as const
    },
    {
      title: "Major Cryptocurrency Exchange Faces Regulatory Scrutiny",
      source: "CoinDesk",
      date: "1d ago",
      summary: "One of the world's largest cryptocurrency exchanges is under investigation by regulators for potential compliance violations.",
      url: "#",
      sentiment: "negative" as const,
      impact: "high" as const
    },
    {
      title: "Electric Vehicle Maker Exceeds Quarterly Delivery Expectations",
      source: "Bloomberg",
      date: "2d ago",
      summary: "A leading electric vehicle manufacturer reported quarterly deliveries that surpassed analyst estimates, sending shares higher in pre-market trading.",
      url: "#",
      sentiment: "positive" as const,
      impact: "medium" as const
    }
  ];
  
  // Filter news based on search query
  const filteredNews = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Top trending topics based on AI analysis
  const trendingTopics = [
    { name: "Interest Rates", sentiment: "positive" },
    { name: "Artificial Intelligence", sentiment: "positive" },
    { name: "Tech Stocks", sentiment: "positive" },
    { name: "Oil Prices", sentiment: "negative" },
    { name: "Retail Industry", sentiment: "neutral" },
  ];
  
  // Top impacted stocks
  const impactedStocks = [
    { symbol: "NVDA", name: "NVIDIA Corp", impact: "positive", change: "+2.4%" },
    { symbol: "JPM", name: "JPMorgan Chase", impact: "positive", change: "+1.8%" },
    { symbol: "XOM", name: "Exxon Mobil", impact: "negative", change: "-1.5%" },
    { symbol: "WMT", name: "Walmart Inc", impact: "neutral", change: "+0.3%" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-finance-blue-dark">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">News & Sentiment</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                AI-analyzed financial news and market sentiment
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
          
          {/* Market Sentiment Overview */}
          <div className="mb-8">
            <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <CardTitle>Market Sentiment Overview</CardTitle>
                <CardDescription>
                  AI-analyzed sentiment from thousands of news sources and social media
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-32 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded"></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-finance-teal" />
                        Overall Market Sentiment
                      </h3>
                      <div className="flex flex-col items-center">
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
                              className="text-finance-positive stroke-current" 
                              strokeWidth="10" 
                              strokeLinecap="round" 
                              cx="50" 
                              cy="50" 
                              r="40" 
                              fill="transparent"
                              strokeDasharray="251.2"
                              strokeDashoffset={(251.2 * (100 - sentimentData.positive)) / 100}
                            ></circle>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-2xl font-bold">{sentimentData.overall}</div>
                            <div className="text-sm text-gray-500">Sentiment</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-finance-teal" />
                        Sentiment Breakdown
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-finance-positive">Positive</span>
                            <span>{sentimentData.positive}%</span>
                          </div>
                          <Progress value={sentimentData.positive} className="h-2" indicatorClassName="bg-finance-positive" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-gray-500">Neutral</span>
                            <span>{sentimentData.neutral}%</span>
                          </div>
                          <Progress value={sentimentData.neutral} className="h-2" indicatorClassName="bg-gray-400" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <span className="font-medium text-finance-negative">Negative</span>
                            <span>{sentimentData.negative}%</span>
                          </div>
                          <Progress value={sentimentData.negative} className="h-2" indicatorClassName="bg-finance-negative" />
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                        Based on 3,724 news articles from the past 24 hours
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4 flex items-center">
                        <Newspaper className="mr-2 h-5 w-5 text-finance-teal" />
                        Trending Topics
                      </h3>
                      <div className="space-y-2">
                        {trendingTopics.map((topic, index) => (
                          <div key={index} className="flex justify-between items-center p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-finance-blue">
                            <span className="font-medium">{topic.name}</span>
                            <Badge variant="outline" className={
                              topic.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              topic.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }>
                              {topic.sentiment === 'positive' ? (
                                <TrendingUp className="mr-1 h-3 w-3" />
                              ) : topic.sentiment === 'negative' ? (
                                <TrendingDown className="mr-1 h-3 w-3" />
                              ) : null}
                              {topic.sentiment}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* News Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters panel */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search news..."
                      className="pl-9 w-full bg-white dark:bg-finance-blue-dark border-gray-200 dark:border-gray-800 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time Period
                    </label>
                    <Select defaultValue="24h">
                      <SelectTrigger className="w-full bg-white dark:bg-finance-blue-dark">
                        <SelectValue placeholder="Select time period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6h">Last 6 hours</SelectItem>
                        <SelectItem value="24h">Last 24 hours</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sentiment
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 cursor-pointer">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        Positive
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 cursor-pointer">
                        Neutral
                      </Badge>
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 cursor-pointer">
                        <TrendingDown className="mr-1 h-3 w-3" />
                        Negative
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sources
                    </label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full bg-white dark:bg-finance-blue-dark">
                        <SelectValue placeholder="Select sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="major">Major Publications</SelectItem>
                        <SelectItem value="financial">Financial Press</SelectItem>
                        <SelectItem value="blogs">Blogs & Analysis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">Impacted Stocks</h3>
                    <div className="space-y-2">
                      {impactedStocks.map((stock, index) => (
                        <div key={index} className="flex justify-between items-center p-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-finance-blue">
                          <div className="flex items-center">
                            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-white font-bold mr-2 ${
                              stock.impact === 'positive' ? 'bg-finance-positive' :
                              stock.impact === 'negative' ? 'bg-finance-negative' :
                              'bg-gray-500'
                            }`}>
                              {stock.symbol.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                          </div>
                          <div className={`text-sm ${
                            stock.change.startsWith('+') ? 'text-finance-positive' : 
                            stock.change.startsWith('-') ? 'text-finance-negative' : 
                            'text-gray-500'
                          }`}>
                            {stock.change}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* News Panel */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-xl font-bold">Latest News</h2>
                  {filteredNews.length > 0 && (
                    <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                      {filteredNews.length} articles
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[150px] bg-white dark:bg-finance-blue-dark">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="impact">Impact</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                    <Button 
                      variant="ghost" 
                      className={`px-2 py-1 rounded-none ${view === 'grid' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      onClick={() => setView('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`px-2 py-1 rounded-none ${view === 'list' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                      onClick={() => setView('list')}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                  ))}
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-finance-blue">
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No news found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No articles match your search criteria. Try different keywords or clear your filters.
                  </p>
                </div>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                  {filteredNews.map((news, index) => (
                    <NewsCard key={index} {...news} />
                  ))}
                </div>
              )}
              
              {filteredNews.length > 0 && (
                <div className="mt-8 text-center">
                  <Button className="bg-finance-teal hover:bg-finance-teal-dark text-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Load More News
                  </Button>
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

export default News;

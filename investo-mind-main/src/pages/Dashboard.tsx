
import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioSummary from "@/components/PortfolioSummary";
import StockChart from "@/components/StockChart";
import RiskAssessment from "@/components/RiskAssessment";
import NewsCard from "@/components/NewsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, BarChart3, Briefcase, TrendingUp, Filter, RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const mockNews = [
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
    }
  ];
  
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
              <Button className="flex items-center bg-finance-teal hover:bg-finance-teal-dark">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Investment
              </Button>
              <Button variant="outline" className="flex items-center">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
          
          {/* Portfolio Summary */}
          <div className="mb-8">
            <PortfolioSummary />
          </div>
          
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <TabsList className="bg-white dark:bg-finance-blue mb-4 sm:mb-0 rounded-lg border border-gray-200 dark:border-gray-800 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-finance-teal data-[state=active]:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance
                </TabsTrigger>
              </TabsList>
              
              <div className="flex w-full sm:w-auto space-x-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search stocks..."
                    className="pl-9 h-10 bg-white dark:bg-finance-blue border-gray-200 dark:border-gray-800 rounded-lg"
                  />
                </div>
                <Button variant="outline" className="h-10 px-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
            
            <TabsContent value="overview" className="space-y-6 mt-2">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <StockChart symbol="AAPL" name="Apple Inc." />
                    <StockChart symbol="MSFT" name="Microsoft Corporation" />
                  </div>
                  
                  <RiskAssessment />
                </div>
                
                <div className="xl:col-span-1">
                  <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow duration-300 h-full">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Latest Market News</span>
                        <Button variant="ghost" size="sm" className="text-finance-teal">
                          View All
                        </Button>
                      </CardTitle>
                      <CardDescription>
                        AI-analyzed news that may impact your portfolio
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {mockNews.map((news, index) => (
                        <NewsCard key={index} {...news} />
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="space-y-6 mt-2">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Your Portfolio</CardTitle>
                  <CardDescription>
                    Manage and analyze your investment holdings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                    Portfolio details will be displayed here. Switch to the Overview tab to see your dashboard.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6 mt-2">
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle>Investment Performance</CardTitle>
                  <CardDescription>
                    Track and analyze your investment performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-center py-12">
                    Performance metrics will be displayed here. Switch to the Overview tab to see your dashboard.
                  </p>
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

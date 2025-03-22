
import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart2, LineChart } from 'lucide-react';

const Hero = () => {
  const elementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    elementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      elementsRef.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-[-1] bg-gradient-radial from-white to-blue-50 dark:from-finance-blue-dark dark:to-black"></div>
      <div className="absolute inset-0 z-[-1] bg-mesh-pattern opacity-40"></div>
      
      {/* Animated Shapes */}
      <div className="absolute top-1/4 right-[15%] w-64 h-64 bg-finance-teal/5 rounded-full filter blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 left-[15%] w-96 h-96 bg-finance-gold/5 rounded-full filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      
      {/* Hero Content */}
      <div className="max-w-5xl mx-auto text-center z-10">
        <div 
          ref={(el) => (elementsRef.current[0] = el)} 
          className="animate-on-scroll mb-3"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-finance-teal/10 text-finance-teal border border-finance-teal/20">
            <TrendingUp className="w-4 h-4 mr-1" />
            AI-Powered Investment Solutions
          </span>
        </div>
        
        <h1 
          ref={(el) => (elementsRef.current[1] = el)} 
          className="animate-on-scroll mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-finance-blue via-finance-teal to-finance-blue-dark bg-clip-text text-transparent"
          style={{ animationDelay: '0.1s' }}
        >
          Intelligent Investing <br className="hidden sm:block" />
          For Everyone
        </h1>
        
        <p 
          ref={(el) => (elementsRef.current[2] = el)} 
          className="animate-on-scroll mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-balance"
          style={{ animationDelay: '0.2s' }}
        >
          Make data-driven investment decisions with our AI-powered financial analytics platform. 
          Get personalized insights, real-time risk assessment, and predictive market analysis.
        </p>
        
        <div 
          ref={(el) => (elementsRef.current[3] = el)} 
          className="animate-on-scroll mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <Link to="/dashboard">
            <Button className="px-8 py-6 bg-finance-blue hover:bg-finance-blue-light text-white rounded-xl transition-all duration-300 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1">
              Try Dashboard
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Button variant="outline" className="px-8 py-6 rounded-xl text-lg border-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-300">
            Learn More
          </Button>
        </div>
      </div>
      
      {/* Dashboard Preview */}
      <div 
        ref={(el) => (elementsRef.current[4] = el)} 
        className="animate-on-scroll mt-20 w-full max-w-6xl relative"
        style={{ animationDelay: '0.5s' }}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 transform hover:scale-[1.01] transition-transform duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30 z-10"></div>
          
          {/* Mock Dashboard UI */}
          <div className="bg-white dark:bg-finance-blue p-4 rounded-t-2xl border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="font-medium text-sm text-gray-500 dark:text-gray-400">InvestoMind Dashboard</div>
            <div className="w-16"></div> {/* For balance */}
          </div>
          
          <div className="bg-gray-50 dark:bg-finance-blue-dark p-8 flex flex-col md:flex-row gap-4">
            {/* Charts Panel */}
            <div className="flex-1 glass-card dark:glass-card-dark rounded-xl p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-finance-blue dark:text-white">Portfolio Performance</h3>
                <BarChart2 className="text-finance-teal w-5 h-5" />
              </div>
              <div className="h-48 bg-gradient-to-r from-finance-teal/20 to-finance-blue/10 dark:from-finance-teal/30 dark:to-finance-blue-light/20 rounded-lg flex items-end pt-8 px-4">
                {[30, 45, 25, 60, 75, 45, 55, 70, 85, 65, 90].map((height, i) => (
                  <div 
                    key={i} 
                    className="w-full h-full flex items-end justify-center mx-1"
                    style={{ animation: `float 3s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }}
                  >
                    <div 
                      className="w-full rounded-t-sm bg-gradient-to-t from-finance-teal to-finance-teal-light opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Stats Panel */}
            <div className="md:w-72 flex flex-col gap-4">
              <div className="glass-card dark:glass-card-dark rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">Risk Level</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">Moderate</span>
                </div>
                <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="glass-card dark:glass-card-dark rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-200">Market Sentiment</h3>
                  <LineChart className="text-finance-teal w-4 h-4" />
                </div>
                <p className="mt-2 text-2xl font-bold text-finance-positive">Bullish</p>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Based on 256 recent news</div>
              </div>
              
              <div className="glass-card dark:glass-card-dark rounded-xl p-4">
                <h3 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Top Recommendation</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">T</div>
                  <div>
                    <p className="font-medium">TSLA</p>
                    <p className="text-finance-positive text-sm flex items-center">+2.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

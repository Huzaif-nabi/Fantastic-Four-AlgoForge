
import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, LineChart, Activity, Gauge, AlertTriangle, Award, Zap, RefreshCw } from 'lucide-react';

const Index = () => {
  const featureSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);

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

    if (featureSectionRef.current) observer.observe(featureSectionRef.current);
    if (ctaSectionRef.current) observer.observe(ctaSectionRef.current);

    return () => {
      if (featureSectionRef.current) observer.unobserve(featureSectionRef.current);
      if (ctaSectionRef.current) observer.unobserve(ctaSectionRef.current);
    };
  }, []);

  const features = [
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Portfolio Analysis",
      description: "AI-driven analysis of your investment portfolio with real-time diversification recommendations."
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: "Stock Price Prediction",
      description: "Deep learning models that forecast stock price direction for timely investment decisions."
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Risk Assessment",
      description: "Run thousands of simulations to assess potential outcomes and risks in your portfolio."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Sentiment Analysis",
      description: "Natural language processing to analyze market news and social media sentiment."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Alerts",
      description: "Instant notifications for significant market movements and investment opportunities."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "AI-Backed Insights",
      description: "Expert-level investment insights powered by advanced artificial intelligence."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <Hero />
      
      {/* Features Section */}
      <div 
        ref={featureSectionRef}
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-finance-blue animate-on-scroll"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Smart Investing
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines advanced AI and financial analytics to give you the edge in the market.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 grid-animation">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                accentColor={index % 3 === 0 ? 'from-finance-teal to-finance-blue-light' : 
                             index % 3 === 1 ? 'from-finance-blue to-finance-teal' : 
                             'from-finance-teal-light to-finance-teal-dark'}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-finance-blue-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              How InvestoMind Works
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform leverages AI to transform complex financial data into actionable insights.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 border-l-2 border-dashed border-gray-300 dark:border-gray-700 h-full top-0 z-0"></div>
            
            <div className="relative z-10 space-y-12">
              {[
                {
                  number: "01",
                  title: "Data Collection and Preprocessing",
                  description: "We gather real-time market data, historical prices, financial news, and social media sentiment to create a comprehensive dataset.",
                  icon: <RefreshCw className="w-6 h-6" />
                },
                {
                  number: "02",
                  title: "AI Model Training",
                  description: "Our deep learning models are trained on vast financial datasets to recognize patterns and predict market movements.",
                  icon: <Gauge className="w-6 h-6" />
                },
                {
                  number: "03",
                  title: "Personalized Analysis",
                  description: "The platform analyzes your specific portfolio and investment goals to provide tailored recommendations.",
                  icon: <TrendingUp className="w-6 h-6" />
                }
              ].map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center">
                  <div className={`md:w-1/2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="glass-card dark:glass-card-dark p-8 rounded-xl max-w-lg mx-auto hover-lift">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-finance-blue dark:bg-finance-teal flex items-center justify-center text-white font-bold text-lg mr-4">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className={`md:w-1/2 hidden md:flex justify-center items-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-finance-teal to-finance-blue-light flex items-center justify-center text-white">
                      {step.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div 
        ref={ctaSectionRef}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-finance-blue to-finance-blue-dark text-white animate-on-scroll"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Ready to Transform Your Investment Strategy?
          </h2>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Join thousands of investors who are already using AI to make smarter, data-driven decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button className="px-8 py-6 bg-white text-finance-blue hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center gap-2 text-lg font-semibold">
                Get Started Now
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-6 border-2 border-white text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-lg font-semibold">
              Book a Demo
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;

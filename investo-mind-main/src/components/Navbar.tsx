
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { BarChart3, LineChart, Newspaper, Home, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', name: 'Home', icon: <Home className="w-4 h-4 mr-2" /> },
    { path: '/dashboard', name: 'Dashboard', icon: <BarChart3 className="w-4 h-4 mr-2" /> },
    { path: '/stock-analysis', name: 'Stock Analysis', icon: <LineChart className="w-4 h-4 mr-2" /> },
    { path: '/news', name: 'News & Sentiment', icon: <Newspaper className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-finance-blue/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-finance-blue to-finance-teal bg-clip-text text-transparent">InvestoMind</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button 
                  variant={isActive(link.path) ? "default" : "ghost"} 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive(link.path) 
                      ? 'bg-finance-blue text-white dark:bg-finance-teal dark:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </Link>
            ))}
            <Button className="ml-4 bg-gradient-to-r from-finance-teal to-finance-teal-light text-white hover:opacity-90 transition-opacity">
              Sign In
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 dark:bg-finance-blue/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path) 
                  ? 'bg-finance-blue text-white dark:bg-finance-teal dark:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <Button className="w-full mt-3 bg-gradient-to-r from-finance-teal to-finance-teal-light text-white hover:opacity-90 transition-opacity">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

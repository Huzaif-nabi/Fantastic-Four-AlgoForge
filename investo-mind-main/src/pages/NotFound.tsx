
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-finance-blue-dark p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <AlertCircle className="h-20 w-20 text-finance-teal" />
            <span className="absolute top-0 right-0 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              404
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            className="w-full sm:w-auto bg-finance-teal hover:bg-finance-teal-dark flex items-center"
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>
          
          <Button 
            variant="outline"
            className="w-full sm:w-auto flex items-center"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

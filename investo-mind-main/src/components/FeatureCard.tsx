
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: string;
}

const FeatureCard = ({ icon, title, description, accentColor = 'from-finance-teal to-finance-teal-light' }: FeatureCardProps) => {
  return (
    <div className="hover-lift group relative bg-white dark:bg-finance-blue-dark rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r group-hover:opacity-100 transition-opacity duration-300" style={{ 
        background: `linear-gradient(to right, var(--${accentColor.split(' ')[0].substring(5)}), var(--${accentColor.split(' ')[1].substring(3)}))` 
      }}></div>
      
      <div className="p-6">
        <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-gradient-to-r text-white" style={{ 
          background: `linear-gradient(to right, var(--${accentColor.split(' ')[0].substring(5)}), var(--${accentColor.split(' ')[1].substring(3)}))` 
        }}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-finance-teal dark:group-hover:text-finance-teal-light transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;

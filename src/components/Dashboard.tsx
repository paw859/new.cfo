import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, AlertTriangle, Loader2 } from 'lucide-react';
import { fetchKPIData, KPIData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

interface DashboardProps {
  onKpiClick?: (kpi: KPIData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onKpiClick }) => {
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap = {
    'Monthly Revenue': DollarSign,
    'Operating Expenses': BarChart3,
    'Net Profit Margin': PieChart,
    'Cash Flow': TrendingUp
  };

  const colorMap = {
    'Monthly Revenue': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Operating Expenses': 'text-blue-600 bg-blue-50 border-blue-200',
    'Net Profit Margin': 'text-purple-600 bg-purple-50 border-purple-200',
    'Cash Flow': 'text-teal-600 bg-teal-50 border-teal-200'
  };

  const hoverColorMap = {
    'Monthly Revenue': 'group-hover:bg-emerald-100 group-hover:border-emerald-300',
    'Operating Expenses': 'group-hover:bg-blue-100 group-hover:border-blue-300',
    'Net Profit Margin': 'group-hover:bg-purple-100 group-hover:border-purple-300',
    'Cash Flow': 'group-hover:bg-teal-100 group-hover:border-teal-300'
  };

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchKPIData();
        setKpis(data);
      } catch (err) {
        setError('Failed to load KPI data');
        console.error('Error fetching KPI data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
    
    // Refresh data every 30 seconds to simulate real-time updates
    const interval = setInterval(loadKPIData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
        >
          Try again
        </button>
      </div>
    );
  }

  if (kpis.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-6 sm:mb-8 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No KPI Data Available</h3>
            <p className="text-sm text-gray-600">Financial metrics will appear here once data is loaded.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {kpis.map((kpi, index) => {
        const IconComponent = iconMap[kpi.title as keyof typeof iconMap] || DollarSign;
        const colorClass = colorMap[kpi.title as keyof typeof colorMap] || 'text-gray-600 bg-gray-50 border-gray-200';
        const hoverColorClass = hoverColorMap[kpi.title as keyof typeof hoverColorMap] || 'group-hover:bg-gray-100 group-hover:border-gray-300';
        
        return (
          <button
            key={index}
            onClick={() => onKpiClick?.(kpi)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 p-4 sm:p-6 transform hover:scale-[1.02] cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={`View details for ${kpi.title}: ${kpi.value}, ${kpi.change} change`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg border transition-all duration-300 ${colorClass} ${hoverColorClass}`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                kpi.trend === 'up' 
                  ? 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200' 
                  : 'bg-red-100 text-red-700 group-hover:bg-red-200'
              }`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                <span>{kpi.change}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {kpi.title}
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                {kpi.value}
              </p>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
              <span className="flex items-center space-x-1">
                <span>Click for detailed analysis</span>
                <span>→</span>
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Dashboard;
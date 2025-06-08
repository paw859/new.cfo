import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, AlertTriangle } from 'lucide-react';
import { fetchKPIData, KPIData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
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
    'Monthly Revenue': 'text-green-600',
    'Operating Expenses': 'text-blue-600',
    'Net Profit Margin': 'text-purple-600',
    'Cash Flow': 'text-teal-600'
  };

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        setLoading(true);
        const data = await fetchKPIData();
        setKpis(data);
        setError(null);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <LoadingSpinner className="h-24" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => {
        const IconComponent = iconMap[kpi.title as keyof typeof iconMap] || DollarSign;
        const colorClass = colorMap[kpi.title as keyof typeof colorMap] || 'text-gray-600';
        
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gray-50 ${colorClass}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
                kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{kpi.change}</span>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
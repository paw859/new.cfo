import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { fetchInsightsData, InsightData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const AIInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const iconMap = {
    opportunity: TrendingUp,
    warning: AlertCircle,
    success: CheckCircle
  };

  const colorMap = {
    opportunity: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    success: 'border-blue-200 bg-blue-50'
  };

  useEffect(() => {
    const loadInsightsData = async () => {
      try {
        setLoading(true);
        const data = await fetchInsightsData();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError('Failed to load AI insights');
        console.error('Error fetching insights data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInsightsData();
    
    // Refresh insights every 60 seconds to simulate AI analysis updates
    const interval = setInterval(loadInsightsData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <LoadingSpinner className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="text-red-600 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = iconMap[insight.type];
          const colorClass = colorMap[insight.type];
          
          return (
            <div key={index} className={`p-4 rounded-lg border-2 ${colorClass} hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]`}>
              <div className="flex items-start space-x-3">
                <IconComponent className="w-5 h-5 mt-1 text-gray-600" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                      {insight.action} →
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {insight.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIInsights;
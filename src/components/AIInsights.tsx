import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, TrendingUp, Target, Zap, BarChart3 } from 'lucide-react';
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

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (confidence >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (confidence >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <Target className="w-3 h-3" />;
    if (confidence >= 75) return <BarChart3 className="w-3 h-3" />;
    return <Zap className="w-3 h-3" />;
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

  const averageConfidence = insights.length > 0 
    ? Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length)
    : 0;

  const highImpactInsights = insights.filter(insight => insight.impact === 'high').length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Avg. Confidence: {averageConfidence}%</span>
              <span>•</span>
              <span>High Impact: {highImpactInsights}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live Analysis</span>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = iconMap[insight.type];
          const colorClass = colorMap[insight.type];
          
          return (
            <div key={index} className={`p-4 rounded-lg border-2 ${colorClass} hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]`}>
              <div className="flex items-start space-x-3">
                <IconComponent className="w-5 h-5 mt-1 text-gray-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 pr-2">{insight.title}</h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline flex items-center space-x-1">
                      <span>{insight.action}</span>
                      <span>→</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(insight.confidence)}`}>
                          {getConfidenceIcon(insight.confidence)}
                          <span>{insight.confidence}%</span>
                        </div>
                      </div>
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {insight.priority} priority
                      </span>
                    </div>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>AI Confidence Level</span>
                      <span>{insight.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                          insight.confidence >= 90 ? 'bg-green-500' :
                          insight.confidence >= 75 ? 'bg-blue-500' :
                          insight.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${insight.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-700">{insights.length}</div>
            <div className="text-xs text-gray-600">Active Insights</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-700">{averageConfidence}%</div>
            <div className="text-xs text-gray-600">Avg Confidence</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-700">{highImpactInsights}</div>
            <div className="text-xs text-gray-600">High Impact</div>
          </div>
        </div>
      </div>

      {/* AI Analysis Footer */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <span className="inline-flex items-center space-x-1">
          <Brain className="w-3 h-3" />
          <span>Powered by advanced machine learning algorithms analyzing 50+ financial indicators</span>
        </span>
      </div>
    </div>
  );
};

export default AIInsights;
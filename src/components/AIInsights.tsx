import React, { useState, useEffect } from 'react';
import { Brain, AlertCircle, CheckCircle, TrendingUp, Target, Zap, BarChart3, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { fetchInsightsData, InsightData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const AIInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<Set<number>>(new Set());

  const iconMap = {
    opportunity: TrendingUp,
    warning: AlertCircle,
    success: CheckCircle
  };

  const colorMap = {
    opportunity: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
    warning: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
    success: 'border-blue-200 bg-blue-50 hover:bg-blue-100'
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (confidence >= 75) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (confidence >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <Target className="w-3 h-3" />;
    if (confidence >= 75) return <BarChart3 className="w-3 h-3" />;
    return <Zap className="w-3 h-3" />;
  };

  const toggleInsightExpansion = (index: number) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const loadInsightsData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const data = await fetchInsightsData();
      setInsights(data);
      setError(null);
    } catch (err) {
      setError('Failed to load AI insights');
      console.error('Error fetching insights data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsightsData();
    
    // Refresh insights every 60 seconds to simulate AI analysis updates
    const interval = setInterval(() => loadInsightsData(true), 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <LoadingSpinner className="h-32" text="Analyzing financial data..." color="purple" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => loadInsightsData()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
        </div>
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h4>
          <p className="text-gray-600 mb-4">AI is analyzing your financial data. Insights will appear here shortly.</p>
          <button
            onClick={() => loadInsightsData()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Refresh Analysis
          </button>
        </div>
      </div>
    );
  }

  const averageConfidence = insights.length > 0 
    ? Math.round(insights.reduce((sum, insight) => sum + insight.confidence, 0) / insights.length)
    : 0;

  const highImpactInsights = insights.filter(insight => insight.priority === 'high').length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
            <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">AI Financial Insights</h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <span>Avg. Confidence: {averageConfidence}%</span>
              <span className="hidden sm:inline">•</span>
              <span>High Priority: {highImpactInsights}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => loadInsightsData(true)}
            disabled={refreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
            aria-label="Refresh insights"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 hidden sm:inline">Live Analysis</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const IconComponent = iconMap[insight.type];
          const colorClass = colorMap[insight.type];
          const isExpanded = expandedInsights.has(index);
          
          return (
            <div key={index} className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.01] ${colorClass}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                    <h4 className="font-semibold text-gray-900 pr-2">{insight.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getImpactColor(insight.priority)}`}>
                        {insight.priority} priority
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                    {isExpanded ? insight.description : `${insight.description.slice(0, 120)}${insight.description.length > 120 ? '...' : ''}`}
                  </p>
                  
                  {insight.description.length > 120 && (
                    <button
                      onClick={() => toggleInsightExpansion(index)}
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                      {isExpanded ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{isExpanded ? 'Show less' : 'Show more'}</span>
                    </button>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
                      <span>{insight.action}</span>
                      <span>→</span>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(insight.confidence)}`}>
                        {getConfidenceIcon(insight.confidence)}
                        <span>{insight.confidence}%</span>
                      </div>
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
                          insight.confidence >= 90 ? 'bg-emerald-500' :
                          insight.confidence >= 75 ? 'bg-blue-500' :
                          insight.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
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
            <div className="text-lg font-bold text-emerald-700">{highImpactInsights}</div>
            <div className="text-xs text-gray-600">High Priority</div>
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
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Calendar, BarChart3, Target, AlertCircle, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { KPIData, fetchKPIHistoricalData, KPIHistoricalData, fetchKPIInsights, KPIInsight } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

interface KPIDetailModalProps {
  kpi: KPIData | null;
  isVisible: boolean;
  onClose: () => void;
}

const KPIDetailModal: React.FC<KPIDetailModalProps> = ({ kpi, isVisible, onClose }) => {
  const [historicalData, setHistoricalData] = useState<KPIHistoricalData[]>([]);
  const [insights, setInsights] = useState<KPIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (isVisible && kpi) {
      loadKPIDetails();
    }
  }, [isVisible, kpi, timeRange]);

  const loadKPIDetails = async () => {
    if (!kpi) return;
    
    setLoading(true);
    try {
      const [historical, kpiInsights] = await Promise.all([
        fetchKPIHistoricalData(kpi.title, timeRange),
        fetchKPIInsights(kpi.title)
      ]);
      
      setHistoricalData(historical);
      setInsights(kpiInsights);
    } catch (error) {
      console.error('Error loading KPI details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible || !kpi) return null;

  const getKPIColor = (title: string) => {
    const colors = {
      'Monthly Revenue': '#10b981',
      'Operating Expenses': '#3b82f6',
      'Net Profit Margin': '#8b5cf6',
      'Cash Flow': '#14b8a6'
    };
    return colors[title as keyof typeof colors] || '#6b7280';
  };

  const formatValue = (value: number, title: string) => {
    if (title === 'Net Profit Margin') {
      return `${value.toFixed(1)}%`;
    }
    if (title === 'Cash Flow') {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {`${kpi.title}: ${formatValue(payload[0].value, kpi.title)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const calculateStats = () => {
    if (historicalData.length < 2) return null;
    
    const values = historicalData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const latest = values[values.length - 1];
    const previous = values[values.length - 2];
    const change = ((latest - previous) / previous) * 100;
    
    return { min, max, avg, change };
  };

  const stats = calculateStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div 
              className="p-3 rounded-lg text-white"
              style={{ backgroundColor: getKPIColor(kpi.title) }}
            >
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.title}</h3>
              <p className="text-gray-600">Detailed Analysis & Historical Trends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="p-8">
              <LoadingSpinner className="h-32" />
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Current Value & Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-700">Current Value</div>
                  <div className="text-2xl font-bold text-blue-900">{kpi.value}</div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>

                {stats && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="text-sm font-medium text-green-700">Average</div>
                      <div className="text-xl font-bold text-green-900">
                        {formatValue(stats.avg, kpi.title)}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="text-sm font-medium text-purple-700">Range</div>
                      <div className="text-sm font-bold text-purple-900">
                        {formatValue(stats.min, kpi.title)} - {formatValue(stats.max, kpi.title)}
                      </div>
                    </div>

                    <div className={`bg-gradient-to-br p-4 rounded-lg border ${
                      stats.change >= 0 
                        ? 'from-emerald-50 to-emerald-100 border-emerald-200' 
                        : 'from-red-50 to-red-100 border-red-200'
                    }`}>
                      <div className={`text-sm font-medium ${
                        stats.change >= 0 ? 'text-emerald-700' : 'text-red-700'
                      }`}>
                        Period Change
                      </div>
                      <div className={`text-xl font-bold ${
                        stats.change >= 0 ? 'text-emerald-900' : 'text-red-900'
                      }`}>
                        {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)}%
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">Historical Trend</h4>
                <div className="flex space-x-2">
                  {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        timeRange === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalData}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={getKPIColor(kpi.title)} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={getKPIColor(kpi.title)} stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => formatValue(value, kpi.title)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={getKPIColor(kpi.title)}
                        strokeWidth={3}
                        fill="url(#colorGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Insights */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">AI-Powered Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 ${
                        insight.type === 'positive' 
                          ? 'bg-green-50 border-green-200' 
                          : insight.type === 'negative'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          insight.type === 'positive' 
                            ? 'bg-green-100' 
                            : insight.type === 'negative'
                            ? 'bg-red-100'
                            : 'bg-blue-100'
                        }`}>
                          {insight.type === 'positive' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : insight.type === 'negative' ? (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          ) : (
                            <Info className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">{insight.title}</h5>
                          <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
                          {insight.recommendation && (
                            <div className="text-xs text-gray-600 bg-white bg-opacity-50 p-2 rounded">
                              <strong>Recommendation:</strong> {insight.recommendation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Indicators</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {historicalData.filter(d => d.value > (stats?.avg || 0)).length}
                    </div>
                    <div className="text-sm text-gray-600">Days Above Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {historicalData.length > 0 ? 
                        ((historicalData.filter((d, i) => i > 0 && d.value > historicalData[i-1].value).length / (historicalData.length - 1)) * 100).toFixed(0) 
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600">Growth Consistency</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      (stats?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats ? (stats.change >= 0 ? 'Positive' : 'Negative') : 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Trend Direction</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIDetailModal;
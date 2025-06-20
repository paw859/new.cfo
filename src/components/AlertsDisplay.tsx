import React, { useState } from 'react';
import { X, AlertTriangle, Info, AlertCircle, CheckCircle, Clock, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Alert } from '../utils/api';

interface AlertsDisplayProps {
  alerts: Alert[];
  onClearAlert: (id: string) => void;
  onClearAll: () => void;
  isVisible: boolean;
  onClose: () => void;
}

const AlertsDisplay: React.FC<AlertsDisplayProps> = ({ 
  alerts, 
  onClearAlert, 
  onClearAll, 
  isVisible, 
  onClose 
}) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info' | 'success'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority' | 'type'>('timestamp');
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isVisible) return null;

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-300';
      case 'info':
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300';
      case 'success':
        return 'border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-300';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300';
    }
  };

  const getPriorityBadge = (priority: Alert['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[priority]}`}>
        {priority} priority
      </span>
    );
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter;
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    switch (sortBy) {
      case 'timestamp':
        return b.timestamp - a.timestamp;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'type':
        const typeOrder = { critical: 4, warning: 3, info: 2, success: 1 };
        return typeOrder[b.type] - typeOrder[a.type];
      default:
        return 0;
    }
  });

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Financial Alerts</h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {alerts.length} total • {criticalCount} critical • {warningCount} warnings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {alerts.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              aria-label="Close alerts"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Alerts</option>
                  <option value="critical">Critical</option>
                  <option value="warning">Warnings</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="timestamp">Time</option>
                  <option value="priority">Priority</option>
                  <option value="type">Type</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {sortedAlerts.length} of {alerts.length} alerts
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-96">
          {sortedAlerts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm ? 'No Matching Alerts' : 'No Alerts'}
                  </h4>
                  <p className="text-gray-600 max-w-md">
                    {searchTerm 
                      ? `No alerts match "${searchTerm}". Try adjusting your search or filters.`
                      : filter === 'all' 
                        ? "All systems are operating normally. Great job!" 
                        : `No ${filter} alerts at this time.`
                    }
                  </p>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-2 rounded-lg p-4 transition-all duration-200 ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                          <h4 className="font-semibold text-gray-900 truncate pr-2">{alert.title}</h4>
                          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                            {getPriorityBadge(alert.priority)}
                            {alert.actionRequired && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200">
                                Action Required
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 leading-relaxed">{alert.message}</p>
                        
                        {/* Expandable Details */}
                        {(alert.threshold !== undefined || alert.currentValue !== undefined) && (
                          <button
                            onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                          >
                            <span>View Details</span>
                            {expandedAlert === alert.id ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        
                        {expandedAlert === alert.id && (
                          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg text-xs space-y-2 border border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium text-gray-700">Source:</span>
                                <span className="ml-1 text-gray-600">{alert.source}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Time:</span>
                                <span className="ml-1 text-gray-600">{formatTimestamp(alert.timestamp)}</span>
                              </div>
                              {alert.threshold !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-700">Threshold:</span>
                                  <span className="ml-1 text-gray-600">{alert.threshold}</span>
                                </div>
                              )}
                              {alert.currentValue !== undefined && (
                                <div>
                                  <span className="font-medium text-gray-700">Current Value:</span>
                                  <span className="ml-1 text-gray-600">{alert.currentValue.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimestamp(alert.timestamp)}</span>
                            <span>•</span>
                            <span>{alert.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onClearAlert(alert.id)}
                      className="ml-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:bg-opacity-50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex-shrink-0"
                      aria-label="Clear alert"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {alerts.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 text-sm text-gray-600">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical ({criticalCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Warning ({warningCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Info ({alerts.filter(a => a.type === 'info').length})</span>
                </div>
              </div>
              <div className="text-xs">
                Alerts refresh automatically with data updates
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsDisplay;
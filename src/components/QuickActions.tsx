import React, { useState } from 'react';
import { FileText, Calculator, DollarSign, PieChart, Download, Send, CheckCircle, Loader2 } from 'lucide-react';

const QuickActions = () => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const actions = [
    { 
      id: 'generate-report',
      icon: FileText, 
      label: 'Generate Report', 
      color: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
      description: 'Create comprehensive financial report'
    },
    { 
      id: 'budget-planning',
      icon: Calculator, 
      label: 'Budget Planning', 
      color: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
      description: 'Plan and optimize budget allocation'
    },
    { 
      id: 'cash-flow-forecast',
      icon: DollarSign, 
      label: 'Cash Flow Forecast', 
      color: 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500',
      description: 'Predict future cash flow patterns'
    },
    { 
      id: 'expense-analysis',
      icon: PieChart, 
      label: 'Expense Analysis', 
      color: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
      description: 'Analyze spending patterns and trends'
    },
    { 
      id: 'export-data',
      icon: Download, 
      label: 'Export Data', 
      color: 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500',
      description: 'Download financial data and reports'
    },
    { 
      id: 'send-to-board',
      icon: Send, 
      label: 'Send to Board', 
      color: 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500',
      description: 'Share insights with board members'
    }
  ];

  const handleActionClick = async (actionId: string) => {
    if (loadingAction || completedActions.has(actionId)) return;

    setLoadingAction(actionId);
    
    // Simulate action processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoadingAction(null);
    setCompletedActions(prev => new Set([...prev, actionId]));
    
    // Reset completed state after 3 seconds
    setTimeout(() => {
      setCompletedActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionId);
        return newSet;
      });
    }, 3000);
  };

  const getActionIcon = (action: typeof actions[0]) => {
    if (loadingAction === action.id) {
      return <Loader2 className="w-5 h-5 animate-spin" />;
    }
    if (completedActions.has(action.id)) {
      return <CheckCircle className="w-5 h-5" />;
    }
    return <action.icon className="w-5 h-5" />;
  };

  const getActionColor = (action: typeof actions[0]) => {
    if (completedActions.has(action.id)) {
      return 'bg-green-500 hover:bg-green-600 focus:ring-green-500';
    }
    return action.color;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="text-xs text-gray-500 hidden sm:block">
          Click any action to execute
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            disabled={loadingAction !== null}
            className={`group ${getActionColor(action)} text-white p-3 sm:p-4 rounded-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${action.color.includes('focus:ring-') ? '' : 'focus:ring-blue-500'}`}
            aria-label={action.description}
            title={action.description}
          >
            <div className="flex-shrink-0">
              {getActionIcon(action)}
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="font-medium text-sm truncate">
                {completedActions.has(action.id) ? 'Completed!' : action.label}
              </div>
              <div className="text-xs opacity-90 hidden sm:block truncate">
                {action.description}
              </div>
            </div>
            
            {/* Loading indicator */}
            {loadingAction === action.id && (
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                <div className="text-xs text-white font-medium">Processing...</div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Status indicator */}
      {(loadingAction || completedActions.size > 0) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {loadingAction ? 'Processing action...' : `${completedActions.size} action(s) completed`}
            </span>
            {loadingAction && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help text */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        These actions integrate with your financial systems to provide real-time insights and automation.
      </div>
    </div>
  );
};

export default QuickActions;
import React from 'react';
import { FileText, Calculator, DollarSign, PieChart, Download, Send } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    { icon: FileText, label: 'Generate Report', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Calculator, label: 'Budget Planning', color: 'bg-green-500 hover:bg-green-600' },
    { icon: DollarSign, label: 'Cash Flow Forecast', color: 'bg-purple-500 hover:bg-purple-600' },
    { icon: PieChart, label: 'Expense Analysis', color: 'bg-orange-500 hover:bg-orange-600' },
    { icon: Download, label: 'Export Data', color: 'bg-teal-500 hover:bg-teal-600' },
    { icon: Send, label: 'Send to Board', color: 'bg-indigo-500 hover:bg-indigo-600' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`${action.color} text-white p-4 rounded-lg flex items-center space-x-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            <action.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
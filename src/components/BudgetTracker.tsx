import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { fetchBudgetData, BudgetData } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const BudgetTracker = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const data = await fetchBudgetData();
        setBudgetCategories(data);
        setError(null);
      } catch (err) {
        setError('Failed to load budget data');
        console.error('Error fetching budget data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
    
    // Refresh budget data every 40 seconds
    const interval = setInterval(loadBudgetData, 40000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
        </div>
        <LoadingSpinner className="h-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Target className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
        </div>
        <div className="text-red-600 text-center py-8">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Budget vs Actual</h3>
      </div>
      <div className="space-y-4">
        {budgetCategories.map((item, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{item.category}</span>
              <div className="flex items-center space-x-2">
                {item.variance > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm font-medium ${
                  item.variance > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {item.variance > 0 ? '+' : ''}{item.variance}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Spent: ${(item.spent / 1000).toFixed(0)}K</span>
              <span>Budget: ${(item.budget / 1000).toFixed(0)}K</span>
            </div>
            <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  item.variance > 0 ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((item.spent / item.budget) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetTracker;
import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { fetchKPIData, KPIData } from '../utils/api';

interface ScenarioInputs {
  revenueChange: number;
  expenseChange: number;
  marketGrowth: number;
}

interface ProjectedResults {
  newRevenue: number;
  newExpenses: number;
  newProfit: number;
  profitChange: number;
}

const ScenarioAnalysis = () => {
  const [baseData, setBaseData] = useState<KPIData[]>([]);
  const [inputs, setInputs] = useState<ScenarioInputs>({
    revenueChange: 0,
    expenseChange: 0,
    marketGrowth: 0
  });
  const [results, setResults] = useState<ProjectedResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBaseData = async () => {
      try {
        const data = await fetchKPIData();
        setBaseData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading base data:', err);
        setLoading(false);
      }
    };

    loadBaseData();
  }, []);

  useEffect(() => {
    if (baseData.length > 0) {
      calculateScenario();
    }
  }, [inputs, baseData]);

  const calculateScenario = () => {
    const revenue = baseData.find(kpi => kpi.title === 'Monthly Revenue')?.rawValue || 2400000;
    const expenses = baseData.find(kpi => kpi.title === 'Operating Expenses')?.rawValue || 1800000;
    const currentProfit = revenue - expenses;

    const newRevenue = revenue * (1 + inputs.revenueChange / 100) * (1 + inputs.marketGrowth / 100);
    const newExpenses = expenses * (1 + inputs.expenseChange / 100);
    const newProfit = newRevenue - newExpenses;
    const profitChange = ((newProfit - currentProfit) / currentProfit) * 100;

    setResults({
      newRevenue,
      newExpenses,
      newProfit,
      profitChange
    });
  };

  const handleInputChange = (field: keyof ScenarioInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetScenario = () => {
    setInputs({
      revenueChange: 0,
      expenseChange: 0,
      marketGrowth: 0
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">What-If Scenario Analysis</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">What-If Scenario Analysis</h3>
        </div>
        <button
          onClick={resetScenario}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Scenario Inputs</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Revenue Change (%)
            </label>
            <input
              type="range"
              min="-50"
              max="50"
              value={inputs.revenueChange}
              onChange={(e) => handleInputChange('revenueChange', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-50%</span>
              <span className="font-medium text-gray-900">{inputs.revenueChange}%</span>
              <span>+50%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Change (%)
            </label>
            <input
              type="range"
              min="-30"
              max="30"
              value={inputs.expenseChange}
              onChange={(e) => handleInputChange('expenseChange', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-30%</span>
              <span className="font-medium text-gray-900">{inputs.expenseChange}%</span>
              <span>+30%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Growth (%)
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              value={inputs.marketGrowth}
              onChange={(e) => handleInputChange('marketGrowth', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-20%</span>
              <span className="font-medium text-gray-900">{inputs.marketGrowth}%</span>
              <span>+20%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Projected Results</h4>
          
          {results && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">New Revenue</span>
                  <span className="font-semibold text-blue-700">
                    ${(results.newRevenue / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">New Expenses</span>
                  <span className="font-semibold text-orange-700">
                    ${(results.newExpenses / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Net Profit</span>
                  <span className="font-semibold text-green-700">
                    ${(results.newProfit / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                results.profitChange >= 0 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  {results.profitChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">Profit Impact:</span>
                  <span className={`font-bold ${
                    results.profitChange >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {results.profitChange >= 0 ? '+' : ''}{results.profitChange.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>AI Insight:</strong> Adjust the sliders above to explore different business scenarios. 
          The model considers market conditions and operational efficiency to project financial outcomes.
        </p>
      </div>
    </div>
  );
};

export default ScenarioAnalysis;
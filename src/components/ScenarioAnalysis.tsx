import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, TrendingDown, Save, Download, BarChart3, PieChart } from 'lucide-react';
import { fetchKPIData, KPIData } from '../utils/api';

interface ScenarioInputs {
  revenueChange: number;
  expenseChange: number;
  marketGrowth: number;
  investmentAmount: number;
  expectedROI: number;
  marketingSpendChange: number;
  rdSpendChange: number;
  operationalEfficiency: number;
}

interface ProjectedResults {
  newRevenue: number;
  newExpenses: number;
  newProfit: number;
  profitChange: number;
  roi: number;
  breakEvenMonths: number;
  cashReserves: number;
  marketShare: number;
}

interface SavedScenario {
  name: string;
  inputs: ScenarioInputs;
  results: ProjectedResults;
  timestamp: number;
}

const ScenarioAnalysis = () => {
  const [baseData, setBaseData] = useState<KPIData[]>([]);
  const [inputs, setInputs] = useState<ScenarioInputs>({
    revenueChange: 0,
    expenseChange: 0,
    marketGrowth: 0,
    investmentAmount: 0,
    expectedROI: 15,
    marketingSpendChange: 0,
    rdSpendChange: 0,
    operationalEfficiency: 0
  });
  const [results, setResults] = useState<ProjectedResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>(() => {
    const saved = localStorage.getItem('saved-scenarios');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareMode, setCompareMode] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<SavedScenario[]>([]);

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

    // Enhanced calculations with new inputs
    const marketGrowthFactor = 1 + inputs.marketGrowth / 100;
    const revenueGrowthFactor = 1 + inputs.revenueChange / 100;
    const operationalEfficiencyFactor = 1 + inputs.operationalEfficiency / 100;
    
    // Calculate new revenue with market growth and operational efficiency
    const newRevenue = revenue * revenueGrowthFactor * marketGrowthFactor * operationalEfficiencyFactor;
    
    // Calculate new expenses with category-specific changes
    const baseExpenseChange = 1 + inputs.expenseChange / 100;
    const marketingImpact = (expenses * 0.2) * (inputs.marketingSpendChange / 100); // 20% of expenses assumed marketing
    const rdImpact = (expenses * 0.15) * (inputs.rdSpendChange / 100); // 15% of expenses assumed R&D
    const newExpenses = (expenses * baseExpenseChange) + marketingImpact + rdImpact + inputs.investmentAmount;
    
    const newProfit = newRevenue - newExpenses;
    const profitChange = ((newProfit - currentProfit) / currentProfit) * 100;
    
    // Calculate ROI on investment
    const roi = inputs.investmentAmount > 0 ? 
      ((newProfit - currentProfit) * 12 / inputs.investmentAmount) * 100 : 0;
    
    // Calculate break-even months for investment
    const monthlyProfitIncrease = (newProfit - currentProfit);
    const breakEvenMonths = inputs.investmentAmount > 0 && monthlyProfitIncrease > 0 ? 
      inputs.investmentAmount / monthlyProfitIncrease : 0;
    
    // Estimate cash reserves (simplified calculation)
    const monthlyCashFlow = newProfit * 0.8; // Assume 80% of profit becomes cash
    const cashReserves = monthlyCashFlow * 6; // 6 months of cash flow
    
    // Estimate market share impact (simplified)
    const marketShareBase = 12; // Assume 12% base market share
    const marketShareChange = (inputs.marketingSpendChange + inputs.rdSpendChange) * 0.1;
    const marketShare = Math.max(0, Math.min(100, marketShareBase + marketShareChange));

    setResults({
      newRevenue,
      newExpenses,
      newProfit,
      profitChange,
      roi,
      breakEvenMonths,
      cashReserves,
      marketShare
    });
  };

  const handleInputChange = (field: keyof ScenarioInputs, value: number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveScenario = () => {
    if (!results) return;
    
    const name = prompt('Enter a name for this scenario:');
    if (name) {
      const scenario: SavedScenario = {
        name,
        inputs: { ...inputs },
        results: { ...results },
        timestamp: Date.now()
      };
      
      const newSavedScenarios = [...savedScenarios, scenario];
      setSavedScenarios(newSavedScenarios);
      localStorage.setItem('saved-scenarios', JSON.stringify(newSavedScenarios));
    }
  };

  const loadScenario = (scenario: SavedScenario) => {
    setInputs(scenario.inputs);
    setCompareMode(false);
  };

  const toggleScenarioForComparison = (scenario: SavedScenario) => {
    setSelectedScenarios(prev => {
      const isSelected = prev.some(s => s.timestamp === scenario.timestamp);
      if (isSelected) {
        return prev.filter(s => s.timestamp !== scenario.timestamp);
      } else if (prev.length < 3) {
        return [...prev, scenario];
      }
      return prev;
    });
  };

  const exportScenarios = () => {
    const dataStr = JSON.stringify(savedScenarios, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-scenarios.json';
    link.click();
  };

  const resetScenario = () => {
    setInputs({
      revenueChange: 0,
      expenseChange: 0,
      marketGrowth: 0,
      investmentAmount: 0,
      expectedROI: 15,
      marketingSpendChange: 0,
      rdSpendChange: 0,
      operationalEfficiency: 0
    });
    setCompareMode(false);
    setSelectedScenarios([]);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Calculator className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Advanced Scenario Analysis</h3>
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
          <h3 className="text-lg font-semibold text-gray-900">Advanced Scenario Analysis</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              compareMode ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-1" />
            Compare
          </button>
          <button
            onClick={saveScenario}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="w-4 h-4 inline mr-1" />
            Save
          </button>
          <button
            onClick={exportScenarios}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4 inline mr-1" />
            Export
          </button>
          <button
            onClick={resetScenario}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {compareMode ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Select Scenarios to Compare (max 3)</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedScenarios.map((scenario) => (
                  <div
                    key={scenario.timestamp}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedScenarios.some(s => s.timestamp === scenario.timestamp)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleScenarioForComparison(scenario)}
                  >
                    <div className="font-medium text-gray-900">{scenario.name}</div>
                    <div className="text-sm text-gray-600">
                      Profit Change: {scenario.results.profitChange.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedScenarios.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Comparison Results</h4>
                <div className="space-y-3">
                  {selectedScenarios.map((scenario, index) => (
                    <div key={scenario.timestamp} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">{scenario.name}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Revenue: ${(scenario.results.newRevenue / 1000000).toFixed(1)}M</div>
                        <div>Profit: ${(scenario.results.newProfit / 1000000).toFixed(1)}M</div>
                        <div>ROI: {scenario.results.roi.toFixed(1)}%</div>
                        <div>Market Share: {scenario.results.marketShare.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Input Controls */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Scenario Parameters</h4>
            
            {/* Core Financial Inputs */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900">Core Financial Changes</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revenue Change: {inputs.revenueChange}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="100"
                  value={inputs.revenueChange}
                  onChange={(e) => handleInputChange('revenueChange', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Change: {inputs.expenseChange}%
                </label>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  value={inputs.expenseChange}
                  onChange={(e) => handleInputChange('expenseChange', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Growth: {inputs.marketGrowth}%
                </label>
                <input
                  type="range"
                  min="-20"
                  max="30"
                  value={inputs.marketGrowth}
                  onChange={(e) => handleInputChange('marketGrowth', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Investment & Strategy Inputs */}
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <h5 className="font-medium text-green-900">Investment & Strategy</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount: ${(inputs.investmentAmount / 1000).toFixed(0)}K
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={inputs.investmentAmount}
                  onChange={(e) => handleInputChange('investmentAmount', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marketing Spend Change: {inputs.marketingSpendChange}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="200"
                  value={inputs.marketingSpendChange}
                  onChange={(e) => handleInputChange('marketingSpendChange', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  R&D Spend Change: {inputs.rdSpendChange}%
                </label>
                <input
                  type="range"
                  min="-50"
                  max="200"
                  value={inputs.rdSpendChange}
                  onChange={(e) => handleInputChange('rdSpendChange', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Operational Efficiency: {inputs.operationalEfficiency}%
                </label>
                <input
                  type="range"
                  min="-20"
                  max="50"
                  value={inputs.operationalEfficiency}
                  onChange={(e) => handleInputChange('operationalEfficiency', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Enhanced Results */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Projected Outcomes</h4>
            
            {results && (
              <div className="space-y-3">
                {/* Financial Results */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-gray-700">New Revenue</div>
                    <div className="font-semibold text-blue-700">
                      ${(results.newRevenue / 1000000).toFixed(2)}M
                    </div>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-sm font-medium text-gray-700">New Expenses</div>
                    <div className="font-semibold text-orange-700">
                      ${(results.newExpenses / 1000000).toFixed(2)}M
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-gray-700">Net Profit</div>
                    <div className="font-semibold text-green-700">
                      ${(results.newProfit / 1000000).toFixed(2)}M
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    results.profitChange >= 0 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="text-sm font-medium text-gray-700">Profit Change</div>
                    <div className={`font-semibold ${
                      results.profitChange >= 0 ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {results.profitChange >= 0 ? '+' : ''}{results.profitChange.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Advanced Metrics */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="font-medium text-purple-900 mb-3">Advanced Metrics</h5>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">ROI on Investment:</span>
                      <span className="font-semibold ml-2">{results.roi.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Break-even:</span>
                      <span className="font-semibold ml-2">
                        {results.breakEvenMonths > 0 ? `${results.breakEvenMonths.toFixed(1)} months` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cash Reserves:</span>
                      <span className="font-semibold ml-2">${(results.cashReserves / 1000000).toFixed(1)}M</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Market Share:</span>
                      <span className="font-semibold ml-2">{results.marketShare.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Impact Summary */}
                <div className={`p-4 rounded-lg border-2 ${
                  results.profitChange >= 10 
                    ? 'bg-green-50 border-green-200' 
                    : results.profitChange >= 0
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {results.profitChange >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                    <span className="font-medium text-gray-900">
                      {results.profitChange >= 10 ? 'Excellent' : 
                       results.profitChange >= 0 ? 'Positive' : 'Negative'} Impact Scenario
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Scenarios */}
      {savedScenarios.length > 0 && !compareMode && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Saved Scenarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedScenarios.slice(-6).map((scenario) => (
              <button
                key={scenario.timestamp}
                onClick={() => loadScenario(scenario)}
                className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="font-medium text-gray-900">{scenario.name}</div>
                <div className="text-sm text-gray-600">
                  Profit: {scenario.results.profitChange >= 0 ? '+' : ''}{scenario.results.profitChange.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(scenario.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>AI-Powered Analysis:</strong> This advanced scenario modeling considers market dynamics, 
          operational efficiency, investment returns, and competitive positioning to provide comprehensive 
          financial projections. Save and compare multiple scenarios to optimize your strategic decisions.
        </p>
      </div>
    </div>
  );
};

export default ScenarioAnalysis;
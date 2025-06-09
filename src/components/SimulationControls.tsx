import React, { useState } from 'react';
import { Settings, RefreshCw, Save, TrendingUp } from 'lucide-react';
import { SimulationConfig, updateSimulationConfig, getSimulationConfig } from '../utils/api';

interface SimulationControlsProps {
  onConfigChange: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>(getSimulationConfig());
  const [savedConfigs, setSavedConfigs] = useState<{ name: string; config: SimulationConfig }[]>(() => {
    const saved = localStorage.getItem('simulation-configs');
    return saved ? JSON.parse(saved) : [];
  });

  const handleConfigUpdate = (field: keyof SimulationConfig, value: number) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    updateSimulationConfig(newConfig);
    onConfigChange();
  };

  const saveConfiguration = () => {
    const name = prompt('Enter a name for this configuration:');
    if (name) {
      const newSavedConfigs = [...savedConfigs, { name, config }];
      setSavedConfigs(newSavedConfigs);
      localStorage.setItem('simulation-configs', JSON.stringify(newSavedConfigs));
    }
  };

  const loadConfiguration = (savedConfig: SimulationConfig) => {
    setConfig(savedConfig);
    updateSimulationConfig(savedConfig);
    onConfigChange();
  };

  const resetToDefaults = () => {
    const defaultConfig: SimulationConfig = {
      baseRevenue: 2400000,
      growthRate: 5,
      marketVolatility: 10,
      seasonality: 15,
      competitionImpact: 8
    };
    setConfig(defaultConfig);
    updateSimulationConfig(defaultConfig);
    onConfigChange();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <Settings className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Simulation Controls</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Base Revenue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Monthly Revenue: ${(config.baseRevenue / 1000000).toFixed(1)}M
            </label>
            <input
              type="range"
              min="1000000"
              max="5000000"
              step="100000"
              value={config.baseRevenue}
              onChange={(e) => handleConfigUpdate('baseRevenue', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>$1M</span>
              <span>$5M</span>
            </div>
          </div>

          {/* Growth Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annual Growth Rate: {config.growthRate}%
            </label>
            <input
              type="range"
              min="-10"
              max="30"
              value={config.growthRate}
              onChange={(e) => handleConfigUpdate('growthRate', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-10%</span>
              <span>+30%</span>
            </div>
          </div>

          {/* Market Volatility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Volatility: {config.marketVolatility}%
            </label>
            <input
              type="range"
              min="0"
              max="30"
              value={config.marketVolatility}
              onChange={(e) => handleConfigUpdate('marketVolatility', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>

          {/* Seasonality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seasonality Impact: {config.seasonality}%
            </label>
            <input
              type="range"
              min="0"
              max="40"
              value={config.seasonality}
              onChange={(e) => handleConfigUpdate('seasonality', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>40%</span>
            </div>
          </div>

          {/* Competition Impact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Competition Impact: {config.competitionImpact}%
            </label>
            <input
              type="range"
              min="0"
              max="25"
              value={config.competitionImpact}
              onChange={(e) => handleConfigUpdate('competitionImpact', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={saveConfiguration}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Config</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Saved Configurations */}
          {savedConfigs.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Saved Configurations</h4>
              <div className="space-y-2">
                {savedConfigs.map((saved, index) => (
                  <button
                    key={index}
                    onClick={() => loadConfiguration(saved.config)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{saved.name}</div>
                    <div className="text-sm text-gray-600">
                      Revenue: ${(saved.config.baseRevenue / 1000000).toFixed(1)}M, 
                      Growth: {saved.config.growthRate}%, 
                      Volatility: {saved.config.marketVolatility}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;
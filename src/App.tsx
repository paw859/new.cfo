import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CashFlowChart from './components/CashFlowChart';
import AIInsights from './components/AIInsights';
import BudgetTracker from './components/BudgetTracker';
import RiskAssessment from './components/RiskAssessment';
import QuickActions from './components/QuickActions';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import SimulationControls from './components/SimulationControls';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConfigChange = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* KPI Dashboard */}
          <Dashboard key={`dashboard-${refreshKey}`} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Cash Flow Chart - Spans 2 columns */}
            <div className="lg:col-span-2">
              <CashFlowChart key={`cashflow-${refreshKey}`} />
            </div>
            
            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>
          
          {/* AI Insights and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AIInsights key={`insights-${refreshKey}`} />
            <BudgetTracker key={`budget-${refreshKey}`} />
          </div>
          
          {/* Scenario Analysis - Full Width */}
          <div className="grid grid-cols-1 mb-8">
            <ScenarioAnalysis />
          </div>
          
          {/* Risk Assessment */}
          <div className="grid grid-cols-1">
            <RiskAssessment key={`risk-${refreshKey}`} />
          </div>
        </div>
      </main>
      
      {/* Floating Simulation Controls */}
      <SimulationControls onConfigChange={handleConfigChange} />
    </div>
  );
}

export default App;
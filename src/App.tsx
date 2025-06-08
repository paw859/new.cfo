import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CashFlowChart from './components/CashFlowChart';
import AIInsights from './components/AIInsights';
import BudgetTracker from './components/BudgetTracker';
import RiskAssessment from './components/RiskAssessment';
import QuickActions from './components/QuickActions';
import ScenarioAnalysis from './components/ScenarioAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* KPI Dashboard */}
          <Dashboard />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Cash Flow Chart - Spans 2 columns */}
            <div className="lg:col-span-2">
              <CashFlowChart />
            </div>
            
            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>
          
          {/* AI Insights and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AIInsights />
            <BudgetTracker />
          </div>
          
          {/* Scenario Analysis - Full Width */}
          <div className="grid grid-cols-1 mb-8">
            <ScenarioAnalysis />
          </div>
          
          {/* Risk Assessment */}
          <div className="grid grid-cols-1">
            <RiskAssessment />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CashFlowChart from './components/CashFlowChart';
import AIInsights from './components/AIInsights';
import BudgetTracker from './components/BudgetTracker';
import RiskAssessment from './components/RiskAssessment';
import QuickActions from './components/QuickActions';
import ScenarioAnalysis from './components/ScenarioAnalysis';
import SimulationControls from './components/SimulationControls';
import AlertsDisplay from './components/AlertsDisplay';
import { getAlerts, clearAlert, clearAllAlerts, refreshAlerts, getAlertCount, getCriticalAlertCount } from './utils/api';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [alerts, setAlerts] = useState(getAlerts());
  const [showAlerts, setShowAlerts] = useState(false);

  const handleConfigChange = useCallback(async () => {
    setRefreshKey(prev => prev + 1);
    
    // Refresh alerts after data updates
    await refreshAlerts();
    setAlerts(getAlerts());
  }, []);

  const handleClearAlert = useCallback((id: string) => {
    clearAlert(id);
    setAlerts(getAlerts());
  }, []);

  const handleClearAllAlerts = useCallback(() => {
    clearAllAlerts();
    setAlerts(getAlerts());
  }, []);

  const handleToggleAlerts = useCallback(() => {
    setShowAlerts(prev => !prev);
  }, []);

  // Auto-refresh alerts periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshAlerts();
      setAlerts(getAlerts());
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial alert refresh
  useEffect(() => {
    const initializeAlerts = async () => {
      await refreshAlerts();
      setAlerts(getAlerts());
    };
    
    initializeAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        alertCount={getAlertCount()}
        criticalAlertCount={getCriticalAlertCount()}
        onAlertsClick={handleToggleAlerts}
      />
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
      
      {/* Alerts Display Modal */}
      <AlertsDisplay
        alerts={alerts}
        onClearAlert={handleClearAlert}
        onClearAll={handleClearAllAlerts}
        isVisible={showAlerts}
        onClose={() => setShowAlerts(false)}
      />
    </div>
  );
}

export default App;
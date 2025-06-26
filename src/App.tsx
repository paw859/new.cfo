import React, { useState, useCallback, useEffect, Suspense } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CashFlowChart from './components/CashFlowChart';
import AIInsights from './components/AIInsights';
import BudgetTracker from './components/BudgetTracker';
import RiskAssessment from './components/RiskAssessment';
import QuickActions from './components/QuickActions';
import LoadingSpinner from './components/LoadingSpinner';
import { getAlerts, clearAlert, clearAllAlerts, refreshAlerts, getAlertCount, getCriticalAlertCount, KPIData } from './utils/api';
import { Zap } from 'lucide-react';

// Lazy load modal components
const AlertsDisplay = React.lazy(() => import('./components/AlertsDisplay'));
const KPIDetailModal = React.lazy(() => import('./components/KPIDetailModal'));

// Lazy load heavy components that are not immediately visible
const ScenarioAnalysis = React.lazy(() => import('./components/ScenarioAnalysis'));
const SimulationControls = React.lazy(() => import('./components/SimulationControls'));

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [alerts, setAlerts] = useState(getAlerts());
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPIData | null>(null);
  const [isKpiModalVisible, setIsKpiModalVisible] = useState(false);

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

  const handleKpiClick = useCallback((kpi: KPIData) => {
    setSelectedKpi(kpi);
    setIsKpiModalVisible(true);
  }, []);

  const handleCloseKpiModal = useCallback(() => {
    setIsKpiModalVisible(false);
    setSelectedKpi(null);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header 
        alertCount={getAlertCount()}
        criticalAlertCount={getCriticalAlertCount()}
        onAlertsClick={handleToggleAlerts}
      />
      
      <main className="p-4 sm:p-6 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* KPI Dashboard */}
          <Dashboard 
            key={`dashboard-${refreshKey}`} 
            onKpiClick={handleKpiClick}
          />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Cash Flow Chart - Spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <CashFlowChart key={`cashflow-${refreshKey}`} />
            </div>
            
            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>
          
          {/* AI Insights and Budget Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <AIInsights key={`insights-${refreshKey}`} />
            <BudgetTracker key={`budget-${refreshKey}`} />
          </div>
          
          {/* Lazy-loaded Scenario Analysis - Full Width */}
          <div className="mb-6 sm:mb-8">
            <Suspense fallback={
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-green-100 rounded-lg animate-pulse">
                    <div className="w-6 h-6 bg-green-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
                <LoadingSpinner className="h-32" text="Loading scenario analysis..." color="green" />
              </div>
            }>
              <ScenarioAnalysis />
            </Suspense>
          </div>
          
          {/* Risk Assessment */}
          <div>
            <RiskAssessment key={`risk-${refreshKey}`} />
          </div>
        </div>
      </main>
      
      {/* Lazy-loaded Floating Simulation Controls */}
      <Suspense fallback={
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg animate-pulse">
            <div className="w-6 h-6 bg-white bg-opacity-30 rounded"></div>
          </div>
        </div>
      }>
        <SimulationControls onConfigChange={handleConfigChange} />
      </Suspense>
      
      {/* Lazy-loaded Alerts Display Modal */}
      {showAlerts && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <LoadingSpinner size="lg" text="Loading alerts..." color="blue" />
            </div>
          </div>
        }>
          <AlertsDisplay
            alerts={alerts}
            onClearAlert={handleClearAlert}
            onClearAll={handleClearAllAlerts}
            isVisible={showAlerts}
            onClose={() => setShowAlerts(false)}
          />
        </Suspense>
      )}
      
      {/* Lazy-loaded KPI Detail Modal */}
      {isKpiModalVisible && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8">
              <LoadingSpinner size="lg" text="Loading KPI details..." color="purple" />
            </div>
          </div>
        }>
          <KPIDetailModal
            kpi={selectedKpi}
            isVisible={isKpiModalVisible}
            onClose={handleCloseKpiModal}
          />
        </Suspense>
      )}
      
      {/* Made with Bolt Badge */}
      <div className="fixed bottom-4 left-4 z-40">
        <a
          href="https://bolt.new"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-purple-700 group"
          aria-label="Made with Bolt"
        >
          <Zap className="w-3 h-3 group-hover:animate-pulse" />
          <span>Made with Bolt</span>
        </a>
      </div>
    </div>
  );
}

export default App;
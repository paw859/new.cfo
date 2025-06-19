// Enhanced API utilities with complex data simulation, interdependencies, and dynamic modeling
export interface KPIData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  rawValue: number;
}

export interface CashFlowData {
  month: string;
  value: number;
  inflows: number;
  outflows: number;
}

export interface BudgetData {
  category: string;
  spent: number;
  budget: number;
  variance: number;
  efficiency: number;
}

export interface InsightData {
  type: 'opportunity' | 'warning' | 'success';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface RiskData {
  category: string;
  level: string;
  score: number;
  description: string;
  mitigationActions: string[];
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: number;
  source: 'KPI' | 'Risk' | 'Budget' | 'CashFlow' | 'System' | 'Market';
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  threshold?: number;
  currentValue?: number;
}

export interface SimulationConfig {
  baseRevenue: number;
  growthRate: number;
  marketVolatility: number;
  seasonality: number;
  competitionImpact: number;
  inflationRate: number;
  customerChurnRate: number;
  supplyChainDisruption: number;
  economicSentiment: number;
  technologyAdoption: number;
}

export interface MarketEvent {
  type: 'economic_downturn' | 'product_launch' | 'supply_disruption' | 'competitor_action' | 'regulatory_change' | 'technology_shift';
  severity: number;
  duration: number;
  startTime: number;
  description: string;
}

// New interfaces for KPI drill-down functionality
export interface KPIHistoricalData {
  date: string;
  value: number;
}

export interface KPIInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  recommendation?: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

// Enhanced simulation state with complex variables
let currentConfig: SimulationConfig = {
  baseRevenue: 2400000,
  growthRate: 5,
  marketVolatility: 10,
  seasonality: 15,
  competitionImpact: 8,
  inflationRate: 3.2,
  customerChurnRate: 5.5,
  supplyChainDisruption: 2,
  economicSentiment: 65,
  technologyAdoption: 75
};

// Market events system
let activeMarketEvents: MarketEvent[] = [];
let eventHistory: MarketEvent[] = [];

// Enhanced alert management
let _currentAlerts: Alert[] = [];
let _alertIdCounter = 0;

// Complex interdependency factors
interface BusinessMetrics {
  customerSatisfaction: number;
  employeeProductivity: number;
  marketShare: number;
  brandStrength: number;
  operationalEfficiency: number;
  innovationIndex: number;
  financialHealth: number;
}

let businessMetrics: BusinessMetrics = {
  customerSatisfaction: 78,
  employeeProductivity: 82,
  marketShare: 12.5,
  brandStrength: 71,
  operationalEfficiency: 85,
  innovationIndex: 68,
  financialHealth: 75
};

// Enhanced alert thresholds with dynamic adjustments
const ALERT_THRESHOLDS = {
  PROFIT_MARGIN_CRITICAL: 5,
  PROFIT_MARGIN_WARNING: 10,
  BUDGET_VARIANCE_WARNING: 15,
  BUDGET_VARIANCE_CRITICAL: 25,
  RISK_SCORE_WARNING: 60,
  RISK_SCORE_CRITICAL: 80,
  CASH_FLOW_WARNING: 50000,
  CASH_FLOW_CRITICAL: 25000,
  REVENUE_DECLINE_WARNING: -5,
  REVENUE_DECLINE_CRITICAL: -15,
  MARKET_VOLATILITY_WARNING: 20,
  MARKET_VOLATILITY_CRITICAL: 30,
  CHURN_RATE_WARNING: 8,
  CHURN_RATE_CRITICAL: 12,
  INFLATION_WARNING: 5,
  INFLATION_CRITICAL: 8,
  SUPPLY_CHAIN_WARNING: 15,
  SUPPLY_CHAIN_CRITICAL: 25
};

export const updateSimulationConfig = (config: Partial<SimulationConfig>) => {
  currentConfig = { ...currentConfig, ...config };
  updateBusinessMetrics();
  generateMarketEvents();
};

export const getSimulationConfig = (): SimulationConfig => currentConfig;

// Complex business metrics calculation with interdependencies
const updateBusinessMetrics = () => {
  // Customer satisfaction influenced by multiple factors
  businessMetrics.customerSatisfaction = Math.max(0, Math.min(100, 
    75 + 
    (currentConfig.growthRate - 5) * 2 - 
    currentConfig.customerChurnRate * 3 + 
    (currentConfig.economicSentiment - 50) * 0.3 -
    currentConfig.supplyChainDisruption * 2
  ));

  // Employee productivity affected by growth, efficiency, and market conditions
  businessMetrics.employeeProductivity = Math.max(0, Math.min(100,
    80 + 
    (currentConfig.growthRate - 5) * 1.5 +
    (currentConfig.technologyAdoption - 50) * 0.4 -
    currentConfig.inflationRate * 2 -
    currentConfig.competitionImpact * 1.5
  ));

  // Market share dynamics
  const competitiveAdvantage = (businessMetrics.customerSatisfaction + businessMetrics.innovationIndex) / 2 - 70;
  businessMetrics.marketShare = Math.max(5, Math.min(25,
    12.5 + competitiveAdvantage * 0.1 - currentConfig.competitionImpact * 0.3
  ));

  // Brand strength influenced by customer satisfaction and market performance
  businessMetrics.brandStrength = Math.max(0, Math.min(100,
    (businessMetrics.customerSatisfaction * 0.4) +
    (businessMetrics.marketShare * 2) +
    (currentConfig.growthRate > 0 ? 20 : 10) -
    (currentConfig.competitionImpact * 1.2)
  ));

  // Operational efficiency
  businessMetrics.operationalEfficiency = Math.max(0, Math.min(100,
    85 + 
    (currentConfig.technologyAdoption - 75) * 0.3 -
    currentConfig.supplyChainDisruption * 2 -
    (currentConfig.inflationRate - 3) * 3 +
    (businessMetrics.employeeProductivity - 80) * 0.2
  ));

  // Innovation index
  businessMetrics.innovationIndex = Math.max(0, Math.min(100,
    68 +
    (currentConfig.technologyAdoption - 75) * 0.5 +
    (currentConfig.growthRate - 5) * 2 -
    currentConfig.competitionImpact * 1.5 +
    (businessMetrics.employeeProductivity - 80) * 0.3
  ));

  // Financial health composite score
  businessMetrics.financialHealth = Math.max(0, Math.min(100,
    (businessMetrics.operationalEfficiency * 0.3) +
    (businessMetrics.customerSatisfaction * 0.2) +
    (businessMetrics.marketShare * 2) +
    (currentConfig.growthRate > 0 ? 25 : 15) -
    (currentConfig.inflationRate - 3) * 5
  ));
};

// Market events generation system
const generateMarketEvents = () => {
  // Clean up expired events
  const now = Date.now();
  activeMarketEvents = activeMarketEvents.filter(event => 
    now - event.startTime < event.duration * 24 * 60 * 60 * 1000
  );

  // Generate new events based on current conditions
  if (Math.random() < 0.1) { // 10% chance per update
    const eventTypes: MarketEvent['type'][] = [
      'economic_downturn', 'product_launch', 'supply_disruption', 
      'competitor_action', 'regulatory_change', 'technology_shift'
    ];

    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    let severity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4
    let duration = Math.floor(Math.random() * 30) + 7; // 7 to 37 days

    // Adjust probability and severity based on current conditions
    if (currentConfig.marketVolatility > 20) severity *= 1.5;
    if (currentConfig.economicSentiment < 40) severity *= 1.3;
    if (currentConfig.competitionImpact > 15) severity *= 1.2;

    const descriptions = {
      economic_downturn: `Economic indicators show ${(severity * 100).toFixed(0)}% downturn pressure`,
      product_launch: `Major competitor launches disruptive product with ${(severity * 100).toFixed(0)}% market impact`,
      supply_disruption: `Supply chain disruption affecting ${(severity * 100).toFixed(0)}% of operations`,
      competitor_action: `Aggressive competitor pricing strategy impacts ${(severity * 100).toFixed(0)}% of market`,
      regulatory_change: `New regulations create ${(severity * 100).toFixed(0)}% compliance cost increase`,
      technology_shift: `Technology disruption affects ${(severity * 100).toFixed(0)}% of business model`
    };

    const newEvent: MarketEvent = {
      type: eventType,
      severity,
      duration,
      startTime: now,
      description: descriptions[eventType]
    };

    activeMarketEvents.push(newEvent);
    eventHistory.push(newEvent);

    // Generate alert for significant events
    if (severity > 0.2) {
      addAlert({
        type: severity > 0.3 ? 'critical' : 'warning',
        title: `Market Event: ${eventType.replace('_', ' ').toUpperCase()}`,
        message: newEvent.description,
        source: 'Market',
        priority: severity > 0.3 ? 'high' : 'medium',
        actionRequired: true,
        currentValue: severity * 100
      });
    }
  }
};

// Alert management functions
export const getAlerts = (): Alert[] => [..._currentAlerts];

export const clearAlert = (id: string): void => {
  _currentAlerts = _currentAlerts.filter(alert => alert.id !== id);
};

export const clearAllAlerts = (): void => {
  _currentAlerts = [];
};

export const getAlertCount = (): number => _currentAlerts.length;

export const getCriticalAlertCount = (): number => 
  _currentAlerts.filter(alert => alert.type === 'critical').length;

const generateAlertId = (): string => {
  return `alert_${++_alertIdCounter}_${Date.now()}`;
};

const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>): void => {
  const existingAlert = _currentAlerts.find(existing => 
    existing.source === alert.source && 
    existing.title === alert.title &&
    existing.type === alert.type
  );
  
  if (!existingAlert) {
    _currentAlerts.push({
      ...alert,
      id: generateAlertId(),
      timestamp: Date.now()
    });
  }
};

// Complex mathematical models for realistic data generation
const applyNonLinearEffects = (baseValue: number, factors: number[]): number => {
  // Logarithmic dampening for extreme values
  const combinedFactor = factors.reduce((acc, factor) => acc + factor, 0);
  const dampened = Math.sign(combinedFactor) * Math.log(1 + Math.abs(combinedFactor * 10)) / 10;
  return baseValue * (1 + dampened);
};

const calculateMarketEventImpact = (): number => {
  return activeMarketEvents.reduce((impact, event) => {
    const timeDecay = Math.max(0, 1 - (Date.now() - event.startTime) / (event.duration * 24 * 60 * 60 * 1000));
    return impact + (event.severity * timeDecay * (event.type === 'economic_downturn' ? -1 : 
                    event.type === 'product_launch' ? 0.5 : -0.7));
  }, 0);
};

// Simulate API delay with variable timing
const delay = (ms: number) => new Promise(resolve => 
  setTimeout(resolve, ms + Math.random() * 200)
);

// Enhanced KPI data generation with complex interdependencies
export const fetchKPIData = async (config?: Partial<SimulationConfig>): Promise<KPIData[]> => {
  await delay(800);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  updateBusinessMetrics();
  generateMarketEvents();
  
  // Base calculations with multiple influencing factors
  const baseRevenue = activeConfig.baseRevenue;
  
  // Complex revenue calculation with interdependencies
  const growthFactor = activeConfig.growthRate / 100;
  const volatilityFactor = (Math.random() - 0.5) * (activeConfig.marketVolatility / 100);
  const seasonalityFactor = Math.sin(Date.now() / 1000000) * (activeConfig.seasonality / 100);
  const competitionFactor = -(activeConfig.competitionImpact / 100) * Math.random();
  const inflationFactor = -(activeConfig.inflationRate - 3) / 100 * 0.5; // Inflation above 3% hurts
  const churnFactor = -(activeConfig.customerChurnRate / 100) * 0.8;
  const marketEventFactor = calculateMarketEventImpact();
  const customerSatisfactionFactor = (businessMetrics.customerSatisfaction - 75) / 100 * 0.3;
  const brandStrengthFactor = (businessMetrics.brandStrength - 70) / 100 * 0.2;
  
  // Apply non-linear effects for realistic modeling
  const revenueFactors = [
    growthFactor, volatilityFactor, seasonalityFactor, competitionFactor,
    inflationFactor, churnFactor, marketEventFactor, customerSatisfactionFactor, brandStrengthFactor
  ];
  
  const revenue = applyNonLinearEffects(baseRevenue, revenueFactors);
  
  // Complex expense calculation with efficiency factors
  const baseExpenseRatio = 0.75;
  const efficiencyFactor = (businessMetrics.operationalEfficiency - 85) / 100 * 0.1;
  const inflationExpenseFactor = (activeConfig.inflationRate - 3) / 100 * 0.8;
  const supplyChainFactor = activeConfig.supplyChainDisruption / 100 * 0.3;
  const technologyEfficiencyFactor = -(activeConfig.technologyAdoption - 75) / 100 * 0.05;
  const productivityFactor = -(businessMetrics.employeeProductivity - 80) / 100 * 0.1;
  
  const expenseFactors = [
    efficiencyFactor, inflationExpenseFactor, supplyChainFactor, 
    technologyEfficiencyFactor, productivityFactor
  ];
  
  const expenses = applyNonLinearEffects(
    baseRevenue * baseExpenseRatio, 
    expenseFactors
  );
  
  // Calculate derived metrics
  const profit = revenue - expenses;
  const profitMargin = (profit / revenue) * 100;
  
  // Complex cash flow with working capital and investment effects
  const workingCapitalChange = (Math.random() - 0.5) * 0.2;
  const investmentFactor = -(activeConfig.growthRate / 100) * 0.1; // Growth requires investment
  const cashFlow = profit * (1 + workingCapitalChange + investmentFactor);
  
  // Calculate percentage changes with historical comparison
  const revenueChange = revenueFactors.reduce((acc, factor) => acc + factor, 0) * 100;
  const expenseChange = expenseFactors.reduce((acc, factor) => acc + factor, 0) * 100;
  const profitChange = revenueChange - expenseChange;
  const cashFlowChange = profitChange + (workingCapitalChange + investmentFactor) * 100;
  
  const kpiData = [
    {
      title: 'Monthly Revenue',
      value: `$${(revenue / 1000000).toFixed(1)}M`,
      change: `${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
      trend: revenueChange > 0 ? 'up' : 'down',
      rawValue: revenue
    },
    {
      title: 'Operating Expenses',
      value: `$${(expenses / 1000000).toFixed(1)}M`,
      change: `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}%`,
      trend: expenseChange > 0 ? 'up' : 'down',
      rawValue: expenses
    },
    {
      title: 'Net Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      change: `${profitChange > 0 ? '+' : ''}${profitChange.toFixed(1)}%`,
      trend: profitChange > 0 ? 'up' : 'down',
      rawValue: profitMargin
    },
    {
      title: 'Cash Flow',
      value: `$${(cashFlow / 1000).toFixed(0)}K`,
      change: `${cashFlowChange > 0 ? '+' : ''}${cashFlowChange.toFixed(1)}%`,
      trend: cashFlowChange > 0 ? 'up' : 'down',
      rawValue: cashFlow
    }
  ] as KPIData[];

  // Generate comprehensive alerts
  generateKPIAlerts(kpiData);
  generateBusinessMetricAlerts();
  
  return kpiData;
};

// Enhanced alert generation with complex conditions
const generateKPIAlerts = (kpis: KPIData[]): void => {
  kpis.forEach(kpi => {
    switch (kpi.title) {
      case 'Net Profit Margin':
        const profitMargin = kpi.rawValue;
        if (profitMargin < ALERT_THRESHOLDS.PROFIT_MARGIN_CRITICAL) {
          addAlert({
            type: 'critical',
            title: 'Critical Profit Margin Alert',
            message: `Profit margin at ${profitMargin.toFixed(1)}% is critically low. Customer satisfaction: ${businessMetrics.customerSatisfaction.toFixed(0)}%, Operational efficiency: ${businessMetrics.operationalEfficiency.toFixed(0)}%`,
            source: 'KPI',
            priority: 'high',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.PROFIT_MARGIN_CRITICAL,
            currentValue: profitMargin
          });
        }
        break;

      case 'Monthly Revenue':
        const revenueChange = parseFloat(kpi.change.replace('%', ''));
        if (revenueChange < ALERT_THRESHOLDS.REVENUE_DECLINE_CRITICAL && businessMetrics.customerSatisfaction < 70) {
          addAlert({
            type: 'critical',
            title: 'Revenue & Customer Crisis',
            message: `Revenue declined ${Math.abs(revenueChange).toFixed(1)}% while customer satisfaction dropped to ${businessMetrics.customerSatisfaction.toFixed(0)}%`,
            source: 'KPI',
            priority: 'high',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.REVENUE_DECLINE_CRITICAL,
            currentValue: revenueChange
          });
        }
        break;
    }
  });
};

const generateBusinessMetricAlerts = (): void => {
  // Customer churn rate alerts
  if (currentConfig.customerChurnRate > ALERT_THRESHOLDS.CHURN_RATE_CRITICAL) {
    addAlert({
      type: 'critical',
      title: 'Critical Customer Churn Rate',
      message: `Customer churn at ${currentConfig.customerChurnRate.toFixed(1)}% is critically high. Customer satisfaction: ${businessMetrics.customerSatisfaction.toFixed(0)}%`,
      source: 'KPI',
      priority: 'high',
      actionRequired: true,
      threshold: ALERT_THRESHOLDS.CHURN_RATE_CRITICAL,
      currentValue: currentConfig.customerChurnRate
    });
  }

  // Supply chain disruption alerts
  if (currentConfig.supplyChainDisruption > ALERT_THRESHOLDS.SUPPLY_CHAIN_WARNING) {
    addAlert({
      type: 'warning',
      title: 'Supply Chain Disruption',
      message: `Supply chain disruption at ${currentConfig.supplyChainDisruption.toFixed(1)}% affecting operational efficiency (${businessMetrics.operationalEfficiency.toFixed(0)}%)`,
      source: 'System',
      priority: 'medium',
      actionRequired: true,
      threshold: ALERT_THRESHOLDS.SUPPLY_CHAIN_WARNING,
      currentValue: currentConfig.supplyChainDisruption
    });
  }

  // Economic sentiment alerts
  if (currentConfig.economicSentiment < 40 && businessMetrics.financialHealth < 60) {
    addAlert({
      type: 'warning',
      title: 'Economic Headwinds',
      message: `Low economic sentiment (${currentConfig.economicSentiment.toFixed(0)}%) combined with declining financial health (${businessMetrics.financialHealth.toFixed(0)}%)`,
      source: 'System',
      priority: 'medium',
      actionRequired: true,
      currentValue: currentConfig.economicSentiment
    });
  }
};

// Enhanced cash flow with detailed inflows and outflows
export const fetchCashFlowData = async (config?: Partial<SimulationConfig>): Promise<CashFlowData[]> => {
  await delay(600);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  const baseRevenue = activeConfig.baseRevenue / 12;
  
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
    // Complex seasonal patterns
    const seasonalMultiplier = 1 + Math.sin((index + 1) * Math.PI / 6) * (activeConfig.seasonality / 100);
    const volatilityFactor = (Math.random() - 0.5) * (activeConfig.marketVolatility / 100);
    const growthFactor = (index + 1) * (activeConfig.growthRate / 100) / 12;
    const marketEventImpact = calculateMarketEventImpact();
    
    // Separate inflows and outflows
    const baseInflows = baseRevenue * seasonalMultiplier * (1 + growthFactor + marketEventImpact);
    const operationalInflows = baseInflows * (1 + volatilityFactor);
    const investmentInflows = Math.random() > 0.8 ? baseRevenue * 0.1 : 0; // Occasional investment
    const totalInflows = operationalInflows + investmentInflows;
    
    // Complex outflow calculation
    const operationalOutflows = baseRevenue * 0.75 * (1 + (activeConfig.inflationRate - 3) / 100);
    const investmentOutflows = activeConfig.growthRate > 8 ? baseRevenue * 0.05 : 0; // Growth investment
    const debtPayments = baseRevenue * 0.03; // Regular debt service
    const totalOutflows = operationalOutflows + investmentOutflows + debtPayments;
    
    const netCashFlow = totalInflows - totalOutflows;
    
    return {
      month,
      value: Math.max(netCashFlow / 1000, -50), // Convert to thousands, allow negative
      inflows: totalInflows / 1000,
      outflows: totalOutflows / 1000
    };
  });
};

// Enhanced budget data with dynamic allocation and efficiency metrics
export const fetchBudgetData = async (config?: Partial<SimulationConfig>): Promise<BudgetData[]> => {
  await delay(700);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  
  const categories = [
    { 
      name: 'Marketing', 
      baseSpent: 180000, 
      baseBudget: 200000,
      efficiencyFactor: businessMetrics.brandStrength / 100,
      growthSensitivity: 0.3
    },
    { 
      name: 'Operations', 
      baseSpent: 450000, 
      baseBudget: 420000,
      efficiencyFactor: businessMetrics.operationalEfficiency / 100,
      growthSensitivity: 0.2
    },
    { 
      name: 'R&D', 
      baseSpent: 320000, 
      baseBudget: 350000,
      efficiencyFactor: businessMetrics.innovationIndex / 100,
      growthSensitivity: 0.4
    },
    { 
      name: 'Sales', 
      baseSpent: 280000, 
      baseBudget: 300000,
      efficiencyFactor: businessMetrics.customerSatisfaction / 100,
      growthSensitivity: 0.25
    },
    { 
      name: 'Admin', 
      baseSpent: 120000, 
      baseBudget: 125000,
      efficiencyFactor: businessMetrics.employeeProductivity / 100,
      growthSensitivity: 0.1
    }
  ];
  
  const budgetData = categories.map(cat => {
    // Dynamic budget allocation based on growth and market conditions
    const growthAdjustment = activeConfig.growthRate > 5 ? cat.growthSensitivity * (activeConfig.growthRate - 5) / 100 : 0;
    const inflationAdjustment = (activeConfig.inflationRate - 3) / 100;
    const efficiencyAdjustment = (cat.efficiencyFactor - 0.8) * 0.1;
    const marketEventAdjustment = calculateMarketEventImpact() * 0.1;
    
    // Unexpected variances (random events)
    const unexpectedVariance = Math.random() > 0.9 ? (Math.random() - 0.5) * 0.3 : 0;
    
    const adjustedBudget = cat.baseBudget * (1 + growthAdjustment + inflationAdjustment);
    const adjustedSpent = cat.baseSpent * (1 + efficiencyAdjustment + marketEventAdjustment + unexpectedVariance);
    
    const variance = ((adjustedSpent - adjustedBudget) / adjustedBudget) * 100;
    const efficiency = Math.max(0, Math.min(100, cat.efficiencyFactor * 100 + (Math.random() - 0.5) * 10));
    
    return {
      category: cat.name,
      spent: adjustedSpent,
      budget: adjustedBudget,
      variance: Number(variance.toFixed(1)),
      efficiency: Number(efficiency.toFixed(1))
    };
  });

  generateBudgetAlerts(budgetData);
  
  return budgetData;
};

const generateBudgetAlerts = (budgets: BudgetData[]): void => {
  budgets.forEach(budget => {
    const absVariance = Math.abs(budget.variance);
    
    if (absVariance > ALERT_THRESHOLDS.BUDGET_VARIANCE_CRITICAL) {
      addAlert({
        type: 'critical',
        title: `Critical Budget Variance - ${budget.category}`,
        message: `${budget.category} is ${budget.variance > 0 ? 'over' : 'under'} budget by ${absVariance.toFixed(1)}%. Efficiency: ${budget.efficiency.toFixed(0)}%`,
        source: 'Budget',
        priority: 'high',
        actionRequired: true,
        threshold: ALERT_THRESHOLDS.BUDGET_VARIANCE_CRITICAL,
        currentValue: absVariance
      });
    }

    // Low efficiency alerts
    if (budget.efficiency < 60) {
      addAlert({
        type: 'warning',
        title: `Low Efficiency - ${budget.category}`,
        message: `${budget.category} efficiency at ${budget.efficiency.toFixed(0)}% is below optimal levels`,
        source: 'Budget',
        priority: 'medium',
        actionRequired: true,
        currentValue: budget.efficiency
      });
    }
  });
};

// Enhanced insights with complex condition analysis
export const fetchInsightsData = async (config?: Partial<SimulationConfig>): Promise<InsightData[]> => {
  await delay(900);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  const insights: InsightData[] = [];
  
  // Complex multi-factor insights
  if (activeConfig.growthRate > 8 && businessMetrics.customerSatisfaction > 80 && businessMetrics.operationalEfficiency > 85) {
    insights.push({
      type: 'opportunity',
      title: 'Optimal Growth Conditions',
      description: `Strong ${activeConfig.growthRate}% growth with high customer satisfaction (${businessMetrics.customerSatisfaction.toFixed(0)}%) and operational efficiency (${businessMetrics.operationalEfficiency.toFixed(0)}%)`,
      action: 'Scale operations aggressively',
      priority: 'high',
      confidence: 92
    });
  }
  
  if (activeConfig.customerChurnRate > 8 && businessMetrics.customerSatisfaction < 70) {
    insights.push({
      type: 'warning',
      title: 'Customer Retention Crisis',
      description: `High churn rate (${activeConfig.customerChurnRate.toFixed(1)}%) combined with low satisfaction (${businessMetrics.customerSatisfaction.toFixed(0)}%) threatens revenue stability`,
      action: 'Implement customer success program',
      priority: 'high',
      confidence: 88
    });
  }
  
  if (currentConfig.inflationRate > 5 && businessMetrics.operationalEfficiency < 80) {
    insights.push({
      type: 'warning',
      title: 'Inflation & Efficiency Risk',
      description: `High inflation (${currentConfig.inflationRate.toFixed(1)}%) with low operational efficiency (${businessMetrics.operationalEfficiency.toFixed(0)}%) creates margin pressure`,
      action: 'Focus on operational optimization',
      priority: 'medium',
      confidence: 85
    });
  }

  // Market event insights
  if (activeMarketEvents.length > 0) {
    const criticalEvents = activeMarketEvents.filter(e => e.severity > 0.2);
    if (criticalEvents.length > 0) {
      insights.push({
        type: 'warning',
        title: 'Active Market Disruptions',
        description: `${criticalEvents.length} significant market event(s) currently impacting business operations`,
        action: 'Activate contingency plans',
        priority: 'high',
        confidence: 95
      });
    }
  }

  // Technology adoption insights
  if (currentConfig.technologyAdoption > 85 && businessMetrics.innovationIndex > 75) {
    insights.push({
      type: 'opportunity',
      title: 'Technology Leadership Position',
      description: `High technology adoption (${currentConfig.technologyAdoption.toFixed(0)}%) and innovation index (${businessMetrics.innovationIndex.toFixed(0)}%) create competitive advantage`,
      action: 'Leverage tech advantage for market expansion',
      priority: 'medium',
      confidence: 78
    });
  }
  
  return insights.slice(0, 4);
};

// Enhanced risk assessment with interconnected risks and mitigation
export const fetchRiskData = async (config?: Partial<SimulationConfig>): Promise<RiskData[]> => {
  await delay(750);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  
  // Complex risk calculations with interdependencies
  const marketRiskScore = Math.min(95, 
    30 + activeConfig.marketVolatility * 2 + 
    (activeConfig.economicSentiment < 50 ? 20 : 0) +
    activeMarketEvents.length * 10
  );
  
  const operationalRiskScore = Math.min(95,
    20 + activeConfig.competitionImpact * 2.5 + 
    activeConfig.supplyChainDisruption * 2 +
    (businessMetrics.operationalEfficiency < 70 ? 25 : 0)
  );
  
  const liquidityRiskScore = Math.max(5, 
    60 - activeConfig.growthRate * 3 + 
    activeConfig.customerChurnRate * 2 +
    (businessMetrics.financialHealth < 60 ? 20 : 0)
  );
  
  const complianceRiskScore = Math.min(90,
    15 + (activeConfig.inflationRate - 3) * 5 +
    activeMarketEvents.filter(e => e.type === 'regulatory_change').length * 20
  );
  
  const technologyRiskScore = Math.max(10,
    50 - activeConfig.technologyAdoption * 0.4 +
    activeMarketEvents.filter(e => e.type === 'technology_shift').length * 15
  );
  
  const getRiskLevel = (score: number) => {
    if (score >= 75) return 'High';
    if (score >= 45) return 'Medium';
    return 'Low';
  };
  
  const getRiskTrend = (score: number, previousScore: number = score) => {
    if (score > previousScore + 5) return 'increasing';
    if (score < previousScore - 5) return 'decreasing';
    return 'stable';
  };
  
  const riskData = [
    {
      category: 'Market Risk',
      level: getRiskLevel(marketRiskScore),
      score: Math.round(marketRiskScore),
      description: `Market volatility (${activeConfig.marketVolatility}%) and economic sentiment (${activeConfig.economicSentiment.toFixed(0)}%) create uncertainty`,
      mitigationActions: [
        'Diversify revenue streams',
        'Hedge currency exposure',
        'Build market intelligence capabilities'
      ],
      trend: getRiskTrend(marketRiskScore)
    },
    {
      category: 'Operational Risk',
      level: getRiskLevel(operationalRiskScore),
      score: Math.round(operationalRiskScore),
      description: `Competition (${activeConfig.competitionImpact}%) and supply chain disruption (${activeConfig.supplyChainDisruption}%) affect operations`,
      mitigationActions: [
        'Strengthen supplier relationships',
        'Improve operational efficiency',
        'Develop competitive differentiation'
      ],
      trend: getRiskTrend(operationalRiskScore)
    },
    {
      category: 'Liquidity Risk',
      level: getRiskLevel(liquidityRiskScore),
      score: Math.round(liquidityRiskScore),
      description: `Growth rate (${activeConfig.growthRate}%) and customer churn (${activeConfig.customerChurnRate.toFixed(1)}%) impact cash flow`,
      mitigationActions: [
        'Establish credit facilities',
        'Improve cash conversion cycle',
        'Reduce customer churn'
      ],
      trend: getRiskTrend(liquidityRiskScore)
    },
    {
      category: 'Compliance Risk',
      level: getRiskLevel(complianceRiskScore),
      score: Math.round(complianceRiskScore),
      description: `Regulatory environment and inflation (${activeConfig.inflationRate.toFixed(1)}%) create compliance challenges`,
      mitigationActions: [
        'Enhance compliance monitoring',
        'Invest in regulatory technology',
        'Build government relations'
      ],
      trend: getRiskTrend(complianceRiskScore)
    },
    {
      category: 'Technology Risk',
      level: getRiskLevel(technologyRiskScore),
      score: Math.round(technologyRiskScore),
      description: `Technology adoption (${activeConfig.technologyAdoption.toFixed(0)}%) and digital transformation risks`,
      mitigationActions: [
        'Accelerate digital transformation',
        'Invest in cybersecurity',
        'Develop tech talent'
      ],
      trend: getRiskTrend(technologyRiskScore)
    }
  ];

  generateRiskAlerts(riskData);
  
  return riskData;
};

const generateRiskAlerts = (risks: RiskData[]): void => {
  risks.forEach(risk => {
    if (risk.score >= ALERT_THRESHOLDS.RISK_SCORE_CRITICAL) {
      addAlert({
        type: 'critical',
        title: `Critical Risk Level - ${risk.category}`,
        message: `${risk.category} score is ${risk.score}/100 and ${risk.trend}. Immediate mitigation required.`,
        source: 'Risk',
        priority: 'high',
        actionRequired: true,
        threshold: ALERT_THRESHOLDS.RISK_SCORE_CRITICAL,
        currentValue: risk.score
      });
    }
  });
};

// Enhanced historical data with realistic patterns
export const fetchKPIHistoricalData = async (
  kpiTitle: string, 
  timeRange: '7d' | '30d' | '90d' | '1y'
): Promise<KPIHistoricalData[]> => {
  await delay(600);
  
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const data: KPIHistoricalData[] = [];
  
  const baseValues = {
    'Monthly Revenue': currentConfig.baseRevenue,
    'Operating Expenses': currentConfig.baseRevenue * 0.75,
    'Net Profit Margin': 15,
    'Cash Flow': currentConfig.baseRevenue * 0.2
  };
  
  const baseValue = baseValues[kpiTitle as keyof typeof baseValues] || 1000000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Complex historical modeling
    const trendFactor = (days - i) / days * (currentConfig.growthRate / 100);
    const volatilityFactor = (Math.random() - 0.5) * (currentConfig.marketVolatility / 100);
    const seasonalFactor = Math.sin((date.getTime() / 86400000) * Math.PI / 30) * (currentConfig.seasonality / 100);
    const cyclicalFactor = Math.sin((date.getTime() / 86400000) * Math.PI / 365) * 0.1; // Annual cycle
    const randomWalk = (Math.random() - 0.5) * 0.02; // Small random variations
    
    let value = baseValue * (1 + trendFactor + volatilityFactor + seasonalFactor + cyclicalFactor + randomWalk);
    
    // Ensure realistic bounds
    if (kpiTitle === 'Net Profit Margin') {
      value = Math.max(-5, Math.min(50, value));
    } else {
      value = Math.max(value * 0.1, value);
    }
    
    data.push({
      date: timeRange === '1y' ? date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : 
            timeRange === '90d' ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
            date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
      value
    });
  }
  
  return data;
};

// Enhanced KPI insights with complex analysis
export const fetchKPIInsights = async (kpiTitle: string): Promise<KPIInsight[]> => {
  await delay(400);
  
  const insights: KPIInsight[] = [];
  
  // Complex insight generation based on multiple factors
  switch (kpiTitle) {
    case 'Monthly Revenue':
      if (currentConfig.growthRate > 8 && businessMetrics.customerSatisfaction > 80) {
        insights.push({
          type: 'positive',
          title: 'Sustainable Growth Pattern',
          description: `Revenue growth of ${currentConfig.growthRate}% is supported by high customer satisfaction (${businessMetrics.customerSatisfaction.toFixed(0)}%)`,
          recommendation: 'Maintain current strategy while preparing for scale challenges',
          confidence: 90,
          impact: 'high'
        });
      }
      
      if (currentConfig.customerChurnRate > 8) {
        insights.push({
          type: 'negative',
          title: 'Revenue Sustainability Risk',
          description: `High customer churn (${currentConfig.customerChurnRate.toFixed(1)}%) threatens revenue stability despite current growth`,
          recommendation: 'Prioritize customer retention initiatives immediately',
          confidence: 85,
          impact: 'high'
        });
      }
      
      if (businessMetrics.marketShare > 15) {
        insights.push({
          type: 'positive',
          title: 'Market Leadership Position',
          description: `Market share of ${businessMetrics.marketShare.toFixed(1)}% indicates strong competitive position`,
          recommendation: 'Leverage market position for premium pricing',
          confidence: 82,
          impact: 'medium'
        });
      }
      break;
      
    case 'Operating Expenses':
      if (businessMetrics.operationalEfficiency > 90) {
        insights.push({
          type: 'positive',
          title: 'Operational Excellence',
          description: `Operational efficiency at ${businessMetrics.operationalEfficiency.toFixed(0)}% indicates world-class operations`,
          recommendation: 'Share best practices across all business units',
          confidence: 88,
          impact: 'medium'
        });
      }
      
      if (currentConfig.inflationRate > 5 && businessMetrics.operationalEfficiency < 80) {
        insights.push({
          type: 'negative',
          title: 'Cost Pressure Vulnerability',
          description: `High inflation (${currentConfig.inflationRate.toFixed(1)}%) with low efficiency (${businessMetrics.operationalEfficiency.toFixed(0)}%) creates margin risk`,
          recommendation: 'Implement aggressive cost optimization program',
          confidence: 92,
          impact: 'high'
        });
      }
      break;
      
    case 'Net Profit Margin':
      const estimatedMargin = businessMetrics.financialHealth * 0.3; // Simplified
      if (estimatedMargin > 20 && businessMetrics.brandStrength > 75) {
        insights.push({
          type: 'positive',
          title: 'Premium Market Position',
          description: `Strong margins supported by brand strength (${businessMetrics.brandStrength.toFixed(0)}%) enable premium pricing`,
          recommendation: 'Invest in brand building and product differentiation',
          confidence: 86,
          impact: 'high'
        });
      }
      
      if (activeMarketEvents.some(e => e.type === 'competitor_action' && e.severity > 0.2)) {
        insights.push({
          type: 'negative',
          title: 'Competitive Margin Pressure',
          description: 'Aggressive competitor actions are putting pressure on profit margins',
          recommendation: 'Develop competitive response strategy immediately',
          confidence: 89,
          impact: 'high'
        });
      }
      break;
      
    case 'Cash Flow':
      if (businessMetrics.financialHealth > 80) {
        insights.push({
          type: 'positive',
          title: 'Strong Financial Foundation',
          description: `Excellent financial health (${businessMetrics.financialHealth.toFixed(0)}%) provides strategic flexibility`,
          recommendation: 'Consider strategic acquisitions or major investments',
          confidence: 84,
          impact: 'medium'
        });
      }
      
      if (currentConfig.growthRate > 15 && businessMetrics.financialHealth < 70) {
        insights.push({
          type: 'negative',
          title: 'Growth-Cash Flow Imbalance',
          description: `Rapid growth (${currentConfig.growthRate}%) may be straining cash resources`,
          recommendation: 'Secure additional financing or moderate growth pace',
          confidence: 87,
          impact: 'high'
        });
      }
      break;
  }
  
  // Ensure minimum insights with market event context
  if (insights.length < 2) {
    if (activeMarketEvents.length > 0) {
      insights.push({
        type: 'neutral',
        title: 'Market Event Impact Analysis',
        description: `${activeMarketEvents.length} active market event(s) may be influencing this metric`,
        recommendation: 'Monitor closely for event-driven changes',
        confidence: 75,
        impact: 'medium'
      });
    }
    
    insights.push({
      type: 'neutral',
      title: 'Advanced AI Monitoring',
      description: 'Continuous analysis of complex interdependencies provides deeper insights',
      recommendation: 'Regular review recommended for optimal decision making',
      confidence: 95,
      impact: 'low'
    });
  }
  
  return insights.slice(0, 4);
};

// Function to refresh all alerts with complex analysis
export const refreshAlerts = async (): Promise<void> => {
  _currentAlerts = [];
  
  generateMarketEvents();
  updateBusinessMetrics();
  
  try {
    await Promise.all([
      fetchKPIData(),
      fetchBudgetData(),
      fetchRiskData()
    ]);
  } catch (error) {
    console.error('Error refreshing alerts:', error);
  }
};

// Export business metrics for external access
export const getBusinessMetrics = (): BusinessMetrics => ({ ...businessMetrics });

// Export active market events
export const getActiveMarketEvents = (): MarketEvent[] => [...activeMarketEvents];
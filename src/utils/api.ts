// Enhanced API utilities with dynamic data simulation and proactive alerting
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
}

export interface BudgetData {
  category: string;
  spent: number;
  budget: number;
  variance: number;
}

export interface InsightData {
  type: 'opportunity' | 'warning' | 'success';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RiskData {
  category: string;
  level: string;
  score: number;
  description: string;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: number;
  source: 'KPI' | 'Risk' | 'Budget' | 'CashFlow' | 'System';
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
}

// Global simulation state
let currentConfig: SimulationConfig = {
  baseRevenue: 2400000,
  growthRate: 5,
  marketVolatility: 10,
  seasonality: 15,
  competitionImpact: 8
};

// Alert management
let _currentAlerts: Alert[] = [];
let _alertIdCounter = 0;

// Alert thresholds configuration
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
  MARKET_VOLATILITY_CRITICAL: 30
};

export const updateSimulationConfig = (config: Partial<SimulationConfig>) => {
  currentConfig = { ...currentConfig, ...config };
};

export const getSimulationConfig = (): SimulationConfig => currentConfig;

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

// Helper function to generate unique alert IDs
const generateAlertId = (): string => {
  return `alert_${++_alertIdCounter}_${Date.now()}`;
};

// Helper function to add alerts
const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>): void => {
  // Check if similar alert already exists to avoid duplicates
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

// Alert generation logic for KPI data
const generateKPIAlerts = (kpis: KPIData[]): void => {
  kpis.forEach(kpi => {
    switch (kpi.title) {
      case 'Net Profit Margin':
        const profitMargin = kpi.rawValue;
        if (profitMargin < ALERT_THRESHOLDS.PROFIT_MARGIN_CRITICAL) {
          addAlert({
            type: 'critical',
            title: 'Critical Profit Margin Alert',
            message: `Profit margin has dropped to ${profitMargin.toFixed(1)}%, below critical threshold of ${ALERT_THRESHOLDS.PROFIT_MARGIN_CRITICAL}%`,
            source: 'KPI',
            priority: 'high',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.PROFIT_MARGIN_CRITICAL,
            currentValue: profitMargin
          });
        } else if (profitMargin < ALERT_THRESHOLDS.PROFIT_MARGIN_WARNING) {
          addAlert({
            type: 'warning',
            title: 'Low Profit Margin Warning',
            message: `Profit margin at ${profitMargin.toFixed(1)}% is below recommended threshold of ${ALERT_THRESHOLDS.PROFIT_MARGIN_WARNING}%`,
            source: 'KPI',
            priority: 'medium',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.PROFIT_MARGIN_WARNING,
            currentValue: profitMargin
          });
        }
        break;

      case 'Monthly Revenue':
        const revenueChange = parseFloat(kpi.change.replace('%', ''));
        if (revenueChange < ALERT_THRESHOLDS.REVENUE_DECLINE_CRITICAL) {
          addAlert({
            type: 'critical',
            title: 'Severe Revenue Decline',
            message: `Revenue has declined by ${Math.abs(revenueChange).toFixed(1)}%, indicating serious market challenges`,
            source: 'KPI',
            priority: 'high',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.REVENUE_DECLINE_CRITICAL,
            currentValue: revenueChange
          });
        } else if (revenueChange < ALERT_THRESHOLDS.REVENUE_DECLINE_WARNING) {
          addAlert({
            type: 'warning',
            title: 'Revenue Decline Alert',
            message: `Revenue has declined by ${Math.abs(revenueChange).toFixed(1)}%, monitor market conditions closely`,
            source: 'KPI',
            priority: 'medium',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.REVENUE_DECLINE_WARNING,
            currentValue: revenueChange
          });
        }
        break;

      case 'Cash Flow':
        const cashFlow = kpi.rawValue;
        if (cashFlow < ALERT_THRESHOLDS.CASH_FLOW_CRITICAL) {
          addAlert({
            type: 'critical',
            title: 'Critical Cash Flow Alert',
            message: `Cash flow at $${(cashFlow / 1000).toFixed(0)}K is critically low, immediate action required`,
            source: 'CashFlow',
            priority: 'high',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.CASH_FLOW_CRITICAL,
            currentValue: cashFlow
          });
        } else if (cashFlow < ALERT_THRESHOLDS.CASH_FLOW_WARNING) {
          addAlert({
            type: 'warning',
            title: 'Low Cash Flow Warning',
            message: `Cash flow at $${(cashFlow / 1000).toFixed(0)}K is below recommended levels`,
            source: 'CashFlow',
            priority: 'medium',
            actionRequired: true,
            threshold: ALERT_THRESHOLDS.CASH_FLOW_WARNING,
            currentValue: cashFlow
          });
        }
        break;
    }
  });
};

// Alert generation logic for budget data
const generateBudgetAlerts = (budgets: BudgetData[]): void => {
  budgets.forEach(budget => {
    const absVariance = Math.abs(budget.variance);
    
    if (absVariance > ALERT_THRESHOLDS.BUDGET_VARIANCE_CRITICAL) {
      addAlert({
        type: 'critical',
        title: `Critical Budget Variance - ${budget.category}`,
        message: `${budget.category} is ${budget.variance > 0 ? 'over' : 'under'} budget by ${absVariance.toFixed(1)}%`,
        source: 'Budget',
        priority: 'high',
        actionRequired: true,
        threshold: ALERT_THRESHOLDS.BUDGET_VARIANCE_CRITICAL,
        currentValue: absVariance
      });
    } else if (absVariance > ALERT_THRESHOLDS.BUDGET_VARIANCE_WARNING) {
      addAlert({
        type: 'warning',
        title: `Budget Variance Alert - ${budget.category}`,
        message: `${budget.category} is ${budget.variance > 0 ? 'over' : 'under'} budget by ${absVariance.toFixed(1)}%`,
        source: 'Budget',
        priority: 'medium',
        actionRequired: false,
        threshold: ALERT_THRESHOLDS.BUDGET_VARIANCE_WARNING,
        currentValue: absVariance
      });
    }
  });
};

// Alert generation logic for risk data
const generateRiskAlerts = (risks: RiskData[]): void => {
  risks.forEach(risk => {
    if (risk.score >= ALERT_THRESHOLDS.RISK_SCORE_CRITICAL) {
      addAlert({
        type: 'critical',
        title: `Critical Risk Level - ${risk.category}`,
        message: `${risk.category} risk score is ${risk.score}/100, requiring immediate attention`,
        source: 'Risk',
        priority: 'high',
        actionRequired: true,
        threshold: ALERT_THRESHOLDS.RISK_SCORE_CRITICAL,
        currentValue: risk.score
      });
    } else if (risk.score >= ALERT_THRESHOLDS.RISK_SCORE_WARNING) {
      addAlert({
        type: 'warning',
        title: `Elevated Risk Level - ${risk.category}`,
        message: `${risk.category} risk score is ${risk.score}/100, monitor closely`,
        source: 'Risk',
        priority: 'medium',
        actionRequired: false,
        threshold: ALERT_THRESHOLDS.RISK_SCORE_WARNING,
        currentValue: risk.score
      });
    }
  });
};

// Alert generation for system/configuration issues
const generateSystemAlerts = (): void => {
  if (currentConfig.marketVolatility >= ALERT_THRESHOLDS.MARKET_VOLATILITY_CRITICAL) {
    addAlert({
      type: 'critical',
      title: 'Extreme Market Volatility',
      message: `Market volatility at ${currentConfig.marketVolatility}% is extremely high, forecasts may be unreliable`,
      source: 'System',
      priority: 'high',
      actionRequired: true,
      threshold: ALERT_THRESHOLDS.MARKET_VOLATILITY_CRITICAL,
      currentValue: currentConfig.marketVolatility
    });
  } else if (currentConfig.marketVolatility >= ALERT_THRESHOLDS.MARKET_VOLATILITY_WARNING) {
    addAlert({
      type: 'warning',
      title: 'High Market Volatility',
      message: `Market volatility at ${currentConfig.marketVolatility}% is elevated, exercise caution in planning`,
      source: 'System',
      priority: 'medium',
      actionRequired: false,
      threshold: ALERT_THRESHOLDS.MARKET_VOLATILITY_WARNING,
      currentValue: currentConfig.marketVolatility
    });
  }

  if (currentConfig.competitionImpact > 15) {
    addAlert({
      type: 'warning',
      title: 'High Competitive Pressure',
      message: `Competition impact at ${currentConfig.competitionImpact}% suggests significant market pressure`,
      source: 'System',
      priority: 'medium',
      actionRequired: true,
      threshold: 15,
      currentValue: currentConfig.competitionImpact
    });
  }
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced data generators with dynamic simulation and alert generation
export const fetchKPIData = async (config?: Partial<SimulationConfig>): Promise<KPIData[]> => {
  await delay(800);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  
  // Dynamic revenue calculation with multiple factors
  const baseRevenue = activeConfig.baseRevenue;
  const growthFactor = activeConfig.growthRate / 100;
  const volatilityFactor = (Math.random() - 0.5) * (activeConfig.marketVolatility / 100);
  const seasonalityFactor = Math.sin(Date.now() / 1000000) * (activeConfig.seasonality / 100);
  const competitionFactor = -(activeConfig.competitionImpact / 100) * Math.random();
  
  const totalVariation = growthFactor + volatilityFactor + seasonalityFactor + competitionFactor;
  const revenue = baseRevenue * (1 + totalVariation);
  
  // Dynamic expenses based on revenue and efficiency
  const baseExpenses = baseRevenue * 0.75; // 75% of base revenue
  const expenseEfficiency = Math.random() * 0.1 - 0.05; // ±5% efficiency variation
  const expenses = baseExpenses * (1 + expenseEfficiency);
  
  // Calculate profit margin
  const profit = revenue - expenses;
  const profitMargin = (profit / revenue) * 100;
  
  // Dynamic cash flow based on profit and working capital changes
  const workingCapitalChange = (Math.random() - 0.5) * 0.2;
  const cashFlow = profit * (1 + workingCapitalChange);
  
  const kpiData = [
    {
      title: 'Monthly Revenue',
      value: `$${(revenue / 1000000).toFixed(1)}M`,
      change: `${totalVariation > 0 ? '+' : ''}${(totalVariation * 100).toFixed(1)}%`,
      trend: totalVariation > 0 ? 'up' : 'down',
      rawValue: revenue
    },
    {
      title: 'Operating Expenses',
      value: `$${(expenses / 1000000).toFixed(1)}M`,
      change: `${expenseEfficiency > 0 ? '+' : ''}${(expenseEfficiency * 100).toFixed(1)}%`,
      trend: expenseEfficiency > 0 ? 'up' : 'down',
      rawValue: expenses
    },
    {
      title: 'Net Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      change: `${totalVariation > expenseEfficiency ? '+' : ''}${((totalVariation - expenseEfficiency) * 100).toFixed(1)}%`,
      trend: totalVariation > expenseEfficiency ? 'up' : 'down',
      rawValue: profitMargin
    },
    {
      title: 'Cash Flow',
      value: `$${(cashFlow / 1000).toFixed(0)}K`,
      change: `${workingCapitalChange > 0 ? '+' : ''}${(workingCapitalChange * 100).toFixed(1)}%`,
      trend: workingCapitalChange > 0 ? 'up' : 'down',
      rawValue: cashFlow
    }
  ] as KPIData[];

  // Generate alerts based on KPI data
  generateKPIAlerts(kpiData);
  
  return kpiData;
};

// New function to fetch historical KPI data
export const fetchKPIHistoricalData = async (
  kpiTitle: string, 
  timeRange: '7d' | '30d' | '90d' | '1y'
): Promise<KPIHistoricalData[]> => {
  await delay(600);
  
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const data: KPIHistoricalData[] = [];
  
  // Base values for different KPIs
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
    
    // Generate realistic historical data with trends
    const trendFactor = (days - i) / days * (currentConfig.growthRate / 100);
    const volatilityFactor = (Math.random() - 0.5) * (currentConfig.marketVolatility / 100);
    const seasonalFactor = Math.sin((date.getTime() / 86400000) * Math.PI / 30) * (currentConfig.seasonality / 100);
    
    let value = baseValue * (1 + trendFactor + volatilityFactor + seasonalFactor);
    
    // Ensure positive values and realistic ranges
    if (kpiTitle === 'Net Profit Margin') {
      value = Math.max(0, Math.min(50, value));
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

// New function to fetch KPI-specific insights
export const fetchKPIInsights = async (kpiTitle: string): Promise<KPIInsight[]> => {
  await delay(400);
  
  const insights: KPIInsight[] = [];
  
  switch (kpiTitle) {
    case 'Monthly Revenue':
      if (currentConfig.growthRate > 8) {
        insights.push({
          type: 'positive',
          title: 'Strong Revenue Growth',
          description: `Revenue is growing at ${currentConfig.growthRate}% annually, outpacing industry averages.`,
          recommendation: 'Consider investing in capacity expansion to support continued growth.'
        });
      } else if (currentConfig.growthRate < 2) {
        insights.push({
          type: 'negative',
          title: 'Slow Revenue Growth',
          description: `Revenue growth at ${currentConfig.growthRate}% is below market expectations.`,
          recommendation: 'Review marketing strategies and explore new revenue streams.'
        });
      }
      
      if (currentConfig.seasonality > 20) {
        insights.push({
          type: 'neutral',
          title: 'High Seasonality Impact',
          description: `Revenue shows ${currentConfig.seasonality}% seasonal variation.`,
          recommendation: 'Develop strategies to smooth seasonal fluctuations.'
        });
      }
      break;
      
    case 'Operating Expenses':
      insights.push({
        type: 'neutral',
        title: 'Expense Optimization Opportunity',
        description: 'Operating expenses represent 75% of revenue, which is within industry norms.',
        recommendation: 'Monitor for efficiency improvements and cost reduction opportunities.'
      });
      
      if (currentConfig.marketVolatility > 15) {
        insights.push({
          type: 'negative',
          title: 'Expense Volatility Risk',
          description: `High market volatility (${currentConfig.marketVolatility}%) may impact expense predictability.`,
          recommendation: 'Implement flexible budgeting and cost control measures.'
        });
      }
      break;
      
    case 'Net Profit Margin':
      const estimatedMargin = (1 - 0.75) * 100; // Simplified calculation
      if (estimatedMargin > 20) {
        insights.push({
          type: 'positive',
          title: 'Healthy Profit Margins',
          description: 'Profit margins are strong, indicating efficient operations.',
          recommendation: 'Maintain operational efficiency while exploring growth opportunities.'
        });
      } else if (estimatedMargin < 10) {
        insights.push({
          type: 'negative',
          title: 'Margin Pressure',
          description: 'Profit margins are under pressure, requiring attention.',
          recommendation: 'Focus on cost optimization and pricing strategy review.'
        });
      }
      break;
      
    case 'Cash Flow':
      insights.push({
        type: 'positive',
        title: 'Positive Cash Generation',
        description: 'Strong cash flow supports business operations and growth investments.',
        recommendation: 'Consider strategic investments or debt reduction opportunities.'
      });
      
      if (currentConfig.competitionImpact > 12) {
        insights.push({
          type: 'negative',
          title: 'Competitive Cash Flow Risk',
          description: `High competitive pressure (${currentConfig.competitionImpact}%) may impact future cash flows.`,
          recommendation: 'Strengthen competitive position and diversify revenue sources.'
        });
      }
      break;
  }
  
  // Ensure we always return at least 2 insights
  if (insights.length < 2) {
    insights.push({
      type: 'neutral',
      title: 'AI Analysis Active',
      description: 'Continuous monitoring and analysis of this metric is providing valuable insights.',
      recommendation: 'Regular review of this KPI will help identify trends and opportunities.'
    });
  }
  
  return insights.slice(0, 4); // Limit to 4 insights max
};

export const fetchCashFlowData = async (config?: Partial<SimulationConfig>): Promise<CashFlowData[]> => {
  await delay(600);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  const baseValue = activeConfig.baseRevenue / 12 * 0.35; // Monthly cash flow base
  
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
    const seasonalMultiplier = 1 + Math.sin((index + 1) * Math.PI / 6) * (activeConfig.seasonality / 100);
    const volatilityFactor = (Math.random() - 0.5) * (activeConfig.marketVolatility / 100);
    const growthFactor = (index + 1) * (activeConfig.growthRate / 100) / 12;
    
    const value = baseValue * seasonalMultiplier * (1 + volatilityFactor + growthFactor);
    
    return {
      month,
      value: Math.max(value / 1000, 0) // Convert to thousands and ensure positive
    };
  });
};

export const fetchBudgetData = async (config?: Partial<SimulationConfig>): Promise<BudgetData[]> => {
  await delay(700);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  const volatility = activeConfig.marketVolatility / 100;
  
  const categories = [
    { name: 'Marketing', baseSpent: 180000, baseBudget: 200000 },
    { name: 'Operations', baseSpent: 450000, baseBudget: 420000 },
    { name: 'R&D', baseSpent: 320000, baseBudget: 350000 },
    { name: 'Sales', baseSpent: 280000, baseBudget: 300000 },
    { name: 'Admin', baseSpent: 120000, baseBudget: 125000 }
  ];
  
  const budgetData = categories.map(cat => {
    const spentVariation = (Math.random() - 0.5) * volatility;
    const spent = cat.baseSpent * (1 + spentVariation);
    const variance = ((spent - cat.baseBudget) / cat.baseBudget) * 100;
    
    return {
      category: cat.name,
      spent,
      budget: cat.baseBudget,
      variance: Number(variance.toFixed(1))
    };
  });

  // Generate alerts based on budget data
  generateBudgetAlerts(budgetData);
  
  return budgetData;
};

export const fetchInsightsData = async (config?: Partial<SimulationConfig>): Promise<InsightData[]> => {
  await delay(900);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  
  const insights: InsightData[] = [];
  
  // Dynamic insights based on configuration
  if (activeConfig.growthRate > 10) {
    insights.push({
      type: 'opportunity',
      title: 'High Growth Momentum',
      description: `Strong ${activeConfig.growthRate}% growth rate detected. Consider scaling operations.`,
      action: 'Plan capacity expansion',
      priority: 'high'
    });
  }
  
  if (activeConfig.marketVolatility > 15) {
    insights.push({
      type: 'warning',
      title: 'Market Volatility Alert',
      description: `High market volatility (${activeConfig.marketVolatility}%) may impact forecasting accuracy.`,
      action: 'Review risk management',
      priority: 'medium'
    });
  }
  
  if (activeConfig.competitionImpact > 12) {
    insights.push({
      type: 'warning',
      title: 'Competitive Pressure',
      description: `Significant competitive impact (${activeConfig.competitionImpact}%) on market share.`,
      action: 'Strengthen competitive position',
      priority: 'high'
    });
  }
  
  // Always include some base insights
  insights.push({
    type: 'success',
    title: 'AI Optimization Active',
    description: 'Dynamic simulation models are providing real-time financial insights.',
    action: 'Continue monitoring',
    priority: 'low'
  });
  
  return insights.slice(0, 3); // Limit to 3 insights
};

export const fetchRiskData = async (config?: Partial<SimulationConfig>): Promise<RiskData[]> => {
  await delay(750);
  
  const activeConfig = config ? { ...currentConfig, ...config } : currentConfig;
  
  // Dynamic risk calculation based on configuration
  const marketRiskScore = Math.min(90, 30 + activeConfig.marketVolatility * 2);
  const operationalRiskScore = Math.min(90, 20 + activeConfig.competitionImpact * 3);
  const liquidityRiskScore = Math.max(10, 50 - activeConfig.growthRate * 2);
  
  const getRiskLevel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };
  
  const riskData = [
    {
      category: 'Market Risk',
      level: getRiskLevel(marketRiskScore),
      score: Math.round(marketRiskScore),
      description: `Market volatility at ${activeConfig.marketVolatility}% creates uncertainty in projections`
    },
    {
      category: 'Liquidity Risk',
      level: getRiskLevel(liquidityRiskScore),
      score: Math.round(liquidityRiskScore),
      description: `Current growth rate of ${activeConfig.growthRate}% impacts cash requirements`
    },
    {
      category: 'Operational Risk',
      level: getRiskLevel(operationalRiskScore),
      score: Math.round(operationalRiskScore),
      description: `Competition impact of ${activeConfig.competitionImpact}% affects operational stability`
    }
  ];

  // Generate alerts based on risk data
  generateRiskAlerts(riskData);
  
  return riskData;
};

// Function to refresh all alerts (called when data is refreshed)
export const refreshAlerts = async (): Promise<void> => {
  // Clear existing alerts
  _currentAlerts = [];
  
  // Generate system alerts
  generateSystemAlerts();
  
  // Fetch fresh data and generate alerts
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
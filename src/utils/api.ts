// Enhanced API utilities with dynamic data simulation
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

export interface SimulationConfig {
  baseRevenue: number;
  growthRate: number;
  marketVolatility: number;
  seasonality: number;
  competitionImpact: number;
}

// Global simulation state
let currentConfig: SimulationConfig = {
  baseRevenue: 2400000,
  growthRate: 5,
  marketVolatility: 10,
  seasonality: 15,
  competitionImpact: 8
};

export const updateSimulationConfig = (config: Partial<SimulationConfig>) => {
  currentConfig = { ...currentConfig, ...config };
};

export const getSimulationConfig = (): SimulationConfig => currentConfig;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced data generators with dynamic simulation
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
  
  return [
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
  ];
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
  
  return categories.map(cat => {
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
  
  return [
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
};
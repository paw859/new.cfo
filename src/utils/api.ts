// Mock API utilities for simulating data fetching
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

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators with some randomization
export const fetchKPIData = async (): Promise<KPIData[]> => {
  await delay(800);
  
  const baseRevenue = 2400000;
  const revenueVariation = (Math.random() - 0.5) * 0.2; // ±10%
  const revenue = baseRevenue * (1 + revenueVariation);
  
  return [
    {
      title: 'Monthly Revenue',
      value: `$${(revenue / 1000000).toFixed(1)}M`,
      change: `${revenueVariation > 0 ? '+' : ''}${(revenueVariation * 100).toFixed(1)}%`,
      trend: revenueVariation > 0 ? 'up' : 'down',
      rawValue: revenue
    },
    {
      title: 'Operating Expenses',
      value: '$1.8M',
      change: '-3.2%',
      trend: 'down',
      rawValue: 1800000
    },
    {
      title: 'Net Profit Margin',
      value: '25.8%',
      change: '+2.1%',
      trend: 'up',
      rawValue: 25.8
    },
    {
      title: 'Cash Flow',
      value: '$850K',
      change: '+8.7%',
      trend: 'up',
      rawValue: 850000
    }
  ];
};

export const fetchCashFlowData = async (): Promise<CashFlowData[]> => {
  await delay(600);
  
  const baseData = [850, 920, 780, 1100, 950, 1200];
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => ({
    month,
    value: baseData[index] + (Math.random() - 0.5) * 100 // Add some variation
  }));
};

export const fetchBudgetData = async (): Promise<BudgetData[]> => {
  await delay(700);
  
  return [
    { category: 'Marketing', spent: 180000, budget: 200000, variance: -10 },
    { category: 'Operations', spent: 450000, budget: 420000, variance: 7.1 },
    { category: 'R&D', spent: 320000, budget: 350000, variance: -8.6 },
    { category: 'Sales', spent: 280000, budget: 300000, variance: -6.7 },
    { category: 'Admin', spent: 120000, budget: 125000, variance: -4 }
  ];
};

export const fetchInsightsData = async (): Promise<InsightData[]> => {
  await delay(900);
  
  const insights = [
    {
      type: 'opportunity' as const,
      title: 'Revenue Optimization',
      description: 'AI detected 12% potential revenue increase through pricing optimization in Q3.',
      action: 'Review pricing strategy',
      priority: 'high' as const
    },
    {
      type: 'warning' as const,
      title: 'Expense Anomaly',
      description: 'Marketing spend increased 25% above budget this month. Recommend review.',
      action: 'Audit marketing expenses',
      priority: 'medium' as const
    },
    {
      type: 'success' as const,
      title: 'Cost Savings Achieved',
      description: 'Automated processes saved $180K in operational costs this quarter.',
      action: 'Continue automation',
      priority: 'low' as const
    }
  ];
  
  // Randomly shuffle insights to simulate dynamic AI analysis
  return insights.sort(() => Math.random() - 0.5);
};

export const fetchRiskData = async (): Promise<RiskData[]> => {
  await delay(750);
  
  return [
    {
      category: 'Market Risk',
      level: 'Medium',
      score: 65 + Math.floor((Math.random() - 0.5) * 20),
      description: 'Economic volatility may impact Q4 revenue projections'
    },
    {
      category: 'Liquidity Risk',
      level: 'Low',
      score: 25 + Math.floor((Math.random() - 0.5) * 10),
      description: 'Strong cash position with 6+ months runway'
    },
    {
      category: 'Operational Risk',
      level: 'High',
      score: 80 + Math.floor((Math.random() - 0.5) * 15),
      description: 'Key supplier dependency creates potential disruption'
    }
  ];
};
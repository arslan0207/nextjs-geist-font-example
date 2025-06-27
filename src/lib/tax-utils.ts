// Tax calculation utilities for Kashmir Carpentry LLC

export const calculateCooperativeTax = (amount: number): number => {
  // 9% cooperative tax
  return amount * 0.09;
};

export const calculateVAT = (amount: number): number => {
  // 5% VAT
  return amount * 0.05;
};

export const calculateTotalWithTaxes = (amount: number): {
  subtotal: number;
  cooperativeTax: number;
  vat: number;
  total: number;
} => {
  const subtotal = amount;
  const cooperativeTax = calculateCooperativeTax(subtotal);
  const vat = calculateVAT(subtotal);
  const total = subtotal + cooperativeTax + vat;

  return {
    subtotal,
    cooperativeTax,
    vat,
    total,
  };
};

// Calculate UAE Corporate Tax
export const calculateUAECorporateTax = (income: number, expenses: number): number => {
  const taxableIncome = income - expenses;
  const threshold = 375000; // AED threshold

  if (taxableIncome <= threshold) {
    return 0;
  }

  // 9% corporate tax on income exceeding AED 375,000
  return (taxableIncome - threshold) * 0.09;
};

// Format currency to AED
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

// Calculate project profit/loss
export const calculateProjectProfitLoss = (
  totalRevenue: number,
  totalCosts: number
): {
  profit: number;
  profitMargin: number;
  isProfit: boolean;
  corporateTax: number;
  netProfit: number;
} => {
  const profit = totalRevenue - totalCosts;
  const profitMargin = (profit / totalRevenue) * 100;
  const isProfit = profit >= 0;
  const corporateTax = calculateUAECorporateTax(totalRevenue, totalCosts);
  const netProfit = profit - corporateTax;

  return {
    profit: Math.abs(profit),
    profitMargin: Math.abs(profitMargin),
    isProfit,
    corporateTax,
    netProfit
  };
};

// Financial report interface
export interface FinancialReportData {
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  corporateTax: number;
  netProfit: number;
  vat: number;
}

// Generate financial report
export const generateFinancialReport = (
  revenue: number,
  expenses: number,
  period: string
): FinancialReportData => {
  const profit = revenue - expenses;
  const corporateTax = calculateUAECorporateTax(revenue, expenses);
  const vat = calculateVAT(revenue);
  const netProfit = profit - corporateTax;

  return {
    period,
    revenue,
    expenses,
    profit,
    corporateTax,
    netProfit,
    vat,
  };
};

import {
  getRevenuesFromDB,
  getExpensesFromDB,
  addRevenueToDB,
  updateRevenueInDB,
  deleteRevenueFromDB,
  addExpenseToDB,
  updateExpenseInDB,
  deleteExpenseFromDB,
  getFinancialSummary
} from './databaseService';

export interface Revenue {
  id: number;
  source: string;
  amount: number;
  date: string;
  gross_profit: number;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export const getRevenues = (): Promise<Revenue[]> => {
  return getRevenuesFromDB();
};

export const addRevenue = (revenue: Omit<Revenue, 'id'>): Promise<number> => {
  return addRevenueToDB(revenue);
};

export const updateRevenue = (id: number, revenue: Omit<Revenue, 'id'>): Promise<void> => {
  return updateRevenueInDB(id, revenue);
};

export const deleteRevenue = (id: number): Promise<void> => {
  return deleteRevenueFromDB(id);
};

export const getExpenses = (): Promise<Expense[]> => {
  return getExpensesFromDB();
};

export const addExpense = (expense: Omit<Expense, 'id'>): Promise<number> => {
  return addExpenseToDB(expense);
};

export const updateExpense = (id: number, expense: Omit<Expense, 'id'>): Promise<void> => {
  return updateExpenseInDB(id, expense);
};

export const deleteExpense = (id: number): Promise<void> => {
  return deleteExpenseFromDB(id);
};

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
}

export const getSummary = (): Promise<FinancialSummary> => {
  return getFinancialSummary();
}; 
import { Transaction, Budget } from "@/lib/types";

const TX_KEY = "finance_transactions";
const BUDGET_KEY = "finance_budgets";

export const getTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TX_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTransactions = (txs: Transaction[]) => {
  localStorage.setItem(TX_KEY, JSON.stringify(txs));
};

export const getBudgets = (): Budget[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]) => {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
};
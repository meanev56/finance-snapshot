export type Category =
  | "Salary" | "Freelance" | "Gift" | "Other"          // Income
  | "Food" | "Transport" | "Utilities" | "Entertainment" | "Shopping"; // Expenses

export interface Transaction {
  id: string;
  amount: number;       // >0 = income, <0 = expense
  category: Category;
  description: string;
  date: string;         // YYYY-MM-DD
}

export interface Budget {
  category: Category;
  limit: number;        // positive monthly limit (for expenses only)
}
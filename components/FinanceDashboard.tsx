"use client"

import { toast, Toaster } from 'sonner'
import { motion } from "framer-motion"
import { AlertCircle, ChevronLeft, ChevronRight, DollarSign, Moon, Sun, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react';
import { addMonths, endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { Budget, Category, Transaction } from '@/lib/types';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import TransactionForm from './TransactionForm';
import { getBudgets, getTransactions, saveBudgets, saveTransactions } from '@/lib/storage';
import BudgetProgress from './BudgetProgress';
import TransactionList from './TransactionList';
import { useTheme } from 'next-themes';

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const INCOME_CATS: Category[] = ["Salary", "Freelance", "Gift", "Other"];
const EXPENSE_CATS: Category[] = ["Food", "Transport", "Utilities", "Entertainment", "Shopping"];

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [month, setMonth] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setTransactions(getTransactions())
    const saved = getBudgets()
    setBudgets(saved.length ? saved : EXPENSE_CATS.map(c => ({ category: c, limit: 50000 })))
  }, [])

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx = { ...tx, id: crypto.randomUUID() }
    const updated = [newTx, ...transactions]
    setTransactions(updated)
    saveTransactions(updated)
    toast.success("Transaction added")
  }

  const updateBudget = (category: Category, limit: number) => {
    const updated = budgets.map(b => b.category === category ? { ...b, limit: Math.max(0, limit) } : b)
    setBudgets(updated)
    saveBudgets(updated)
  }

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  const monthTx = transactions.filter(t => isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd }))

  const income = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expenses = Math.abs(monthTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))
  const balance = income - expenses

  const filteredTx = monthTx.filter(tx => {
    const matchSearch = (tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) || tx.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchType = typeFilter === "all" || (typeFilter === "income" && tx.amount > 0) || (typeFilter === "expense" && tx.amount < 0)
    return matchSearch && matchType
  })

  const pieData = EXPENSE_CATS.map(cat => ({
    name: cat,
    value: Math.abs(monthTx.filter(t => t.category === cat && t.amount < 0).reduce((s, t) => s + t.amount, 0))
  })).filter(d => d.value > 0)

  const exportToCSV = () => {
    if (transactions.length === 0) {
        toast.error("No transactions to export");
        return;
    }

    const headers = ["Date", "Type", "Category", "Description", "Amount (₦)"];
    const rows = transactions.map((tx) => [
        tx.date,
        tx.amount > 0 ? "Income" : "Expense",
        tx.category,
        `"${(tx.description || "").replace(/"/g, '""')}"`,
        Math.abs(tx.amount).toLocaleString(),
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `finance-snapshot-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };
    
  return (
    <div className='min-h-screen'>
      <Toaster richColors position="top-center" />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Header + Month Picker */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-6"
        >
            <h1 className="text-3xl font-bold tracking-tight">Finance Snapshot</h1>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-2">
                    <button onClick={() => setMonth(subMonths(month, 1))} className="p-1.5 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="font-medium min-w-32 text-center">{format(month, "MMMM yyyy")}</span>
                        <button onClick={() => setMonth(addMonths(month, 1))} className="p-1.5 hover:bg-muted rounded-full">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                </div>
                 <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg hover:bg-muted"
                >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
            </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
                <TrendingUp className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{income.toLocaleString()}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
                <DollarSign className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{expenses.toLocaleString()}</p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">₦{balance.toLocaleString()}</p>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">Expense Breakdown</h2>
            <div className="h-80 sm:h-96">
              {pieData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={130}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => `₦${val.toLocaleString()}`} />
                    <Legend verticalAlign="bottom" height={40} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No expenses this month
                </div>
              )}
            </div>
          </div>

          {/* Add Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit">
            <h2 className="text-xl font-semibold mb-5 text-gray-800">New Transaction</h2>
            <TransactionForm onAdd={addTransaction} />
          </div>
        </div>

        {/* Budgets */}
        <BudgetProgress
            budgets={budgets.filter(b => EXPENSE_CATS.includes(b.category))}
            transactions={monthTx}
            onUpdate={updateBudget}
        />

        {/* Transactions */}
        <TransactionList transactions={monthTx} />


      </div>
    </div>
  )
}

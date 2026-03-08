"use client"

import { useState, useEffect } from "react"
import { Transaction, Budget, Category } from "@/lib/types"
import {
  getTransactions,
  saveTransactions,
  getBudgets,
  saveBudgets,
} from "@/lib/storage"
import TransactionForm from "./TransactionForm"
import TransactionList from "./TransactionList"
import BudgetProgress from "./BudgetProgress"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import {
  format,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Sun, Moon, TrendingUp, DollarSign, AlertCircle } from "lucide-react"
import { toast, Toaster } from "sonner"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

const INCOME_CATS: Category[] = ["Salary", "Freelance", "Gift", "Other"]
const EXPENSE_CATS: Category[] = ["Food", "Transport", "Utilities", "Entertainment", "Shopping"]

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [month, setMonth] = useState(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTransactions(getTransactions())
    const savedBudgets = getBudgets()
    setBudgets(savedBudgets.length ? savedBudgets : EXPENSE_CATS.map(c => ({ category: c, limit: 50000 })))
  }, [])

  const addTransaction = (tx: Omit<Transaction, "id">) => {
    const newTx = { ...tx, id: crypto.randomUUID() }
    const updated = [newTx, ...transactions]
    setTransactions(updated)
    saveTransactions(updated)
    toast.success("Transaction added")
  }

  const updateBudget = (category: Category, limit: number) => {
    const updated = budgets.map(b =>
      b.category === category ? { ...b, limit: Math.max(0, limit) } : b
    )
    setBudgets(updated)
    saveBudgets(updated)
  }

  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  const monthTx = transactions.filter(t =>
    isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
  )

  const income = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0)
  const expenses = Math.abs(monthTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0))
  const balance = income - expenses

  const filteredTx = monthTx.filter(tx => {
    const matchSearch =
      (tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchType =
      typeFilter === "all" ||
      (typeFilter === "income" && tx.amount > 0) ||
      (typeFilter === "expense" && tx.amount < 0)
    return matchSearch && matchType
  })

  const pieData = EXPENSE_CATS.map(cat => ({
    name: cat,
    value: Math.abs(
      monthTx.filter(t => t.category === cat && t.amount < 0).reduce((s, t) => s + t.amount, 0)
    ),
  })).filter(d => d.value > 0)

  const isDark = mounted && theme === "dark"

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-center" />
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <h1 className="text-3xl font-bold tracking-tight">Finance Snapshot</h1>

          <div className="flex items-center gap-4">
            {/* Month navigation */}
            <div className="flex items-center gap-2 bg-card border rounded-full px-4 py-2">
              <button
                onClick={() => setMonth(subMonths(month, 1))}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium min-w-32 text-center">
                {format(month, "MMMM yyyy")}
              </span>
              <button
                onClick={() => setMonth(addMonths(month, 1))}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Theme toggle - both icons always rendered, opacity controlled */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Toggle dark/light mode"
            >
              <div className="relative h-5 w-5">
                <Sun
                  className={`
                    absolute inset-0 h-5 w-5 transition-all duration-200 ease-in-out
                    ${isDark ? "opacity-0 scale-75" : "opacity-100 scale-100"}
                  `}
                />
                <Moon
                  className={`
                    absolute inset-0 h-5 w-5 transition-all duration-200 ease-in-out
                    ${isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"}
                  `}
                />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            <p className="text-sm text-muted-foreground">Income</p>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ₦{income.toLocaleString()}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
            <DollarSign className="mx-auto h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
            <p className="text-sm text-muted-foreground">Expenses</p>
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              ₦{expenses.toLocaleString()}
            </p>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm text-center">
            {balance >= 0 ? (
              <TrendingUp className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            ) : (
              <AlertCircle className="mx-auto h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
            )}
            <p className="text-sm text-muted-foreground">Balance</p>
            <p
              className={`text-3xl font-bold ${
                balance >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              ₦{balance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search description or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="
              flex-1 px-4 py-2 rounded-lg border bg-card
              border-input focus:border-primary focus:ring-2 focus:ring-primary/20
              outline-none transition-all
            "
          />

          <div className="flex gap-2 justify-center sm:justify-end">
            {(["all", "income", "expense"] as const).map(opt => (
              <button
                key={opt}
                onClick={() => setTypeFilter(opt)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    typeFilter === opt
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }
                `}
              >
                {opt === "all" ? "All" : opt === "income" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pie Chart */}
          <div className="lg:col-span-2 bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">Expense Breakdown</h2>
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
                      label={({ name, percent }) => 
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                    <Tooltip formatter={(val) => `₦${(val ?? 0).toLocaleString()}`} />
                    <Legend verticalAlign="bottom" height={40} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No expenses this month
                </div>
              )}
            </div>
          </div>

          {/* Transaction Form */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-5">New Transaction</h2>
            <TransactionForm onAdd={addTransaction} />
          </div>
        </div>

        {/* Budget Progress */}
        <BudgetProgress
          budgets={budgets.filter(b => EXPENSE_CATS.includes(b.category))}
          transactions={filteredTx}
          onUpdate={updateBudget}
        />

        {/* Transaction List */}
        <TransactionList transactions={filteredTx} />
      </div>
    </div>
  )
}
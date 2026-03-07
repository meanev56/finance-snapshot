"use client"

import { toast, Toaster } from 'sonner'
import { motion } from "framer-motion"
import { AlertCircle, ChevronLeft, ChevronRight, DollarSign, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react';
import { addMonths, endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { Budget, Category, Transaction } from '@/lib/types';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import TransactionForm from './TransactionForm';
import { getBudgets, getTransactions, saveBudgets, saveTransactions } from '@/lib/storage';
import BudgetProgress from './BudgetProgress';
import TransactionList from './TransactionList';

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
const INCOME_CATS: Category[] = ["Salary", "Freelance", "Gift", "Other"];
const EXPENSE_CATS: Category[] = ["Food", "Transport", "Utilities", "Entertainment", "Shopping"];

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [month, setMonth] = useState(new Date());
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        setTransactions(getTransactions());
        const savedBudgets = getBudgets();
        setBudgets(savedBudgets.length ? savedBudgets : defaultBudgets());
      }, []);

    const defaultBudgets = (): Budget[] =>
          EXPENSE_CATS.map(cat => ({ category: cat, limit: 50000 }))

    const addTransaction = (tx: Omit<Transaction, "id">) => {
        const newTx = { ...tx, id: crypto.randomUUID() };
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        saveTransactions(updated);
        toast.success("Added!", {
            description: `${tx.amount > 0 ? "+" : "-"}₦${Math.abs(tx.amount).toLocaleString()} • ${tx.category}`,
        });
    };
    
    const updateBudget = (category: Category, limit: number) => {
        const updated = budgets.map(b =>
          b.category === category ? { ...b, limit: Math.max(0, limit) } : b
        );
        setBudgets(updated);
        saveBudgets(updated);
      };
    

    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTx = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );
    

    const income = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = Math.abs(monthTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
    const balance = income - expenses;


    const pieData = EXPENSE_CATS.map(cat => {
        const spent = Math.abs(
            monthTx.filter(t => t.category === cat && t.amount < 0).reduce((s, t) => s + t.amount, 0)
        );
        return { name: cat, value: spent };
        }).filter(d => d.value > 0);

    
  return (
    <div className='min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
      <Toaster richColors position="top-center" />
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header + Month Picker */}
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-6"
        >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Finance Snapshot
            </h1>
            <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow border">
                <button
                    onClick={() => setMonth(subMonths(month, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ChevronLeft size={22} />
                </button>
                <span className="font-semibold text-lg min-w-40 text-center">
                    {format(month, "MMMM yyyy")}
                </span>
                <button
                    onClick={() => setMonth(addMonths(month, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                    <ChevronRight size={22} />
                </button>
            </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard icon={<TrendingUp className="text-emerald-600" />} title="Income" value={income} color="text-emerald-700" />
            <StatCard icon={<DollarSign className="text-rose-600" />} title="Expenses" value={expenses} color="text-rose-700" />
            <StatCard
                icon={balance >= 0 ? <TrendingUp /> : <AlertCircle />}
                title="Balance"
                value={balance}
                color={balance >= 0 ? "text-emerald-700" : "text-rose-700"}
            />
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

function StatCard({ icon, title, value, color }: {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center"
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-sm text-gray-600 font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        ₦{value.toLocaleString()}
      </p>
    </motion.div>
  );
}
"use client"

import { Toaster } from 'sonner'
import { motion } from "framer-motion"
import { AlertCircle, ChevronLeft, ChevronRight, DollarSign, TrendingUp } from 'lucide-react'
import { useState } from 'react';
import { addMonths, endOfMonth, format, isWithinInterval, startOfMonth, subMonths } from 'date-fns';
import { Transaction } from '@/lib/types';

export default function FinanceDashboard() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [month, setMonth] = useState(new Date());

    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTx = transactions.filter(t =>
        isWithinInterval(new Date(t.date), { start: monthStart, end: monthEnd })
    );
    

    const income = monthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const expenses = Math.abs(monthTx.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
    const balance = income - expenses;

    
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
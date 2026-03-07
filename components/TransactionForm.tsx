"use client";

import { useState } from "react";
import { Transaction, Category } from "@/lib/types";
import { PlusCircle } from "lucide-react";

const ALL_CATS: Category[] = [
  "Salary", "Freelance", "Gift", "Other",
  "Food", "Transport", "Utilities", "Entertainment", "Shopping",
];

interface Props { onAdd: (tx: Omit<Transaction, "id">) => void; }

export default function TransactionForm({ onAdd }: Props) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<"expense" | "income">("expense");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    setLoading(true);
    const signed = type === "income" ? Number(amount) : -Number(amount);

    onAdd({ amount: signed, category, description, date });

    setAmount("");
    setDescription("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`py-3 rounded-xl font-medium transition-all ${
            type === "expense"
              ? "bg-rose-100 text-rose-800 border-2 border-rose-400 shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`py-3 rounded-xl font-medium transition-all ${
            type === "income"
              ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-400 shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Income
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount (₦)</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          required
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        >
          {ALL_CATS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Monthly salary / Dinner at Buka"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all ${
          loading ? "bg-gray-400" : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
        }`}
      >
        <PlusCircle size={18} />
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}
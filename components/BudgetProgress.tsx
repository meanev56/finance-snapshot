"use client";

import { Transaction, Budget, Category } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  budgets: Budget[];
  transactions: Transaction[];
  onUpdate: (cat: Category, limit: number) => void;
}

export default function BudgetProgress({ budgets, transactions, onUpdate }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Monthly Budgets</h2>
      <div className="space-y-6">
        {budgets.map(budget => {
          const spent = Math.abs(
            transactions
              .filter(t => t.category === budget.category && t.amount < 0)
              .reduce((s, t) => s + t.amount, 0)
          );
          const percent = Math.min((spent / budget.limit) * 100, 100) || 0;
          const color = percent < 60 ? "bg-emerald-500" : percent < 85 ? "bg-amber-500" : "bg-rose-500";

          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-800">{budget.category}</span>
                <input
                  type="number"
                  value={budget.limit}
                  onChange={e => onUpdate(budget.category, Number(e.target.value))}
                  onBlur={() => toast.info(`Budget for ${budget.category} updated`)}
                  className="w-28 px-3 py-1.5 text-right border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>₦{spent.toLocaleString()}</span>
                <span>₦{budget.limit.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`${color} h-full transition-all duration-700 ease-out`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
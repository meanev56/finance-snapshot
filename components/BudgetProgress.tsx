"use client"

import { Transaction, Budget, Category } from "@/lib/types"
import { categoryColors, categoryIcons } from "@/lib/categoryConfig"
import { toast } from "sonner"

interface BudgetProgressProps {
  budgets: Budget[]
  transactions: Transaction[]
  onUpdate: (category: Category, limit: number) => void
}

export default function BudgetProgress({ budgets, transactions, onUpdate }: BudgetProgressProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Monthly Budgets</h2>

      <div className="space-y-6">
        {budgets.map(budget => {
          const spent = Math.abs(
            transactions
              .filter(t => t.category === budget.category && t.amount < 0)
              .reduce((sum, t) => sum + t.amount, 0)
          )

          const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
          const isOver = percent > 100
          const isWarning = percent >= 75 && percent <= 100
          const isSafe = percent < 75

          const CategoryIcon = categoryIcons[budget.category]

          return (
            <div key={budget.category} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${categoryColors[budget.category]}`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <span className="font-medium">{budget.category}</span>
                </div>

                <input
                  type="number"
                  value={budget.limit}
                  onChange={e => onUpdate(budget.category, Number(e.target.value))}
                  onBlur={() => toast.success(`Budget for ${budget.category} updated`)}
                  className="
                    w-28 px-3 py-1.5 text-right text-sm rounded-lg border
                    bg-background border-input focus:border-primary focus:ring-2 focus:ring-primary/20
                    outline-none transition-all
                  "
                  min="0"
                  step="1000"
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: ₦{spent.toLocaleString()}</span>
                <span>Limit: ₦{budget.limit.toLocaleString()}</span>
              </div>

              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`
                    h-full transition-all duration-500 ease-out
                    ${isOver ? "bg-destructive" : isWarning ? "bg-amber-500 dark:bg-amber-600" : "bg-primary"}
                  `}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {isOver && (
                <p className="text-xs text-destructive font-medium">
                  Over budget by ₦{(spent - budget.limit).toLocaleString()}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
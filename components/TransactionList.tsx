import { Transaction } from "@/lib/types"
import { format } from "date-fns"
import { categoryColors, categoryIcons } from "@/lib/categoryConfig"

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-xl border shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No transactions found for this period.</p>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
      </div>

      <div className="divide-y divide-border">
        {transactions.map(tx => {
          const isIncome = tx.amount > 0
          const Icon = categoryIcons[tx.category]

          return (
            <div
              key={tx.id}
              className="
                flex items-center justify-between gap-4 p-5
                hover:bg-muted/50 transition-colors
              "
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`p-2.5 rounded-lg ${categoryColors[tx.category]}`}>
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {tx.description || tx.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(tx.date), "dd MMM yyyy • HH:mm")}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={`
                  font-semibold text-lg
                  ${isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}
                `}>
                  {isIncome ? "+" : "−"}₦{Math.abs(tx.amount).toLocaleString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
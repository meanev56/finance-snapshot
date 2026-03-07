"use client"

import { useState } from "react"
import { Transaction, Category } from "@/lib/types"
import { PlusCircle } from "lucide-react"
import { categoryIcons } from "@/lib/categoryConfig"

const ALL_CATEGORIES: Category[] = [
  "Salary", "Freelance", "Gift", "Other",
  "Food", "Transport", "Utilities", "Entertainment", "Shopping",
]

interface TransactionFormProps {
  onAdd: (tx: Omit<Transaction, "id">) => void
}

export default function TransactionForm({ onAdd }: TransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<Category>("Food")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<"expense" | "income">("expense")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return

    setSubmitting(true)

    const signedAmount = type === "income" ? Number(amount) : -Number(amount)

    onAdd({
      amount: signedAmount,
      category,
      description,
      date,
    })

    // reset form
    setAmount("")
    setDescription("")
    setSubmitting(false)
  }

  const CategoryIcon = categoryIcons[category]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`
            py-3 px-4 rounded-xl font-medium transition-all
            ${type === "expense"
              ? "bg-destructive/10 text-destructive border-2 border-destructive/40 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"}
          `}
        >
          Expense
        </button>

        <button
          type="button"
          onClick={() => setType("income")}
          className={`
            py-3 px-4 rounded-xl font-medium transition-all
            ${type === "income"
              ? "bg-primary/10 text-primary border-2 border-primary/40 shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"}
          `}
        >
          Income
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Amount (₦)
        </label>
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="
            w-full px-4 py-3 rounded-xl border bg-background
            border-input focus:border-primary focus:ring-2 focus:ring-primary/20
            outline-none transition-all
          "
          required
          autoFocus
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Category
        </label>
        <div className="relative">
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="
              w-full px-4 py-3 pr-10 rounded-xl border bg-background
              border-input focus:border-primary focus:ring-2 focus:ring-primary/20
              outline-none appearance-none transition-all
            "
          >
            {ALL_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <CategoryIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Lunch • Salary • Uber ride"
          className="
            w-full px-4 py-3 rounded-xl border bg-background
            border-input focus:border-primary focus:ring-2 focus:ring-primary/20
            outline-none transition-all
          "
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="
            w-full px-4 py-3 rounded-xl border bg-background
            border-input focus:border-primary focus:ring-2 focus:ring-primary/20
            outline-none transition-all
          "
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting || !amount}
        className="
          w-full flex items-center justify-center gap-2 py-3.5
          rounded-xl font-semibold text-primary-foreground
          bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground
          shadow-md transition-all active:scale-[0.98]
        "
      >
        <PlusCircle className="h-5 w-5" />
        {submitting ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  )
}
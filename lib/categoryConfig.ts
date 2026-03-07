import {
  Wallet, BriefcaseBusiness, Gift, MoreHorizontal,
  UtensilsCrossed, CarFront, Lightbulb, Popcorn, ShoppingCart,
} from "lucide-react"
import { Category } from "./types"

export const categoryIcons: Record<Category, typeof Wallet> = {
  Salary: Wallet,
  Freelance: BriefcaseBusiness,
  Gift: Gift,
  Other: MoreHorizontal,
  Food: UtensilsCrossed,
  Transport: CarFront,
  Utilities: Lightbulb,
  Entertainment: Popcorn,
  Shopping: ShoppingCart,
}

export const categoryColors: Record<Category, string> = {
  Salary: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  Freelance: "bg-teal-100 text-teal-900 dark:bg-teal-950/50 dark:text-teal-300",
  Gift: "bg-purple-100 text-purple-900 dark:bg-purple-950/50 dark:text-purple-300",
  Other: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300",
  Food: "bg-orange-100 text-orange-900 dark:bg-orange-950/50 dark:text-orange-300",
  Transport: "bg-blue-100 text-blue-900 dark:bg-blue-950/50 dark:text-blue-300",
  Utilities: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-300",
  Entertainment: "bg-pink-100 text-pink-900 dark:bg-pink-950/50 dark:text-pink-300",
  Shopping: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300",
}
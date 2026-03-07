import { Transaction, Category } from "@/lib/types";
import { format } from "date-fns";

interface Props { transactions: Transaction[]; }

const categoryColors: Record<Category, string> = {
  Salary: "bg-emerald-100 text-emerald-800",
  Freelance: "bg-teal-100 text-teal-800",
  Gift: "bg-purple-100 text-purple-800",
  Other: "bg-gray-100 text-gray-800",
  Food: "bg-orange-100 text-orange-800",
  Transport: "bg-blue-100 text-blue-800",
  Utilities: "bg-cyan-100 text-cyan-800",
  Entertainment: "bg-pink-100 text-pink-800",
  Shopping: "bg-indigo-100 text-indigo-800",
};

export default function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center text-gray-500">
        No transactions for this month yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {transactions.slice(0, 12).map(tx => (
          <div key={tx.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition">
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${categoryColors[tx.category]}`}>
                {tx.category}
              </div>
              <div>
                <p className="font-medium text-gray-900">{tx.description || "—"}</p>
                <p className="text-sm text-gray-500">{format(new Date(tx.date), "dd MMM yyyy")}</p>
              </div>
            </div>
            <p className={`font-semibold text-lg ${tx.amount > 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
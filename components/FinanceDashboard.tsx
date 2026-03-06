"use client"

import { Toaster } from 'sonner'
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react';
import { addMonths, format, subMonths } from 'date-fns';

export default function FinanceDashboard() {
    const [month, setMonth] = useState(new Date());
    
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


      </div>
    </div>
  )
}

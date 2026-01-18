"use client"

import { useState, useEffect } from "react"
import { Wallet, TrendingUp, Plus, ArrowUpRight } from "lucide-react"

interface FinanceCardProps {
    spending: number
    budget: number
}

export default function FinanceCard({ spending, budget }: FinanceCardProps) {
    const [displaySpending, setDisplaySpending] = useState(0)
    const percentUsed = (spending / budget) * 100

    useEffect(() => {
        let start = 0
        const increment = spending / 25
        const interval = setInterval(() => {
            start += increment
            if (start >= spending) {
                setDisplaySpending(spending)
                clearInterval(interval)
            } else {
                setDisplaySpending(start)
            }
        }, 16)
        return () => clearInterval(interval)
    }, [spending])

    const getStatusColor = (percent: number) => {
        if (percent > 80) return { bar: "from-red-500 to-orange-500", text: "text-red-400", label: "Over Budget" }
        if (percent > 60) return { bar: "from-yellow-500 to-orange-400", text: "text-yellow-400", label: "Watch Spending" }
        return { bar: "from-emerald-500 to-green-400", text: "text-emerald-400", label: "On Track" }
    }

    const status = getStatusColor(percentUsed)

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-emerald-500/10 p-6 hover:border-emerald-500/20 transition-all duration-300 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Finances</h3>
                    <p className="text-white/40 text-xs font-medium">Monthly Budget</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Wallet className="h-5 w-5 text-emerald-400" />
                </div>
            </div>

            {/* Today's Spending */}
            <div className="mb-6 pb-6 border-b border-white/5">
                <p className="text-white/40 text-sm mb-2">Today&apos;s Spending</p>
                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold text-white">
                        ${displaySpending.toFixed(2)}
                    </span>
                    <span className={`text-sm font-medium ${status.text}`}>
                        4 transactions
                    </span>
                </div>
            </div>

            {/* Budget Progress */}
            <div className="mb-6 flex-1">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-white/40 text-sm">Monthly Progress</p>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${status.text} bg-white/5`}>
                            {status.label}
                        </span>
                        <span className={`text-sm font-bold ${status.text}`}>
                            {percentUsed.toFixed(0)}%
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                        className={`h-2 rounded-full bg-gradient-to-r ${status.bar} transition-all duration-700`}
                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                </div>
                <p className="text-white/30 text-xs mt-2">
                    ${displaySpending.toFixed(2)} of ${budget.toFixed(2)}
                </p>
            </div>

            {/* Top Category */}
            <div className="mb-4 p-4 bg-white/[0.02] hover:bg-emerald-500/5 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/40 text-xs mb-1">Top Category</p>
                        <span className="text-white font-semibold">Food & Dining</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">$22.50</span>
                        <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-emerald-400 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 font-medium group">
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add Expense</span>
            </button>
        </div>
    )
}

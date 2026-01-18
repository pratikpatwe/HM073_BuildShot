"use client"

import { Flame, Trophy, AlertCircle, TrendingUp, Zap, Calendar } from "lucide-react"

interface HabitStatsProps {
    stats: {
        completedToday: number
        totalHabits: number
        bestStreak: number
        currentStreak: number
        missedDays: number
        bestHabit: string
        weakHabit: string
    }
}

export function HabitStats({ stats }: HabitStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Primary Streak Stats */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex flex-col justify-between">
                    <Flame className="w-6 h-6 text-emerald-500 mb-4" />
                    <div>
                        <span className="text-2xl font-bold text-white leading-none block">{stats.currentStreak} 🔥</span>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1 block">Current Streak</span>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex flex-col justify-between">
                    <Trophy className="w-6 h-6 text-blue-400 mb-4" />
                    <div>
                        <span className="text-2xl font-bold text-white leading-none block">{stats.bestStreak} 🏆</span>
                        <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1 block">Best Streak</span>
                    </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col justify-between">
                    <AlertCircle className="w-6 h-6 text-red-500 mb-4" />
                    <div>
                        <span className="text-2xl font-bold text-white leading-none block">{stats.missedDays} ❌</span>
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 block">Missed Days</span>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                    <Zap className="w-6 h-6 text-emerald-400 mb-4" />
                    <div>
                        <span className="text-2xl font-bold text-white leading-none block">{stats.completedToday}/{stats.totalHabits}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1 block">Daily Progress</span>
                    </div>
                </div>
            </div>

            {/* Insight Card */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                    <TrendingUp className="w-24 h-24" />
                </div>

                <div className="relative z-10">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        Weekly Insight
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Top Performer</span>
                            <span className="text-sm font-bold text-emerald-400">{stats.bestHabit}</span>
                        </div>
                        <div>
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-1">Needs Focus</span>
                            <span className="text-sm font-bold text-amber-400">{stats.weakHabit}</span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed italic border-t border-white/10 pt-4">
                            "You are 85% more likely to stick to {stats.bestHabit} when you complete it before noon."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

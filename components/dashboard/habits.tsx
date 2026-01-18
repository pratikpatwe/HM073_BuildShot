"use client"

import { useState } from "react"
import { Flame, Plus, Check, Sparkles } from "lucide-react"

interface Habit {
    id: number
    name: string
    completed: boolean
    streak: number
}

interface HabitCardProps {
    habits: Habit[]
}

export default function HabitCard({ habits }: HabitCardProps) {
    const [completedHabits, setCompletedHabits] = useState<Set<number>>(
        new Set(habits.filter(h => h.completed).map(h => h.id))
    )
    const [celebrateId, setCelebrateId] = useState<number | null>(null)

    const completedCount = completedHabits.size
    const totalCount = habits.length
    const completionPercent = (completedCount / totalCount) * 100

    const toggleHabit = (id: number) => {
        const newCompleted = new Set(completedHabits)
        if (newCompleted.has(id)) {
            newCompleted.delete(id)
        } else {
            newCompleted.add(id)
            setCelebrateId(id)
            setTimeout(() => setCelebrateId(null), 600)
        }
        setCompletedHabits(newCompleted)
    }

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-emerald-500/10 p-6 hover:border-emerald-500/20 transition-all duration-300 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Habits</h3>
                    <p className="text-white/40 text-xs font-medium">Daily Streaks</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Flame className="h-5 w-5 text-emerald-400" />
                </div>
            </div>

            {/* Progress Ring */}
            <div className="mb-6 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
                            <circle
                                cx="30"
                                cy="30"
                                r="25"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="4"
                            />
                            <circle
                                cx="30"
                                cy="30"
                                r="25"
                                fill="none"
                                stroke="#10b981"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${completionPercent * 1.57} 157`}
                                className="transition-all duration-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-emerald-400">{completedCount}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-white/40 text-xs">Completed Today</p>
                        <p className="text-white font-semibold">{completedCount} of {totalCount}</p>
                        {completedCount === totalCount && (
                            <div className="flex items-center gap-1 mt-1">
                                <Sparkles className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-medium">Perfect Day!</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Habit List */}
            <div className="space-y-2 mb-4 flex-1">
                {habits.map((habit) => {
                    const isCompleted = completedHabits.has(habit.id)
                    const isCelebrating = celebrateId === habit.id

                    return (
                        <button
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 relative overflow-hidden ${isCompleted
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-white/[0.02] border-white/5 hover:border-emerald-500/20"
                                }`}
                        >
                            {/* Celebration effect */}
                            {isCelebrating && (
                                <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
                            )}

                            {/* Checkbox */}
                            <div
                                className={`relative flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isCompleted
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "border-white/20 hover:border-emerald-500/50"
                                    }`}
                            >
                                {isCompleted && <Check className="h-3 w-3 text-black" strokeWidth={3} />}
                            </div>

                            {/* Habit name */}
                            <div className="flex-1 text-left">
                                <p className={`text-sm transition-all ${isCompleted ? "text-white/50 line-through" : "text-white font-medium"}`}>
                                    {habit.name}
                                </p>
                            </div>

                            {/* Streak */}
                            <div className={`flex items-center gap-1 text-xs ${isCompleted ? "text-emerald-400" : "text-white/30"}`}>
                                <Flame className={`h-3.5 w-3.5 ${isCompleted ? "text-emerald-400" : ""}`} />
                                <span className="font-bold">{habit.streak}</span>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* Action Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 font-medium group">
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                <span>Add New Habit</span>
            </button>
        </div>
    )
}

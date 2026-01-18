"use client"

import { useState, useEffect } from "react"
import { HabitCard, type Habit, type HabitStatus } from "@/components/habbits/HabitCard"
import { HabitCalendar } from "@/components/habbits/HabitCalendar"
import { CreateHabitModal } from "@/components/habbits/CreateHabitModal"
import { Sparkles, ArrowLeft, Clock, ChevronLeft, ChevronRight, TrendingUp, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const INITIAL_HABITS: Habit[] = [
    {
        id: "1",
        name: "Morning Meditation",
        type: "Daily",
        category: "Learning",
        streak: 12,
        bestStreak: 15,
        status: "none",
    },
    {
        id: "2",
        name: "Workout",
        type: "Daily",
        category: "Learning",
        streak: 5,
        bestStreak: 20,
        status: "done",
    },
    {
        id: "3",
        name: "Read 10 Pages",
        type: "Daily",
        category: "Health",
        streak: 30,
        bestStreak: 45,
        status: "none",
    },
]

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleAddHabit = (newHabit: any) => {
        setHabits([...habits, newHabit])
    }

    const handleStatusChange = (id: string, status: HabitStatus, note?: string) => {
        setHabits(habits.map(h =>
            h.id === id ? { ...h, status, note } : h
        ))
    }

    const stats = {
        completedToday: habits.filter(h => h.status === "done").length,
        totalHabits: habits.length,
        bestStreak: Math.max(...habits.map(h => h.bestStreak)),
        currentStreak: habits[0]?.streak || 0, // Mocking from first habit
        missedDays: 2,
        bestHabit: "Workout",
        weakHabit: "Reading",
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white p-4 md:p-8 pb-20 selection:bg-emerald-500/30">
            <div className="max-w-7xl mx-auto">
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em] mb-8 group">
                    <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Link>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tight mb-3">
                            Hey there, <span className="text-emerald-400">Pratik</span>
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
                            <Clock className="w-4 h-4" /> 5 hrs 42 mins till bedtime
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#161616] border border-white/5 rounded-full p-1.5 flex gap-1">
                            {['Week', 'Month', 'Year', 'All Time'].map((tab) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-xs font-bold transition-all truncate",
                                        tab === 'Week' ? "bg-white text-black shadow-[0_10px_20px_-5px_rgba(255,255,255,0.2)]" : "text-white/30 hover:text-white"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <CreateHabitModal onAddHabit={handleAddHabit} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Side: Progress & Heatmap */}
                    <div className="lg:col-span-8 space-y-16">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-2xl font-bold tracking-tight">Mon, 2/4 — Sun, 2/10</h2>
                                <button className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 bg-[#161616] border border-white/5 rounded-xl p-1.5 shadow-inner">
                                <button className="p-2.5 rounded-lg bg-white/5 text-white"><LayoutGrid className="w-4.5 h-4.5" /></button>
                                <button className="p-2.5 rounded-lg text-white/20 hover:text-white transition-colors"><List className="w-4.5 h-4.5" /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-emerald-500 rounded-full w-[31%] shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"></div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold uppercase tracking-widest">
                                    <TrendingUp className="w-3.5 h-3.5" /> Up 23% from week before
                                </div>
                                <div className="text-[11px] text-white/20 font-bold uppercase tracking-widest">
                                    27% achieved
                                </div>
                            </div>
                        </div>

                        <HabitCalendar />
                    </div>

                    {/* Right Side: Today's Checklist */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight">Mon, Feb 18</h2>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors"><ChevronLeft className="w-4.5 h-4.5" /></button>
                                    <button className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors"><ChevronRight className="w-4.5 h-4.5" /></button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner font-bold">
                                    <div className="h-full bg-emerald-500 rounded-full w-[33%] shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
                                </div>
                                <p className="text-[11px] text-white/20 font-bold text-right uppercase tracking-[0.2em]">
                                    33% of daily goal achieved
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onStatusChange={handleStatusChange}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

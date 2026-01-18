"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HabitCard, type Habit, type HabitStatus } from "@/components/habits/HabitCard"
import { HabitCalendar } from "@/components/habits/HabitCalendar"
import { CreateHabitModal } from "@/components/habits/CreateHabitModal"
import { Sparkles, Clock, ChevronLeft, ChevronRight, TrendingUp, LayoutGrid, List, Target, Settings2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const INITIAL_HABITS: Habit[] = [
    {
        id: "1",
        name: "Morning Meditation",
        type: "Daily",
        category: "Mind",
        streak: 12,
        bestStreak: 15,
        status: "none",
        iconName: "Brain"
    },
    {
        id: "2",
        name: "Professional Development",
        type: "Daily",
        category: "Learning",
        streak: 5,
        bestStreak: 20,
        status: "done",
        iconName: "Target"
    },
    {
        id: "3",
        name: "Gym Session",
        type: "Daily",
        category: "Health",
        streak: 30,
        bestStreak: 45,
        status: "none",
        iconName: "Dumbbell"
    },
]

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)
    const [mounted, setMounted] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [bedtime, setBedtime] = useState("23:00") // Default to 11 PM
    const [timeLeft, setTimeLeft] = useState("")

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const [hours, minutes] = bedtime.split(':').map(Number)
            const target = new Date()
            target.setHours(hours, minutes, 0, 0)

            if (target < now) {
                target.setDate(target.getDate() + 1)
            }

            const diff = target.getTime() - now.getTime()
            const h = Math.floor(diff / (1000 * 60 * 60))
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            setTimeLeft(`${h} hrs ${m} mins`)
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 60000)
        return () => clearInterval(timer)
    }, [bedtime])

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
        bestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak)) : 0,
        currentStreak: habits.length > 0 ? habits[0].streak : 0,
        missedDays: 2,
        bestHabit: habits.sort((a, b) => b.streak - a.streak)[0]?.name || "None",
        weakHabit: habits.sort((a, b) => a.streak - b.streak)[0]?.name || "None",
    }

    const todayProgress = habits.length > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="relative w-16 h-16 shrink-0 lg:w-20 lg:h-20">
                            <Image
                                src="/kairos-logo.svg"
                                alt="Kairos Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white uppercase tracking-wider">
                                Habits Tracker
                            </h1>
                            <div className="flex items-center gap-3 text-zinc-400 mt-2 text-lg font-light">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-emerald-500/50" /> {timeLeft} till bedtime
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 group">
                                            <Settings2 className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                                            Manage
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 bg-[#0B0B0B] border-white/5 rounded-2xl p-6 shadow-2xl">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Set Bedtime</label>
                                                <input
                                                    type="time"
                                                    value={bedtime}
                                                    onChange={(e) => setBedtime(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/5 rounded-xl h-12 px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all font-bold [color-scheme:dark]"
                                                />
                                            </div>
                                            <p className="text-[10px] text-zinc-600 leading-relaxed">Setting a consistent bedtime helps your circadian rhythm and improves habit consistency.</p>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-[#161616] border border-white/5 rounded-full p-1.5 flex gap-1">
                            {['Week', 'Month', 'Year', 'All Time'].map((tab) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-xs font-bold transition-all truncate cursor-pointer",
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
                                <button className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-2xl font-bold tracking-tight">Mon, 2/4 — Sun, 2/10</h2>
                                <button className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-1 bg-[#161616] border border-white/5 rounded-xl p-1.5 shadow-inner">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={cn(
                                        "p-2.5 rounded-lg transition-all cursor-pointer",
                                        viewMode === 'grid' ? "bg-white/5 text-white" : "text-white/20 hover:text-white"
                                    )}
                                >
                                    <LayoutGrid className="w-4.5 h-4.5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={cn(
                                        "p-2.5 rounded-lg transition-all cursor-pointer",
                                        viewMode === 'list' ? "bg-white/5 text-white" : "text-white/20 hover:text-white"
                                    )}
                                >
                                    <List className="w-4.5 h-4.5" />
                                </button>
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

                        {viewMode === 'grid' ? (
                            <HabitCalendar habits={habits} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {habits.map((habit) => (
                                    <div key={habit.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform">
                                                    <Target className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white text-lg tracking-tight">{habit.name}</h3>
                                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{habit.category}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-2xl font-black text-white/90 tracking-tighter">{habit.streak}d</div>
                                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Streak</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-zinc-500 uppercase tracking-widest">Monthly Consistency</span>
                                                <span className="text-emerald-500">84%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full w-[84%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Best Streak</div>
                                                    <div className="text-sm font-bold text-white/80">{habit.bestStreak} Days</div>
                                                </div>
                                                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Frequency</div>
                                                    <div className="text-sm font-bold text-white/80">{habit.type}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side: Today's Checklist */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold tracking-tight">Mon, Feb 18</h2>
                                <div className="flex gap-2">
                                    <button className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors cursor-pointer"><ChevronLeft className="w-4.5 h-4.5" /></button>
                                    <button className="w-9 h-9 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors cursor-pointer"><ChevronRight className="w-4.5 h-4.5" /></button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden shadow-inner font-bold">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-700"
                                        style={{ width: `${todayProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-[11px] text-white/20 font-bold text-right uppercase tracking-[0.2em]">
                                    {Math.round(todayProgress)}% of daily goal achieved
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

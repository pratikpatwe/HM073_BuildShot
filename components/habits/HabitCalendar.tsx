import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Book, Dumbbell, Flower2, Leaf, Wine, PenTool, Target, Circle, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, User } from "lucide-react"
import { Habit } from "./HabitCard"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface HabitCalendarProps {
    habits: Habit[]
}

export function HabitCalendar({ habits }: HabitCalendarProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const categoryStyles: Record<string, string> = {
        Health: "bg-[#FF9F0A]",
        Learning: "bg-[#945FF4]",
        Finance: "bg-[#30D5C8]",
        Mind: "bg-[#34C759]",
        Other: "bg-[#E4E4E7]",
    }

    const iconMap: Record<string, any> = {
        Target, Circle, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, Book, Dumbbell, Flower2, PenTool, Wine, Leaf, User
    }

    if (!mounted) return null

    return (
        <div className="bg-transparent overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[700px]">
                {/* Day Headers */}
                <div className="grid grid-cols-[200px_repeat(7,1fr)_80px] gap-3 mb-10 items-center border-b border-white/5 pb-6">
                    <div className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] pl-4">Habit</div>
                    {DAYS.map(day => (
                        <div key={day} className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] text-center">
                            {day}
                        </div>
                    ))}
                    <div className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] text-right pr-4">Stats</div>
                </div>

                {/* Habit Rows */}
                <div className="space-y-8">
                    {habits.map((habit) => {
                        const style = categoryStyles[habit.category] || categoryStyles.Other
                        const Icon = habit.iconName ? (iconMap[habit.iconName] || Target) : Target

                        // Get current day index (0 for Sun, 1 for Mon, etc.)
                        const todayIndex = new Date().getDay()
                        // Map 0 (Sun) to index 6, 1 (Mon) to 0, 2 (Tue) to 1...
                        const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1

                        // Create blank week and fill only today if done
                        const points = Array(7).fill(0).map((_, idx) =>
                            idx === adjustedTodayIndex && habit.status === "done" ? 1 : 0
                        )

                        return (
                            <div key={habit.id} className="grid grid-cols-[200px_repeat(7,1fr)_80px] gap-3 items-center group">
                                <div className="flex items-center gap-4 pl-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors",
                                        style.replace('bg-', 'text-')
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[14px] font-bold text-white/60 group-hover:text-white transition-all duration-300 truncate tracking-tight">{habit.name}</span>
                                </div>

                                {points.map((point, idx) => (
                                    <div key={idx} className="flex justify-center">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl transition-all duration-500 hover:scale-110 cursor-pointer border",
                                            point === 1
                                                ? cn(style, "shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] border-white/10")
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                        )} />
                                    </div>
                                ))}

                                <div className="text-[11px] text-white/40 font-bold text-right tabular-nums tracking-widest pr-4">
                                    {points.filter(p => p === 1).length}/7
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

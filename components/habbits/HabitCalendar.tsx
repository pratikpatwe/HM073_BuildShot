"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Book, Dumbbell, Flower2, Leaf, Wine, PenTool } from "lucide-react"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function HabitCalendar() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const habits = [
        { name: "Read", color: "bg-[#FF9F0A]", text: "text-[#FF9F0A]", icon: Book, completions: "5/6", points: [1, 0, 1, 1, 0, 1, 1] },
        { name: "Workout", color: "bg-[#945FF4]", text: "text-[#945FF4]", icon: Dumbbell, completions: "4/6", points: [1, 1, 0, 0, 0, 1, 1] },
        { name: "Meditate", color: "bg-[#30D5C8]", text: "text-[#30D5C8]", icon: Flower2, completions: "7/7", points: [1, 1, 1, 1, 1, 1, 1] },
        { name: "Journal", color: "bg-[#FF3B30]", text: "text-[#FF3B30]", icon: PenTool, completions: "5/5", points: [1, 1, 1, 1, 1, 0, 1] },
        { name: "Alcohol", color: "bg-[#007AFF]", text: "text-[#007AFF]", icon: Wine, completions: "5/7", points: [1, 1, 1, 0, 0, 1, 1] },
        { name: "Weed", color: "bg-[#34C759]", text: "text-[#34C759]", icon: Leaf, completions: "2/5", points: [0, 0, 0, 0, 1, 1, 0] },
    ]

    if (!mounted) return null

    return (
        <div className="bg-transparent overflow-x-auto pb-4 custom-scrollbar">
            <div className="min-w-[700px]">
                {/* Day Headers */}
                <div className="grid grid-cols-[160px_repeat(7,1fr)_60px] gap-3 mb-10 items-center border-b border-white/5 pb-6">
                    <div />
                    {DAYS.map(day => (
                        <div key={day} className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] text-center">
                            {day}
                        </div>
                    ))}
                    <div />
                </div>

                {/* Habit Rows */}
                <div className="space-y-10">
                    {habits.map((habit) => {
                        const Icon = (habit as any).icon
                        return (
                            <div key={habit.name} className="grid grid-cols-[160px_repeat(7,1fr)_60px] gap-3 items-center group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors",
                                        habit.text
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[15px] font-bold text-white/60 group-hover:text-white transition-all duration-300 truncate tracking-tight">{habit.name}</span>
                                </div>

                                {habit.points.map((point, idx) => (
                                    <div key={idx} className="flex justify-center">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl transition-all duration-500 hover:scale-110 cursor-pointer",
                                            point === 1
                                                ? cn(habit.color, "shadow-[0_0_25px_-5px_rgba(0,0,0,0.4)] ring-1 ring-white/10")
                                                : "bg-[#161616] border border-white/[0.03] hover:bg-white/10 hover:border-white/10"
                                        )} />
                                    </div>
                                ))}

                                <div className="text-[11px] text-white/20 font-bold text-right tabular-nums tracking-widest">
                                    {habit.completions}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

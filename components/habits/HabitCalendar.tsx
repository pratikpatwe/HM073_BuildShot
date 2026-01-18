import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Book, Dumbbell, Flower2, Leaf, Wine, PenTool, Target, Circle, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, User } from "lucide-react"
import { Habit } from "./HabitCard"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

interface HabitCalendarProps {
    habits: Habit[]
    weekStart: Date
}

export function HabitCalendar({ habits, weekStart }: HabitCalendarProps) {
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
                    {DAYS.map((day, idx) => (
                        <div key={`${day}-${idx}`} className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] text-center">
                            {day}
                        </div>
                    ))}
                    <div className="text-[11px] text-white/20 font-bold uppercase tracking-[0.25em] text-right pr-4">Stats</div>
                </div>

                <div className="space-y-8">
                    {habits.filter(h => h.id && (!h.isDeleted || (h.weeklyLogs && h.weeklyLogs.length > 0))).map((habit, habitIdx) => {
                        const Icon = habit.iconName ? (iconMap[habit.iconName] || Target) : Target
                        const habitColor = habit.color || "#FF9F0A"

                        // Use the passed weekStart
                        const startOfWeek = new Date(weekStart);
                        startOfWeek.setHours(0, 0, 0, 0);

                        const points = Array(7).fill(0).map((_, idx) => {
                            const date = new Date(startOfWeek);
                            date.setDate(startOfWeek.getDate() + idx);

                            // Check if this date is in our logs
                            const logEntry = habit.weeklyLogs?.find(l => {
                                const logDate = new Date(l.date);
                                return logDate.toLocaleDateString() === date.toLocaleDateString();
                            });

                            const dayId = idx === 6 ? 0 : idx + 1;
                            const isSelectedDay = habit.type === 'Custom' && habit.customDays
                                ? habit.customDays.includes(dayId)
                                : true;

                            const isDone = logEntry?.status === 'done';
                            return isSelectedDay && isDone ? 1 : 0;
                        })

                        return (
                            <div key={habit.id || habitIdx} className="grid grid-cols-[200px_repeat(7,1fr)_80px] gap-3 items-center group">
                                <div className="flex items-center gap-4 pl-4">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors flex-shrink-0"
                                        style={{ color: habitColor }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span
                                        className="text-[14px] font-bold text-white/60 group-hover:text-white transition-all duration-300 truncate tracking-tight overflow-hidden text-ellipsis whitespace-nowrap block"
                                        title={habit.name}
                                    >
                                        {habit.name}
                                    </span>
                                </div>

                                {points.map((point, idx) => {
                                    // Mapping idx 0-6 (Mon-Sun) to habit IDs (1-6, 0)
                                    const dayId = idx === 6 ? 0 : idx + 1;
                                    const isScheduled = habit.type === 'Custom' && habit.customDays
                                        ? habit.customDays.includes(dayId)
                                        : true;

                                    return (
                                        <div key={idx} className="flex justify-center">
                                            <div
                                                className={cn(
                                                    "w-9 h-9 rounded-xl transition-all duration-500 hover:scale-110 border",
                                                    point === 1
                                                        ? "shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] border-white/10"
                                                        : isScheduled
                                                            ? "bg-white/[0.05] border-white/10 hover:bg-white/10 hover:border-white/20"
                                                            : "bg-white/[0.02] border-dashed border-white/10 opacity-40 pointer-events-none"
                                                )}
                                                style={{
                                                    backgroundColor: point === 1 ? habitColor : undefined
                                                }}
                                            />
                                        </div>
                                    )
                                })}

                                <div className="text-[11px] text-white/40 font-bold text-right tabular-nums tracking-widest pr-4">
                                    {points.filter(p => p === 1).length}/
                                    {habit.type === 'Custom' && habit.customDays ? habit.customDays.length : 7}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

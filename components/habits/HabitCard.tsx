"use client"

import { Check, MoreVertical, Undo2, Book, Dumbbell, Flower2, PenTool, Wine, Leaf, Target, Circle, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, User, Trash2, Settings, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export type HabitStatus = "done" | "skipped" | "none"

export interface Habit {
    id: string
    name: string
    type: "Daily" | "Weekly" | "Custom"
    category: string
    reminderTime?: string
    streak: number
    bestStreak: number
    status: HabitStatus
    note?: string
    iconName?: string
    customDays?: number[]
    color?: string
    weeklyLogs?: { date: string | Date, status: HabitStatus }[]
}

interface HabitCardProps {
    habit: Habit
    onStatusChange: (id: string, status: HabitStatus, note?: string) => void
    onDelete: (id: string) => void
    onUpdateFrequency: (habit: Habit) => void
}

export function HabitCard({ habit, onStatusChange, onDelete, onUpdateFrequency }: HabitCardProps) {
    const isDone = habit.status === "done"

    // Check if the habit can be marked today
    const canMarkToday = useMemo(() => {
        if (habit.type !== "Custom" || !habit.customDays) return true
        const today = new Date().getDay()
        // JS getDay() 0=Sun, 1=Mon... matching CreateHabitModal
        return habit.customDays.includes(today)
    }, [habit.type, habit.customDays])

    const getFrequencyText = () => {
        if (habit.type !== 'Custom' || !habit.customDays || habit.customDays.length === 0) return habit.type;
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const scheduled = habit.customDays.map(d => days[d]).join(", ");
        return `Custom (${scheduled})`;
    }

    const categoryStyles: Record<string, { border: string, bg: string, text: string, gradient: string, icon: any }> = {
        Health: { border: "border-[#FF9F0A]", bg: "bg-[#FF9F0A]/10", text: "text-[#FF9F0A]", gradient: "from-[#FF9F0A] to-[#FFB340]", icon: Book },
        Learning: { border: "border-[#945FF4]", bg: "bg-[#945FF4]/10", text: "text-[#945FF4]", gradient: "from-[#945FF4] to-[#B085FF]", icon: Dumbbell },
        Finance: { border: "border-[#30D5C8]", bg: "bg-[#30D5C8]/10", text: "text-[#30D5C8]", gradient: "from-[#30D5C8] to-[#5EEAD4]", icon: Flower2 },
        Mind: { border: "border-[#34C759]", bg: "bg-[#34C759]/10", text: "text-[#34C759]", gradient: "from-[#34C759] to-[#60E080]", icon: Leaf },
        Other: { border: "border-[#E4E4E7]", bg: "bg-[#E4E4E7]/10", text: "text-[#E4E4E7]", gradient: "from-[#71717A] to-[#A1A1AA]", icon: Target },
    }

    const iconMap: Record<string, any> = {
        Target, Circle, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, Book, Dumbbell, Flower2, PenTool, Wine, Leaf, User
    }

    const baseStyle = categoryStyles[habit.category] || categoryStyles.Other
    const Icon = habit.iconName ? (iconMap[habit.iconName] || baseStyle.icon) : baseStyle.icon

    // Custom style based on habit.color
    const habitColor = habit.color || "#FF9F0A"
    const style = {
        border: `border-[${habitColor}]`,
        bg: `bg-[${habitColor}]/10`,
        text: `text-[${habitColor}]`,
        gradient: `from-[${habitColor}] to-[${habitColor}]`,
        icon: Icon
    }

    return (
        <div
            className={cn(
                "group relative border-l-4 rounded-xl transition-all duration-500 overflow-hidden",
                isDone
                    ? "text-white border-transparent shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] scale-[1.02]"
                    : "bg-[#161616] border-white/5 hover:bg-[#1C1C1C] hover:border-white/10"
            )}
            style={{
                borderLeftColor: !isDone ? habitColor : 'transparent',
                background: isDone ? `linear-gradient(135deg, ${habitColor}, ${habitColor}dd)` : undefined
            }}
        >
            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                isDone ? "bg-white/20" : "bg-white/5"
                            )}
                            style={{ color: !isDone ? habitColor : 'white' }}
                        >
                            <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className={cn(
                                "text-base font-bold transition-all tracking-tight line-clamp-2",
                                isDone ? "text-white" : "text-white/90"
                            )}>
                                {habit.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className={cn("text-[9px] font-bold uppercase tracking-[0.2em]", isDone ? "text-white/60" : "text-zinc-500")}>
                                    {habit.category}
                                </span>
                                <span className={cn("text-[8px] font-bold", isDone ? "text-white/30" : "text-zinc-700")}>•</span>
                                <span
                                    className={cn("text-[8px] font-bold uppercase tracking-widest", isDone ? "text-white/80" : "opacity-80")}
                                    style={{ color: !isDone ? habitColor : 'white' }}
                                >
                                    {getFrequencyText()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn(
                                "p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer",
                                isDone ? "text-white/50" : "text-white/20"
                            )}>
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-[#161616] border-white/5 text-white/90">
                            <DropdownMenuItem
                                onClick={() => onUpdateFrequency(habit)}
                                className="gap-2 cursor-pointer focus:bg-white/5 focus:text-white"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Update Frequency</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem
                                onClick={() => onDelete(habit.id)}
                                className="gap-2 cursor-pointer focus:bg-red-500/10 focus:text-red-500 text-red-500/70"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Habit</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {isDone ? (
                    <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2 text-[13px] font-bold">
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                <Check className="w-3 h-3 text-black stroke-[4px]" />
                            </div>
                            Completed
                        </div>
                        <button
                            onClick={() => onStatusChange(habit.id, "none")}
                            className="text-[11px] font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1 rounded-full border border-white/10 cursor-pointer"
                        >
                            <Undo2 className="w-3.5 h-3.5" /> Undo
                        </button>
                    </div>
                ) : (
                    <Button
                        disabled={!canMarkToday}
                        onClick={() => onStatusChange(habit.id, "done")}
                        className={cn(
                            "w-full h-11 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all active:scale-[0.98]",
                            canMarkToday
                                ? "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:border-white/20"
                                : "bg-white/5 border-dashed border-white/5 text-white/20 cursor-not-allowed"
                        )}
                    >
                        {canMarkToday ? "Mark Complete" : "Not Today"}
                    </Button>
                )}
            </div>
        </div>
    )
}

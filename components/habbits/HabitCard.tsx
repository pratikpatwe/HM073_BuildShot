"use client"

import { Check, MoreVertical, Undo2, Book, Dumbbell, Flower2, PenTool, Wine, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export type HabitStatus = "done" | "skipped" | "none"

export interface Habit {
    id: string
    name: string
    type: "Daily" | "Weekly"
    category: string
    reminderTime?: string
    streak: number
    bestStreak: number
    status: HabitStatus
    note?: string
}

interface HabitCardProps {
    habit: Habit
    onStatusChange: (id: string, status: HabitStatus, note?: string) => void
}

export function HabitCard({ habit, onStatusChange }: HabitCardProps) {
    const isDone = habit.status === "done"

    const categoryStyles: Record<string, { border: string, bg: string, text: string, gradient: string, icon: any }> = {
        Health: { border: "border-[#FF9F0A]", bg: "bg-[#FF9F0A]/10", text: "text-[#FF9F0A]", gradient: "from-[#FF9F0A] to-[#FFB340]", icon: Book },
        Learning: { border: "border-[#945FF4]", bg: "bg-[#945FF4]/10", text: "text-[#945FF4]", gradient: "from-[#945FF4] to-[#B085FF]", icon: Dumbbell },
        Finance: { border: "border-[#30D5C8]", bg: "bg-[#30D5C8]/10", text: "text-[#30D5C8]", gradient: "from-[#30D5C8] to-[#5EEAD4]", icon: Flower2 },
        Mind: { border: "border-[#34C759]", bg: "bg-[#34C759]/10", text: "text-[#34C759]", gradient: "from-[#34C759] to-[#60E080]", icon: Leaf },
    }

    const style = categoryStyles[habit.category] || categoryStyles.Mind
    const Icon = style.icon

    return (
        <div
            className={cn(
                "group relative border-l-4 rounded-xl transition-all duration-500 overflow-hidden",
                isDone
                    ? cn("bg-gradient-to-br text-white border-transparent shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] scale-[1.02]", style.gradient)
                    : "bg-[#161616] border-white/5 hover:bg-[#1C1C1C] hover:border-white/10"
            )}
            style={!isDone ? { borderLeftColor: style.border.replace('border-[', '').replace(']', '') } : {}}
        >
            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            isDone ? "bg-white/20" : "bg-white/5"
                        )}>
                            <Icon className={cn("w-4 h-4", isDone ? "text-white" : style.text)} />
                        </div>
                        <h3 className={cn(
                            "text-base font-bold transition-all tracking-tight",
                            isDone ? "text-white" : "text-white/90"
                        )}>
                            {habit.name}
                        </h3>
                    </div>
                    <button className={cn(
                        "p-1.5 rounded-lg hover:bg-white/10 transition-colors",
                        isDone ? "text-white/50" : "text-white/20"
                    )}>
                        <MoreVertical className="w-4 h-4" />
                    </button>
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
                            className="text-[11px] font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1 rounded-full border border-white/10"
                        >
                            <Undo2 className="w-3.5 h-3.5" /> Undo
                        </button>
                    </div>
                ) : (
                    <Button
                        onClick={() => onStatusChange(habit.id, "done")}
                        className="w-full h-11 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-black/60 hover:border-white/20 transition-all active:scale-[0.98]"
                    >
                        Mark Complete
                    </Button>
                )}
            </div>
        </div>
    )
}

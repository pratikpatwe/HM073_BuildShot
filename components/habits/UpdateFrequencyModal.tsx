"use client"

import { useState, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Habit } from "./HabitCard"

interface UpdateFrequencyModalProps {
    habit: Habit | null
    isOpen: boolean
    onClose: () => void
    onUpdate: (id: string, updates: any) => void
}

export function UpdateFrequencyModal({ habit, isOpen, onClose, onUpdate }: UpdateFrequencyModalProps) {
    const [type, setType] = useState(habit?.type || "Daily")
    const [selectedDays, setSelectedDays] = useState<number[]>(habit?.customDays || [])

    useEffect(() => {
        if (habit) {
            setType(habit.type)
            setSelectedDays(habit.customDays || [])
        }
    }, [habit])

    const WEEKDAYS = [
        { id: 1, label: "M" },
        { id: 2, label: "T" },
        { id: 3, label: "W" },
        { id: 4, label: "T" },
        { id: 5, label: "F" },
        { id: 6, label: "S" },
        { id: 0, label: "S" },
    ]

    const toggleDay = (dayId: number) => {
        if (selectedDays.includes(dayId)) {
            if (selectedDays.length > 1) {
                setSelectedDays(selectedDays.filter(d => d !== dayId))
            }
        } else {
            setSelectedDays([...selectedDays, dayId])
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!habit) return
        onUpdate(habit.id, {
            type,
            customDays: type === "Custom" ? selectedDays : null
        })
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="bg-[#0B0B0B] border border-white/5 rounded-[32px] sm:max-w-[440px] overflow-hidden p-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-white/5 to-white/5"></div>

                <div className="p-8">
                    <DialogHeader className="mb-8 text-left">
                        <DialogTitle className="text-3xl font-bold text-white uppercase tracking-tight">Update Frequency</DialogTitle>
                        <p className="text-zinc-500 text-sm mt-1">Change how often you track "{habit?.name}"</p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Frequency</label>
                            <div className="relative">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value as any)}
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm appearance-none cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                                >
                                    <option value="Daily" className="bg-[#0B0B0B]">Daily</option>
                                    <option value="Weekly" className="bg-[#0B0B0B]">Weekly</option>
                                    <option value="Custom" className="bg-[#0B0B0B]">Custom</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>

                        {type === "Custom" && (
                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Repeat on</label>
                                <div className="flex justify-between gap-2">
                                    {WEEKDAYS.map((day) => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => toggleDay(day.id)}
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer border",
                                                selectedDays.includes(day.id)
                                                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                                    : "bg-white/[0.03] text-zinc-500 border-white/5 hover:border-white/20 hover:text-white"
                                            )}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 h-14 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-widest text-[11px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold transition-all shadow-xl shadow-white/5 cursor-pointer uppercase tracking-widest text-[11px]"
                            >
                                Update
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

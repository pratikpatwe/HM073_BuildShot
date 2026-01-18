"use client"

import { useState } from "react"
import { Plus, X, Calendar, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface CreateHabitModalProps {
    onAddHabit: (habit: any) => void
}

export function CreateHabitModal({ onAddHabit }: CreateHabitModalProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [type, setType] = useState("Daily")
    const [category, setCategory] = useState("Health")
    const [time, setTime] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        onAddHabit({
            id: Math.random().toString(36).substr(2, 9),
            name,
            type,
            category,
            reminderTime: time,
            streak: 0,
            bestStreak: 0,
            status: "none",
        })

        // Reset form
        setName("")
        setTime("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold h-12 px-6 hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 group">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Create Habit
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B0B0B] border border-white/10 rounded-3xl sm:max-w-[425px] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>

                <DialogHeader className="pt-4">
                    <DialogTitle className="text-2xl font-bold text-white uppercase tracking-tight">Create Habit</DialogTitle>
                    <p className="text-sm text-white/40">Set up a new routine in seconds.</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest pl-1">Habit Name</Label>
                        <div className="relative">
                            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Morning Meditation"
                                className="bg-white/5 border-white/10 rounded-xl h-12 pl-12 text-white placeholder:text-white/20 focus:border-emerald-500/30"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest pl-1">Frequency</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-emerald-500/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#141414] border-white/10 text-white">
                                    <SelectItem value="Daily">Daily</SelectItem>
                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest pl-1">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-white/5 border-white/10 rounded-xl h-12 text-white focus:ring-emerald-500/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#141414] border-white/10 text-white">
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Learning">Learning</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Mind">Mind</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-emerald-500 tracking-widest pl-1">Reminder Time (Optional)</Label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="bg-white/5 border-white/10 rounded-xl h-12 pl-12 text-white focus:border-emerald-500/30 block w-full"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <DialogClose asChild>
                            <Button variant="outline" type="button" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold">
                            Start Habit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

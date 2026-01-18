"use client"

import { useState } from "react"
import {
    Plus,
    X,
    Calendar,
    Clock,
    Tag,
    Sparkles,
    Target,
    Heart,
    Circle,
    Brain,
    Coffee,
    Music,
    Moon,
    Sun,
    Star,
    Zap,
    Trophy,
    User,
    ChevronDown,
    Book,
    Dumbbell,
    Flower2,
    PenTool,
    Wine,
    Leaf
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
// Basic label component removed to use standard label for better precision

interface CreateHabitModalProps {
    onAddHabit: (habit: any) => void
}

export function CreateHabitModal({ onAddHabit }: CreateHabitModalProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [type, setType] = useState("Daily")
    const [category, setCategory] = useState("Health")
    const [iconName, setIconName] = useState("Target")
    const [selectedDays, setSelectedDays] = useState<number[]>([new Date().getDay() === 0 ? 0 : new Date().getDay()])

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

    const icons = [
        { name: "Target", icon: Target },
        { name: "Heart", icon: Heart },
        { name: "Sparkles", icon: Sparkles },
        { name: "Brain", icon: Brain },
        { name: "Coffee", icon: Coffee },
        { name: "Music", icon: Music },
        { name: "Moon", icon: Moon },
        { name: "Sun", icon: Sun },
        { name: "Star", icon: Star },
        { name: "Zap", icon: Zap },
        { name: "Trophy", icon: Trophy },
        { name: "User", icon: User },
        { name: "Book", icon: Book },
        { name: "Dumbbell", icon: Dumbbell },
        { name: "Flower2", icon: Flower2 },
        { name: "PenTool", icon: PenTool },
        { name: "Wine", icon: Wine },
        { name: "Leaf", icon: Leaf },
        { name: "Circle", icon: Circle },
    ]

    const SelectedIcon = icons.find(i => i.name === iconName)?.icon || Target

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        onAddHabit({
            id: Math.random().toString(36).substr(2, 9),
            name,
            type: type === "Custom" ? `Custom (${selectedDays.length} days)` : type,
            category,
            streak: 0,
            bestStreak: 0,
            status: "none",
            iconName,
            customDays: type === "Custom" ? selectedDays : null,
        })

        // Reset form
        setName("")
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold h-12 px-6 hover:brightness-110 transition-all shadow-lg shadow-emerald-500/20 group cursor-pointer">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Habit
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B0B0B] border border-white/5 rounded-[32px] sm:max-w-[440px] overflow-hidden p-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-white/5 to-white/5"></div>

                <div className="p-8">
                    <DialogHeader className="mb-8 text-left">
                        <DialogTitle className="text-3xl font-bold text-white uppercase tracking-tight">Create Habit</DialogTitle>
                        <p className="text-zinc-500 text-sm mt-1">Set up a new routine in seconds.</p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Habit Name</label>
                            <div className="relative group flex items-center">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className="absolute left-3 p-2 rounded-xl bg-white/[0.05] border border-white/5 text-zinc-400 hover:text-emerald-500 hover:bg-white/[0.08] transition-all cursor-pointer z-10 flex items-center gap-1"
                                        >
                                            <SelectedIcon className="w-4 h-4" />
                                            <ChevronDown className="w-3 h-3 opacity-50" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 bg-[#0B0B0B] border-white/5 rounded-2xl p-3 shadow-2xl z-[100]">
                                        <div className="grid grid-cols-4 gap-2">
                                            {icons.map((item) => (
                                                <button
                                                    key={item.name}
                                                    type="button"
                                                    onClick={() => setIconName(item.name)}
                                                    className={`p-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${iconName === item.name
                                                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                        : "text-zinc-500 hover:bg-white/5 hover:text-white border border-transparent"
                                                        }`}
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Morning Meditation"
                                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 pl-20 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Frequency</label>
                                <div className="relative">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm appearance-none cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                                    >
                                        <option value="Daily" className="bg-[#0B0B0B]">Daily</option>
                                        <option value="Weekly" className="bg-[#0B0B0B]">Weekly</option>
                                        <option value="Custom" className="bg-[#0B0B0B]">Custom</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Category</label>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl h-14 px-4 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm appearance-none cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                                    >
                                        <option value="Health" className="bg-[#0B0B0B]">Health</option>
                                        <option value="Learning" className="bg-[#0B0B0B]">Learning</option>
                                        <option value="Finance" className="bg-[#0B0B0B]">Finance</option>
                                        <option value="Mind" className="bg-[#0B0B0B]">Mind</option>
                                        <option value="Other" className="bg-[#0B0B0B]">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                </div>
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
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="flex-1 h-14 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold uppercase tracking-widest text-[11px]"
                                >
                                    Cancel
                                </button>
                            </DialogClose>
                            <button
                                type="submit"
                                className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold transition-all shadow-xl shadow-white/5 cursor-pointer uppercase tracking-widest text-[11px]"
                            >
                                Start Habit
                            </button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { HabitCard, type Habit, type HabitStatus } from "@/components/habits/HabitCard"
import { HabitCalendar } from "@/components/habits/HabitCalendar"
import { CreateHabitModal } from "@/components/habits/CreateHabitModal"
import { UpdateFrequencyModal } from "@/components/habits/UpdateFrequencyModal"
import {
    Sparkles, Clock, ChevronLeft, ChevronRight, TrendingUp, LayoutGrid, List, Target, Settings2,
    Book, Dumbbell, Flower2, Leaf, Wine, PenTool, Circle, Heart, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, User,
    MoreVertical, Trash2, Settings
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { HabitStatsGraph } from "@/components/habits/HabitStatsGraph"
import { toast } from "sonner"

export default function HabitsPage() {
    const [habits, setHabits] = useState<Habit[]>([])
    const activeRange = 'Week'
    const [mounted, setMounted] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [bedtime, setBedtime] = useState("23:00") // Default to 11 PM
    const [timeLeft, setTimeLeft] = useState("")
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    const [selectedWeekStart, setSelectedWeekStart] = useState(getMonday(new Date()))

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
        fetchHabits()
        fetchBedtime()
        setMounted(true)
    }, [selectedWeekStart])

    const fetchHabits = async () => {
        try {
            const weekEnd = new Date(selectedWeekStart);
            weekEnd.setDate(selectedWeekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const res = await fetch(`/api/habits?weekStart=${selectedWeekStart.toISOString()}&weekEnd=${weekEnd.toISOString()}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setHabits(data)
        } catch (error) {
            toast.error("Failed to load habits")
        } finally {
            setLoading(false);
        }
    }

    const fetchBedtime = async () => {
        try {
            const res = await fetch('/api/user/settings')
            const data = await res.json()
            if (data.bedtime) setBedtime(data.bedtime)
        } catch (error) { }
    }

    const handleAddHabit = async (newHabit: any) => {
        const tempId = Math.random().toString(36).substr(2, 9);
        const habitWithTempId = { ...newHabit, id: tempId, streak: 0, bestStreak: 0, status: "none", weeklyLogs: [] };

        // Optimistic Update - UI responds instantly
        setHabits(prev => [...prev, habitWithTempId]);

        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHabit)
            })
            if (!res.ok) throw new Error("Failed to create habit")
            const data = await res.json()

            // Replace temp id with real id from DB
            setHabits(prev => prev.map(h => h.id === tempId ? data : h));
        } catch (error) {
            setHabits(prev => prev.filter(h => h.id !== tempId));
            toast.error("Failed to create habit");
        }
    }

    const handleStatusChange = async (id: string, status: HabitStatus) => {
        const originalHabits = [...habits];
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Optimistic update for both current status and weekly heatmap
            setHabits(prevHabits => prevHabits.map(h => {
                if (h.id === id) {
                    const newLogs = [...(h.weeklyLogs || [])];
                    const existingLogIdx = newLogs.findIndex(l => {
                        const d = new Date(l.date);
                        return d.toLocaleDateString() === today.toLocaleDateString();
                    });

                    if (existingLogIdx >= 0) {
                        newLogs[existingLogIdx] = { ...newLogs[existingLogIdx], status };
                    } else {
                        newLogs.push({ date: today, status });
                    }

                    return { ...h, status, weeklyLogs: newLogs };
                }
                return h;
            }));

            const res = await fetch('/api/habits/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ habitId: id, status })
            })
            if (!res.ok) throw new Error()

            // Silently re-fetch to get updated streaks/stats without blocking
            fetchHabits();
        } catch (error) {
            toast.error("Failed to update status")
            setHabits(originalHabits); // Rollback
        }
    }

    const handleDeleteHabit = async (id: string) => {
        const originalHabits = [...habits];
        // Optimistic Delete (Soft)
        setHabits(prev => prev.map(h => h.id === id ? { ...h, isDeleted: true } : h));

        try {
            const res = await fetch(`/api/habits?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            toast.success("Habit deleted")
        } catch (error) {
            setHabits(originalHabits); // Rollback
            toast.error("Failed to delete habit")
        }
    }

    const handleUpdateFrequency = async (id: string, updates: any) => {
        const originalHabits = [...habits];
        // Optimistic Update
        setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));

        try {
            const res = await fetch(`/api/habits?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })
            if (!res.ok) throw new Error()
            fetchHabits(); // Silently sync
            toast.success("Frequency updated")
        } catch (error) {
            setHabits(originalHabits); // Rollback
            toast.error("Failed to update frequency")
        }
    }

    const handleSetBedtime = async (val: string) => {
        setBedtime(val)
        try {
            await fetch('/api/user/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bedtime: val })
            })
        } catch (error) { }
    }

    const activeHabitsToday = habits.filter(h => {
        if (h.isDeleted) return false;
        const today = new Date().getDay();

        if (h.type === 'Daily') return true;
        if (h.type === 'Weekdays') {
            return [1, 2, 3, 4, 5].includes(today); // Mon-Fri
        }
        if (h.type === 'Weekends') {
            return [0, 6].includes(today); // Sat-Sun
        }
        if (h.type === 'Custom' && h.customDays) {
            return h.customDays.includes(today);
        }
        return true;
    });

    const stats = {
        completedToday: habits.filter(h => !h.isDeleted && h.status === "done").length,
        totalHabits: activeHabitsToday.length || 1,
        bestStreak: habits.length > 0 ? Math.max(...habits.map(h => Math.max(0, h.bestStreak || 0))) : 0,
        currentStreak: habits.length > 0 ? habits[0].streak : 0,
        missedDays: 2,
        bestHabit: habits.filter(h => !h.isDeleted).sort((a, b) => b.streak - a.streak)[0]?.name || "None",
        weakHabit: habits.filter(h => !h.isDeleted).sort((a, b) => a.streak - b.streak)[0]?.name || "None",
    }

    const todayProgress = habits.length > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;

    const { weeklyProgress, isReturningUser } = useMemo(() => {
        if (habits.length === 0) return { weeklyProgress: 0, isReturningUser: false };

        let totalScheduled = 0;
        let totalCompleted = 0;

        const now = new Date();
        const todayStr = now.toLocaleDateString();
        const monday = new Date(now);
        const day = monday.getDay();
        const diff = monday.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);

        let hasDataBeforeWeek = false;

        habits.forEach(habit => {
            // Count completed logs in this week
            const completions = habit.weeklyLogs?.filter(log => {
                const logDate = new Date(log.date);
                if (logDate < monday) {
                    hasDataBeforeWeek = true;
                }
                return logDate >= monday && log.status === 'done';
            }).length || 0;

            totalCompleted += completions;

            // Calculate scheduled days from Monday until now
            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(monday);
                checkDate.setDate(monday.getDate() + i);
                if (checkDate > now && checkDate.toLocaleDateString() !== todayStr) break;


                const dayId = checkDate.getDay();
                let isScheduled = false;

                if (habit.type === 'Daily') {
                    isScheduled = true;
                } else if (habit.type === 'Weekdays') {
                    isScheduled = [1, 2, 3, 4, 5].includes(dayId);
                } else if (habit.type === 'Weekends') {
                    isScheduled = [0, 6].includes(dayId);
                } else if (habit.type === 'Custom' && habit.customDays) {
                    isScheduled = habit.customDays.includes(dayId);
                }

                if (isScheduled) totalScheduled++;
            }
        });

        return {
            weeklyProgress: totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0,
            isReturningUser: hasDataBeforeWeek
        };
    }, [habits]);

    const rangeProgress = weeklyProgress

    const weekEnd = new Date(selectedWeekStart);
    weekEnd.setDate(selectedWeekStart.getDate() + 6);

    const formatDateRange = () => {
        const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };
        return `Mon, ${selectedWeekStart.toLocaleDateString('en-US', options)} — Sun, ${weekEnd.toLocaleDateString('en-US', options)}`;
    }

    const handlePrevWeek = () => {
        const prev = new Date(selectedWeekStart);
        prev.setDate(selectedWeekStart.getDate() - 7);
        setSelectedWeekStart(prev);
    }

    const handleNextWeek = () => {
        const next = new Date(selectedWeekStart);
        next.setDate(selectedWeekStart.getDate() + 7);
        setSelectedWeekStart(next);
    }

    if (!mounted) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="space-y-4 text-center">
                    <div className="w-12 h-12 rounded-full border-t-2 border-emerald-500 animate-spin mx-auto"></div>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Loading Habits...</p>
                </div>
            </div>
        );
    }
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
                                                    onChange={(e) => handleSetBedtime(e.target.value)}
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
                        <CreateHabitModal onAddHabit={handleAddHabit} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Side: Progress & Heatmap */}
                    <div className="lg:col-span-8 space-y-16">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={handlePrevWeek}
                                    className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h2 className="text-2xl font-bold tracking-tight">{formatDateRange()}</h2>
                                <button
                                    onClick={handleNextWeek}
                                    className="w-11 h-11 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                                >
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
                                <div
                                    className="h-full bg-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                                    style={{ width: `${rangeProgress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-white/40 font-bold uppercase tracking-widest">Weekly Progress</span>
                                    {isReturningUser && (
                                        <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-bold uppercase tracking-widest ml-2 border-l border-white/10 pl-3">
                                            <TrendingUp className="w-3.5 h-3.5" /> Up 23%
                                        </div>
                                    )}
                                </div>
                                <div className="text-[11px] text-white/20 font-bold uppercase tracking-widest">
                                    {Math.round(rangeProgress)}% completed
                                </div>
                            </div>
                        </div>

                        {viewMode === 'grid' ? (
                            <HabitCalendar habits={habits} weekStart={selectedWeekStart} />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {habits.filter(h => !h.isDeleted).map((habit) => {
                                    const habitColor = habit.color || "#FF9F0A";
                                    const iconMap: any = { Target, Heart, Sparkles, Brain, Coffee, Music, Moon, Sun, Star, Zap, Trophy, User, Book, Dumbbell, Flower2, PenTool, Wine, Leaf, Circle };
                                    const Icon = habit.iconName ? (iconMap[habit.iconName] || Target) : Target;

                                    // Calculate Monthly Consistency accurately
                                    const now = new Date();
                                    now.setHours(0, 0, 0, 0);
                                    let totalScheduledInMonth = 0;
                                    for (let i = 0; i < 30; i++) {
                                        const d = new Date(now);
                                        d.setDate(now.getDate() - i);
                                        const dayId = d.getDay(); // 0=Sun, 1=Mon...
                                        const isScheduled = habit.type === 'Custom' && habit.customDays
                                            ? habit.customDays.includes(dayId)
                                            : true;
                                        if (isScheduled) totalScheduledInMonth++;
                                    }

                                    const completedInMonth = habit.weeklyLogs?.filter(l => l.status === 'done').length || 0;
                                    const consistency = totalScheduledInMonth > 0 ? Math.round((completedInMonth / totalScheduledInMonth) * 100) : 0;

                                    const getFrequencyText = () => {
                                        if (habit.type !== 'Custom' || !habit.customDays || habit.customDays.length === 0) return habit.type;
                                        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                        const scheduled = habit.customDays.map(d => days[d]).join(", ");
                                        return `Custom (${scheduled})`;
                                    }

                                    return (
                                        <div key={habit.id} className="bg-[#111111] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: habitColor }}></div>

                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div
                                                        className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0"
                                                        style={{ color: habitColor }}
                                                    >
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg tracking-tight line-clamp-1">{habit.name}</h3>
                                                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{habit.category}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-2xl font-black text-white/90 tracking-tighter" style={{ color: habitColor }}>{habit.streak}d</div>
                                                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Streak</span>
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-white/20 hover:text-white/50 ml-1">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 bg-[#161616] border-white/5 text-white/90">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setEditingHabit(habit)
                                                                    setIsUpdateModalOpen(true)
                                                                }}
                                                                className="gap-2 cursor-pointer focus:bg-white/5 focus:text-white"
                                                            >
                                                                <Settings className="w-4 h-4" />
                                                                <span>Update Frequency</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator className="bg-white/5" />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteHabit(habit.id)}
                                                                className="gap-2 cursor-pointer focus:bg-red-500/10 focus:text-red-500 text-red-500/70"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Delete Habit</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-[11px] font-bold">
                                                    <span className="text-zinc-500 uppercase tracking-widest">Monthly Consistency</span>
                                                    <span style={{ color: habitColor }}>{consistency}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000"
                                                        style={{
                                                            width: `${consistency}%`,
                                                            backgroundColor: habitColor,
                                                            boxShadow: `0 0 10px ${habitColor}44`
                                                        }}
                                                    ></div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Best Streak</div>
                                                        <div className="text-sm font-bold text-white/80">{habit.bestStreak} Days</div>
                                                    </div>
                                                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                                                        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Frequency</div>
                                                        <div className="text-[10px] font-bold text-white/80 truncate" title={getFrequencyText()}>{getFrequencyText()}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-[11px] text-white/10 font-bold uppercase tracking-widest">Daily Achievement</span>
                                    <p className="text-[11px] text-white/20 font-bold uppercase tracking-[0.1em]">
                                        {Math.round(todayProgress)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {habits.filter(h => !h.isDeleted).map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDeleteHabit}
                                    onUpdateFrequency={(h) => {
                                        setEditingHabit(h)
                                        setIsUpdateModalOpen(true)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <UpdateFrequencyModal
                habit={editingHabit}
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onUpdate={handleUpdateFrequency}
            />
        </div>
    )
}

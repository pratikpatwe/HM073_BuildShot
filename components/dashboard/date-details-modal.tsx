"use client"

import { useState, useEffect, useCallback } from "react"
import {
    Calendar,
    Smile,
    Wallet,
    Target,
    Clock,
    X,
    Plus,
    Loader2,
    Trash2,
} from "lucide-react"

import { cn, formatDateToLocalISO } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { dataEventEmitter, DATA_UPDATED_EVENT } from "@/lib/events"

interface DateDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    date: Date | null
    onEventAdded?: () => void
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
const periods = ["AM", "PM"];

interface DayStats {
    finance: {
        income: number;
        expenses: number;
        net: number;
        count: number;
    };
    habits: {
        completed: number;
        total: number;
    };
}

interface EventData {
    _id: string;
    title: string;
    description?: string;
    time: string;
    date: string;
}

export function DateDetailsModal({ isOpen, onClose, date, onEventAdded }: DateDetailsModalProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<DayStats | null>(null)
    const [events, setEvents] = useState<EventData[]>([])

    // Form state
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [hour, setHour] = useState("12")
    const [minute, setMinute] = useState("00")
    const [period, setPeriod] = useState("PM")
    const [showForm, setShowForm] = useState(false)

    const parseTime = (timeStr: string) => {
        if (!timeStr) return 0;
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    const fetchData = useCallback(async () => {
        if (!date) return

        const dateStr = formatDateToLocalISO(date)

        // Load from cache first
        const cacheKeyStats = `cache_day_stats_${dateStr}`;
        const cacheKeyEvents = `cache_day_events_${dateStr}`;
        const cachedStats = localStorage.getItem(cacheKeyStats);
        const cachedEvents = localStorage.getItem(cacheKeyEvents);

        if (cachedStats) setStats(JSON.parse(cachedStats));
        if (cachedEvents) setEvents(JSON.parse(cachedEvents));

        setLoading(true)
        try {
            console.log("Fetching for date:", dateStr)

            // Fetch Stats and Events in parallel
            const [statsRes, eventsRes] = await Promise.all([
                fetch(`/api/dashboard/day-summary?date=${dateStr}`),
                fetch(`/api/events?date=${dateStr}`)
            ])

            const [statsJson, eventsJson] = await Promise.all([
                statsRes.json(),
                eventsRes.json()
            ])

            setStats(statsJson)
            localStorage.setItem(cacheKeyStats, JSON.stringify(statsJson));

            const filteredEvents = Array.isArray(eventsJson)
                ? eventsJson.filter((e: any) => e.date.split('T')[0] === dateStr)
                : []

            const sortedEvents = filteredEvents.sort((a, b) => parseTime(a.time) - parseTime(b.time));
            setEvents(sortedEvents)
            localStorage.setItem(cacheKeyEvents, JSON.stringify(sortedEvents));
        } catch (e) {
            console.error("Failed to fetch day data", e)
        } finally {
            setLoading(false)
        }
    }, [date])

    useEffect(() => {
        if (isOpen && date) {
            fetchData()
            setIsEditing(false)
            setShowForm(false)
            setTitle("")
            setDescription("")
            setHour("12")
            setMinute("00")
            setPeriod("PM")

            // Subscribe to global updates
            const unsubscribe = dataEventEmitter.subscribe(DATA_UPDATED_EVENT, () => {
                fetchData();
            });
            return () => unsubscribe();
        }
    }, [isOpen, date, fetchData])

    if (!date) return null

    const formattedDate = date.toLocaleDateString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    })

    const isFutureOrToday = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const compareDate = new Date(date)
        compareDate.setHours(0, 0, 0, 0)
        return compareDate >= today
    }

    const handleAddEvent = async () => {
        if (!title) return

        const timeString = `${hour}:${minute} ${period}`

        // Optimistic Update
        const tempId = Math.random().toString()
        const newOptimisticEvent = {
            _id: tempId,
            title,
            description,
            time: timeString,
            date: formatDateToLocalISO(date)
        }

        setEvents(prev => [...prev, newOptimisticEvent].sort((a, b) => parseTime(a.time) - parseTime(b.time)))
        setShowForm(false)
        setIsEditing(true)

        try {
            const res = await fetch("/api/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    time: timeString,
                    date: formatDateToLocalISO(date)
                })
            })
            if (res.ok) {
                fetchData() // Refresh with real ID
                setTitle("")
                setDescription("")
                setHour("12")
                setMinute("00")
                setPeriod("PM")
                onEventAdded?.()
            } else {
                // Rollback on error
                setEvents(prev => prev.filter(e => e._id !== tempId))
            }
        } catch (e) {
            console.error("Failed to add event", e)
            setEvents(prev => prev.filter(e => e._id !== tempId))
        }
    }

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return

        // Optimistic Update
        const deletedEvent = events.find(e => e._id === id)
        setEvents(prev => prev.filter(e => e._id !== id))

        try {
            const res = await fetch(`/api/events?id=${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                onEventAdded?.()
            } else {
                // Rollback
                if (deletedEvent) setEvents(prev => [...prev, deletedEvent].sort((a, b) => parseTime(a.time) - parseTime(b.time)))
            }
        } catch (e) {
            console.error("Failed to delete event", e)
            if (deletedEvent) setEvents(prev => [...prev, deletedEvent].sort((a, b) => parseTime(a.time) - parseTime(b.time)))
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent showCloseButton={false} className="sm:max-w-[700px] bg-[#0c0c0c] border-white/5 text-white p-0 overflow-hidden rounded-[24px] shadow-2xl h-[600px] max-h-[80vh] flex flex-col gap-0 border">

                {/* Header Section */}
                <div className="px-8 py-6 border-b border-white/5 shrink-0 flex justify-between items-center bg-[#0c0c0c] z-20">
                    <div className="flex flex-col gap-0.5">
                        <DialogTitle className="text-xl font-bold text-white tracking-tight">
                            {formattedDate}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Daily activity overview showing schedule, finance, habits and mood.
                        </DialogDescription>
                        <p className="text-[12px] text-white/30 font-medium">Daily Overview</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {isFutureOrToday() && !isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="h-9 rounded-xl px-5 bg-white text-black hover:bg-zinc-200 font-bold text-[12px] cursor-pointer shadow-sm"
                            >
                                Edit Day
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            className="h-9 px-4 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-bold text-[12px] cursor-pointer"
                            onClick={isEditing ? () => {
                                if (showForm) setShowForm(false)
                                else setIsEditing(false)
                            } : onClose}
                        >
                            {isEditing ? (showForm ? "Back" : "Done") : <X className="w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex min-h-0">
                    {/* Left Panel: Schedule or Add Event Form */}
                    <div className="w-[45%] border-r border-white/5 flex flex-col bg-white/[0.01] overflow-hidden">
                        {isEditing ? (
                            <div className="flex-1 flex flex-col min-h-0">
                                {showForm ? (
                                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                                        <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">New Event</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/20 uppercase">Title</label>
                                                <Input
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}
                                                    placeholder="Event title"
                                                    className="bg-white/5 border-white/10 text-sm h-10 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/20 uppercase">Time</label>
                                                <div className="flex gap-2">
                                                    <Select value={hour} onValueChange={setHour}>
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-sm h-10 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 flex-1 cursor-pointer">
                                                            <SelectValue placeholder="Hr" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" sideOffset={4} className="bg-[#0c0c0c] border border-white/10 text-white max-h-[220px] custom-scrollbar shadow-2xl z-[100] min-w-[70px]">
                                                            {hours.map((h) => (
                                                                <SelectItem key={h} value={h} className="focus:bg-emerald-500 focus:text-black cursor-pointer">
                                                                    {h}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select value={minute} onValueChange={setMinute}>
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-sm h-10 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 flex-1 cursor-pointer">
                                                            <SelectValue placeholder="Min" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" sideOffset={4} className="bg-[#0c0c0c] border border-white/10 text-white max-h-[220px] custom-scrollbar shadow-2xl z-[100] min-w-[70px]">
                                                            {minutes.map((m) => (
                                                                <SelectItem key={m} value={m} className="focus:bg-emerald-500 focus:text-black cursor-pointer">
                                                                    {m}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select value={period} onValueChange={setPeriod}>
                                                        <SelectTrigger className="bg-white/5 border-white/10 text-sm h-10 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 flex-1 cursor-pointer">
                                                            <SelectValue placeholder="AM/PM" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" sideOffset={4} className="bg-[#0c0c0c] border border-white/10 text-white shadow-2xl z-[100] min-w-[70px]">
                                                            {periods.map((p) => (
                                                                <SelectItem key={p} value={p} className="focus:bg-emerald-500 focus:text-black cursor-pointer">
                                                                    {p}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-white/20 uppercase">Description</label>
                                                <Textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder="Details (optional)"
                                                    className="bg-white/5 border-white/10 text-sm rounded-xl min-h-[100px] focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                            <Button
                                                onClick={handleAddEvent}
                                                disabled={loading || !title}
                                                className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg shadow-emerald-500/10"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Event"}
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col min-h-0">
                                        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                                            <Button
                                                onClick={() => setShowForm(true)}
                                                className="w-full h-10 bg-white text-black hover:bg-zinc-200 font-bold text-[11px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add Event
                                            </Button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                                            {events.length > 0 ? (
                                                events.map((event, idx) => (
                                                    <div
                                                        key={event._id}
                                                        className={cn(
                                                            "px-8 py-5 border-b border-white/5 group relative",
                                                            idx === 0 && "!pt-5"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="flex flex-col">
                                                                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">{event.time}</p>
                                                                <p className="text-sm font-black text-white uppercase tracking-tight leading-snug">{event.title}</p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteEvent(event._id)}
                                                                className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-500 transition-all cursor-pointer"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center p-8">
                                                    <Calendar className="w-8 h-8 mb-2" />
                                                    <p className="text-[10px] font-black uppercase tracking-widest">No Events</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                                {loading && events.length === 0 ? (
                                    <div className="flex-1 flex items-center justify-center opacity-20">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    </div>
                                ) : events.length > 0 ? (
                                    events.map((event, idx) => (
                                        <div
                                            key={event._id}
                                            className={cn(
                                                "px-8 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group",
                                                idx === 0 && "!pt-5"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">{event.time}</p>
                                                    <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight leading-snug">{event.title}</p>
                                                    {event.description && <p className="text-[11px] text-white/40 mt-1 line-clamp-2 leading-relaxed">{event.description}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center p-8">
                                        <Calendar className="w-8 h-8 mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Events</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Data Analysis */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                        {/* Finance section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-1">Economy</h3>
                            {loading && !stats ? (
                                <div className="h-40 flex items-center justify-center bg-white/[0.02] rounded-2xl border border-white/5 opacity-20">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Income</p>
                                            <p className="text-xl font-black text-white tracking-tight">₹{stats?.finance.income.toLocaleString() || "0"}</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Expenses</p>
                                            <p className="text-xl font-black text-white tracking-tight">₹{stats?.finance.expenses.toLocaleString() || "0"}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex justify-between items-center group">
                                        <div>
                                            <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest leading-none mb-1">Net Balance</p>
                                            <p className="text-2xl font-black text-white tracking-tighter leading-none">₹{stats?.finance.net.toLocaleString() || "0"}</p>
                                        </div>
                                        <Wallet className="w-5 h-5 text-emerald-500/40 group-hover:scale-110 transition-transform" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Status Grid */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-1">Daily Status</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="h-24 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Habits</p>
                                        <Target className="w-3.5 h-3.5 text-white/10 group-hover:text-emerald-500/50 transition-colors" />
                                    </div>
                                    <p className="text-xl font-black text-white">{stats?.habits.completed || 0} <span className="text-sm text-white/20">/ {stats?.habits.total || 0}</span></p>
                                </div>
                                <div className="h-24 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Mood</p>
                                        <Smile className="w-3.5 h-3.5 text-emerald-500/40 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <p className="text-lg font-black text-white italic tracking-tight italic">"Vibrant"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
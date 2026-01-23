"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
    Plus,
    Clock,
    ChevronLeft,
    ChevronRight,
    Trophy,
} from "lucide-react"

import DashboardNav from "@/components/dashboard/dashboard-nav"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DateDetailsModal } from "@/components/dashboard/date-details-modal"

// Mock data for rankings
const rankings = [
    { name: "Sarah K.", rank: 1, avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Marcus V.", rank: 2, avatar: "https://i.pravatar.cc/150?u=marcus" },
    { name: "Alex J.", rank: 3, avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Elena R.", rank: 4, avatar: "https://i.pravatar.cc/150?u=elena" },
    { name: "David L.", rank: 5, avatar: "https://i.pravatar.cc/150?u=david" },
    { name: "Emily W.", rank: 6, avatar: "https://i.pravatar.cc/150?u=emily" },
    { name: "James B.", rank: 7, avatar: "https://i.pravatar.cc/150?u=james" },
    { name: "Lisa M.", rank: 8, avatar: "https://i.pravatar.cc/150?u=lisa" },
]

const DayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export default function GamifiedDashboard() {
    const [user, setUser] = useState<any>(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [eventDates, setEventDates] = useState<Set<string>>(new Set())
    const supabase = createClient()
    const router = useRouter()

    const fetchEvents = useCallback(async () => {
        if (!user) return
        try {
            const res = await fetch(`/api/events?month=${currentDate.getMonth()}&year=${currentDate.getFullYear()}`)
            const data = await res.json()
            if (Array.isArray(data)) {
                const dates = new Set(data.map((e: any) => e.date.split('T')[0]))
                setEventDates(dates)
            }
        } catch (e) {
            console.error("Failed to fetch events for calendar", e)
        }
    }, [user, currentDate])

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push("/onboarding")
                return
            }
            setUser(user)
        }
        getUser()
    }, [supabase.auth, router])

    useEffect(() => {
        if (user) {
            fetchEvents()
        }
    }, [user, fetchEvents])

    const userName = user?.user_metadata?.full_name || user?.user_metadata?.first_name || "User"
    const userEmail = user?.email || ""
    const userAvatar = user?.user_metadata?.avatar_url || ""

    // Calendar Logic
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const days = []
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null)
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }
        return days
    }, [currentDate])

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }

    const isToday = (date: Date | null) => {
        if (!date) return false
        const today = new Date()
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
    }

    const handleDateClick = (date: Date) => {
        setSelectedDate(date)
        setIsModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-[#060606] text-white">
            <DashboardNav />

            {/* Subtle mesh background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[120px]" />
            </div>

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-10">
                <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:h-[730px]">

                    {/* Left Panel (60%) */}
                    <div className="lg:w-[60%] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {/* Profile Card */}
                        <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-white/5 shrink-0 transition-all hover:border-emerald-500/10">
                            <div className="flex items-center gap-5">
                                <Avatar className="h-14 w-14 rounded-xl ring-1 ring-white/10 shadow-2xl">
                                    <AvatarImage src={userAvatar} className="object-cover" />
                                    <AvatarFallback className="bg-zinc-800 text-emerald-400 text-xl font-semibold">
                                        {userName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">{userName}</h1>
                                    <p className="text-white/30 text-[13px] font-medium">{userEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Custom Calendar Card */}
                        <div className="flex-1 flex flex-col p-8 rounded-2xl bg-[#0c0c0c] border border-white/5 min-h-0 overflow-hidden">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-10 shrink-0">
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {currentDate.toLocaleString('default', { month: 'long' })}
                                    </h2>
                                    <span className="text-xl font-medium text-white/20">
                                        {currentDate.getFullYear()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        onClick={prevMonth}
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        onClick={nextMonth}
                                        size="icon"
                                        variant="ghost"
                                        className="h-9 w-9 text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Calendar Labels */}
                            <div className="grid grid-cols-7 mb-6 shrink-0">
                                {DayNames.map(day => (
                                    <div key={day} className="text-center text-[10px] font-black tracking-[0.15em] text-white/20">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="flex-1 grid grid-cols-7 gap-y-1 min-h-0">
                                {calendarDays.map((date, idx) => {
                                    const dateKey = date ? date.toISOString().split('T')[0] : null
                                    const hasEvent = dateKey && eventDates.has(dateKey);

                                    return (
                                        <div
                                            key={idx}
                                            className="h-20 flex items-center justify-center"
                                        >
                                            {date && (
                                                <div
                                                    onClick={() => handleDateClick(date)}
                                                    className={cn(
                                                        "size-16 rounded-2xl flex items-center justify-center transition-all relative cursor-pointer text-base",
                                                        isToday(date)
                                                            ? "bg-emerald-500 text-black font-black shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                                                            : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                                                    )}
                                                >
                                                    <span className="z-10">{date.getDate()}</span>
                                                    {/* Event Indicator */}
                                                    {hasEvent && !isToday(date) && (
                                                        <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                                    )}
                                                    {isToday(date) && hasEvent && (
                                                        <div className="absolute bottom-3 w-1.5 h-1.5 rounded-full bg-black/40" />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (40%) - Leaderboard */}
                    <div className="lg:w-[40%] animate-in fade-in slide-in-from-right-2 duration-700 delay-100 flex flex-col">
                        <div className="flex-1 flex flex-col p-8 rounded-2xl bg-[#0c0c0c] border border-white/5 overflow-hidden">
                            <div className="flex items-center justify-between mb-12 shrink-0">
                                <div className="flex -space-x-2">
                                    {rankings.slice(0, 3).map((person, i) => (
                                        <Avatar key={i} className="border-2 border-[#060606] w-8 h-8 ring-1 ring-white/5">
                                            <AvatarImage src={person.avatar} />
                                            <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">{person.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#060606] text-[9px] font-bold text-white/20 ring-1 ring-white/5">
                                        +12
                                    </div>
                                </div>
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer border border-white/5 flex items-center justify-center">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="mb-6 shrink-0">
                                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Current Ranking</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1 pb-4">
                                {rankings.map((player) => (
                                    <div
                                        key={player.rank}
                                        className={cn(
                                            "group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border",
                                            player.rank === 1 ? "bg-yellow-500/[0.04] border-yellow-500/10 hover:bg-yellow-500/[0.06]" :
                                                player.rank === 2 ? "bg-slate-400/[0.04] border-slate-400/10 hover:bg-slate-400/[0.06]" :
                                                    player.rank === 3 ? "bg-orange-800/[0.04] border-orange-800/10 hover:bg-orange-800/[0.06]" :
                                                        "bg-transparent border-transparent hover:bg-white/[0.01]"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 rounded-lg shrink-0">
                                                <AvatarImage src={player.avatar} />
                                                <AvatarFallback className="bg-zinc-800 font-bold">{player.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-[13px] text-white/90">{player.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 opacity-40">
                                                    <Clock className="w-2.5 h-2.5" />
                                                    <p className="text-[9px] font-bold uppercase tracking-widest leading-none">2h ago</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black border transition-all",
                                                player.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]" :
                                                    player.rank === 2 ? "bg-slate-400/20 text-slate-400 border-slate-400/20" :
                                                        player.rank === 3 ? "bg-orange-800/20 text-orange-800 border-orange-800/20" :
                                                            "bg-transparent text-white/5 border-white/5"
                                            )}>
                                                {player.rank <= 3 ? (
                                                    <Trophy className="w-3.5 h-3.5" />
                                                ) : (
                                                    player.rank
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Date Details Modal */}
            <DateDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                date={selectedDate}
                onEventAdded={fetchEvents}
            />
        </div>
    )
}

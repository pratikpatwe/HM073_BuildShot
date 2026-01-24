"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
    Bell,
    UserPlus,
    Check,
    ScrollText,
    Plus,
    Clock,
    ChevronLeft,
    ChevronRight,
    Trophy,
    Home,
    Wallet,
    CheckCircle,
    BookOpen,
    ListTodo,
    LogOut,
    X,
    User,
} from "lucide-react"

import { cn, formatDateToLocalISO } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DateDetailsModal } from "@/components/dashboard/date-details-modal"
import Link from "next/link"
import Image from "next/image"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const DayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const ProfileSkeleton = () => (
    <div className="bg-[#0c0c0c] border border-white/5 rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-stretch shadow-2xl relative overflow-hidden group">
        {/* Profile Picture Box Skeleton */}
        <div className="w-full sm:w-40 h-40 shrink-0 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center p-2">
            <div className="h-full w-full rounded-xl bg-white/5 animate-pulse" />
        </div>

        {/* Info & Actions Skeleton */}
        <div className="flex-1 flex flex-col justify-between py-1">
            <div className="mb-4 bg-zinc-900/50 border border-white/5 rounded-xl p-4 min-h-[80px] space-y-3">
                <div className="flex items-center justify-between">
                    <div className="h-6 w-32 bg-white/5 rounded-md animate-pulse" />
                    <div className="h-5 w-16 bg-white/5 rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-white/5 rounded-md animate-pulse" />
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-white/10 h-full w-1/3 animate-pulse" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/5 animate-pulse" />
                <div className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/5 animate-pulse" />
            </div>
        </div>
    </div>
)

export default function GamifiedDashboard() {
    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [eventDates, setEventDates] = useState<Set<string>>(new Set())

    // Social State
    const [leaderboard, setLeaderboard] = useState<any[]>([])
    const [friendRequests, setFriendRequests] = useState<any[]>([])
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
    const [friendEmail, setFriendEmail] = useState("")
    const [isSubmittingFriend, setIsSubmittingFriend] = useState(false)

    const supabase = createClient()
    const router = useRouter()

    const fetchSocialData = useCallback(async () => {
        try {
            const [leaderboardRes, requestsRes] = await Promise.all([
                fetch('/api/social?action=leaderboard'),
                fetch('/api/social?action=requests')
            ]);

            if (leaderboardRes.ok) {
                const data = await leaderboardRes.json();
                setLeaderboard(data.leaderboard || []);
            }

            if (requestsRes.ok) {
                const data = await requestsRes.json();
                setFriendRequests(data.requests || []);
            }
        } catch (error) {
            console.error("Failed to fetch social data", error);
        }
    }, []);

    const syncProfile = useCallback(async (currUser: any) => {
        if (!currUser) return;
        try {
            const res = await fetch('/api/social/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: currUser.user_metadata?.full_name || currUser.user_metadata?.first_name || currUser.email?.split('@')[0] || "User",
                    email: currUser.email,
                    avatar: currUser.user_metadata?.avatar_url
                })
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data.profile);
                fetchSocialData();
            }
        } catch (error) {
            console.error("Failed to sync profile", error);
        }
    }, [fetchSocialData]);

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
        const init = async () => {
            // 1. Initial Quick Fetch (Session is usually available instantly)
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                setUser(session.user)
                // Trigger sync and social data in parallel immediately
                Promise.all([
                    syncProfile(session.user),
                    fetchSocialData()
                ])
            }

            // 2. Verified Fetch (Ensures session is still valid)
            const { data: { user: verifiedUser } } = await supabase.auth.getUser()
            if (!verifiedUser) {
                router.push("/onboarding")
                return
            }

            // Update user if verified user is different or not set
            if (!session?.user) {
                setUser(verifiedUser)
                Promise.all([
                    syncProfile(verifiedUser),
                    fetchSocialData()
                ])
            }
        }
        init()
    }, [supabase.auth, router, syncProfile, fetchSocialData])

    useEffect(() => {
        if (user) {
            fetchEvents()
        }
    }, [user, fetchEvents])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    const handleSendRequest = async () => {
        if (!friendEmail) return;
        setIsSubmittingFriend(true);
        try {
            const res = await fetch('/api/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send_request', email: friendEmail })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Request sent!");
                setIsAddFriendOpen(false);
                setFriendEmail("");
            } else {
                toast.error(data.error || "Failed to send request");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmittingFriend(false);
        }
    }

    const handleAcceptRequest = async (requestId: string) => {
        try {
            const res = await fetch('/api/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'accept_request', requestId })
            });
            if (res.ok) {
                toast.success("Friend request accepted");
                fetchSocialData();
            }
        } catch (error) {
            toast.error("Failed to accept request");
        }
    }

    const handleRejectRequest = async (requestId: string) => {
        try {
            const res = await fetch('/api/social', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject_request', requestId })
            });
            if (res.ok) {
                toast.success("Friend request rejected");
                fetchSocialData();
            }
        } catch (error) {
            toast.error("Failed to reject request");
        }
    }

    const optimizeAvatarUrl = (url: string | undefined | null) => {
        if (!url) return ""
        return url.includes('googleusercontent.com')
            ? url.replace(/=s\d+(-c)?$/, '=s400-c')
            : url
    }

    const userName = user?.user_metadata?.full_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || "User"
    const userEmail = user?.email || ""
    const userAvatar = optimizeAvatarUrl(user?.user_metadata?.avatar_url)

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
        <div className="min-h-screen bg-[#060606] text-white pb-20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
                {/* Header Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 sm:mb-12">
                    {/* Left: Branding & Nav */}
                    <div className="flex flex-col justify-between py-2">
                        <div className="flex items-center gap-4 sm:gap-6 mb-8">
                            <Link href="/" className="relative w-16 h-16 shrink-0 sm:w-20 sm:h-20 lg:w-24 lg:h-24 hover:opacity-80 transition-opacity cursor-pointer">
                                <Image
                                    src="/kairos-logo.svg"
                                    alt="Kairos Logo"
                                    fill
                                    className="object-contain"
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white uppercase tracking-tighter">
                                    Dashboard
                                </h1>
                                <p className="text-zinc-500 mt-2 text-base sm:text-lg lg:text-xl font-medium tracking-tight">
                                    Hello, {userName}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center bg-zinc-900/50 border border-zinc-800 rounded-2xl p-1.5 gap-1.5 w-fit">
                            <Link href="/dashboard">
                                <Button size="sm" className="h-10 px-4 text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
                                    <Home className="w-4 h-4" />
                                    <span className="hidden md:inline font-semibold">Dashboard</span>
                                </Button>
                            </Link>
                            <Link href="/finance">
                                <Button variant="ghost" size="sm" className="h-10 px-4 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl gap-2 transition-all cursor-pointer">
                                    <Wallet className="w-4 h-4" />
                                    <span className="hidden md:inline font-semibold">Finance</span>
                                </Button>
                            </Link>
                            <Link href="/habits">
                                <Button variant="ghost" size="sm" className="h-10 px-4 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl gap-2 transition-all cursor-pointer">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="hidden md:inline font-semibold">Habits</span>
                                </Button>
                            </Link>
                            <Link href="/journal">
                                <Button variant="ghost" size="sm" className="h-10 px-4 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl gap-2 transition-all cursor-pointer">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="hidden md:inline font-semibold">Diary</span>
                                </Button>
                            </Link>
                            <Link href="/todo">
                                <Button variant="ghost" size="sm" className="h-10 px-4 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl gap-2 transition-all cursor-pointer">
                                    <ListTodo className="w-4 h-4" />
                                    <span className="hidden md:inline font-semibold">To-Do</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Profile Section */}
                    {!user || !profile ? (
                        <ProfileSkeleton />
                    ) : (
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-stretch shadow-2xl relative overflow-hidden group hover:border-emerald-500/10 transition-all">
                            {/* Profile Picture Box */}
                            <div className="w-full sm:w-40 h-40 shrink-0 bg-zinc-900 rounded-2xl border border-white/5 flex items-center justify-center p-2 group-hover:border-emerald-500/20 transition-all overflow-hidden">
                                <Avatar className="h-full w-full rounded-xl">
                                    <AvatarImage src={userAvatar} className="object-cover" />
                                    <AvatarFallback className="bg-zinc-800 text-emerald-400 text-3xl font-black">
                                        <User className="w-10 h-10" />
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Info & Actions */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                {/* User Info Box */}
                                <div className="mb-4 bg-zinc-900/50 border border-white/5 rounded-xl p-4 min-h-[80px]">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className="text-lg font-bold text-white">{userName}</h3>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                            <Trophy className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-400">LVL {profile.level}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium tracking-tight mb-2">
                                        {userEmail}
                                    </p>
                                    <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                        <div
                                            className="bg-emerald-500 h-full transition-all duration-500"
                                            style={{ width: `${(profile.xp % 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons Row */}
                                <div className="flex items-center gap-3">
                                    {/* Notification Popover */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center gap-2 hover:bg-white/5 transition-all group/btn relative cursor-pointer font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-white">
                                                <Bell className="w-4 h-4 text-emerald-500" />
                                                <span>Notification</span>
                                                {friendRequests.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                                        {friendRequests.length}
                                                    </span>
                                                )}
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 bg-[#111111] border-white/5 rounded-2xl p-4 shadow-2xl z-50">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Friend Requests</h4>
                                                    <UserPlus className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                {friendRequests.length === 0 ? (
                                                    <p className="text-xs text-zinc-600 text-center py-4 italic">No new requests</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {friendRequests.map(req => (
                                                            <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 group/req">
                                                                <div className="flex items-center gap-3">
                                                                    <Avatar className="h-8 w-8 rounded-lg">
                                                                        <AvatarFallback className="bg-zinc-800 text-[10px]">{req.senderName.charAt(0)}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-bold text-zinc-300">{req.senderName}</span>
                                                                        <span className="text-[9px] text-zinc-500">{req.senderEmail}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleAcceptRequest(req.id)}
                                                                        className="p-1.5 rounded-md hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
                                                                    >
                                                                        <Check className="w-3 h-3" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRejectRequest(req.id)}
                                                                        className="p-1.5 rounded-md hover:bg-red-500/20 hover:text-red-500 transition-all cursor-pointer"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    <button
                                        onClick={handleLogout}
                                        className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center gap-2 hover:bg-red-500/10 group/btn transition-all cursor-pointer font-bold uppercase tracking-widest text-xs text-zinc-400 hover:text-red-400"
                                    >
                                        <LogOut className="w-4 h-4 text-red-500" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:h-[730px]">
                    {/* Left Panel (60%) - Calendar */}
                    <div className="lg:w-[60%] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="flex-1 flex flex-col p-8 rounded-[32px] bg-[#0c0c0c] border border-white/5 min-h-0 overflow-hidden shadow-2xl">
                            {/* Calendar Header etc (unchanged but wrapped in nicer container) */}
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

                            <div className="grid grid-cols-7 mb-6 shrink-0">
                                {DayNames.map(day => (
                                    <div key={day} className="text-center text-[10px] font-black tracking-[0.15em] text-white/20">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 grid grid-cols-7 gap-y-1 min-h-0">
                                {calendarDays.map((date, idx) => {
                                    const dateKey = date ? formatDateToLocalISO(date) : null
                                    const hasEvent = dateKey && eventDates.has(dateKey);

                                    return (
                                        <div key={idx} className="h-20 flex items-center justify-center">
                                            {date && (
                                                <div
                                                    onClick={() => handleDateClick(date)}
                                                    className={cn(
                                                        "size-16 rounded-2xl flex items-center justify-center transition-all relative cursor-pointer text-base",
                                                        isToday(date)
                                                            ? "bg-emerald-500 text-black font-black shadow-[0_0_25px_rgba(16,185,129,0.25)] scale-105"
                                                            : "text-white/40 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10"
                                                    )}
                                                >
                                                    <span className="z-10">{date.getDate()}</span>
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

                    {/* Right Panel (40%) - Real Leaderboard */}
                    <div className="lg:w-[40%] animate-in fade-in slide-in-from-right-2 duration-700 delay-100 flex flex-col">
                        <div className="flex-1 flex flex-col p-8 rounded-[32px] bg-[#0c0c0c] border border-white/5 overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between mb-12 shrink-0">
                                <div className="flex -space-x-2">
                                    {leaderboard.slice(0, 3).map((person, i) => (
                                        <Avatar key={i} className="border-2 border-[#060606] w-9 h-9 ring-1 ring-white/5">
                                            <AvatarImage src={optimizeAvatarUrl(person.avatar)} />
                                            <AvatarFallback className="bg-zinc-800 text-[10px] font-bold">{person.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {leaderboard.length > 3 && (
                                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 border-2 border-[#060606] text-[9px] font-bold text-white/20 ring-1 ring-white/5">
                                            +{leaderboard.length - 3}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setIsAddFriendOpen(true)}
                                    size="icon"
                                    variant="secondary"
                                    className="h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/20 transition-all cursor-pointer border-none flex items-center justify-center"
                                >
                                    <Plus className="w-5 h-5 font-bold" />
                                </Button>
                            </div>

                            <div className="mb-6 shrink-0">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">Current Ranking</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 pb-4">
                                {leaderboard.map((player) => (
                                    <div
                                        key={player.id}
                                        className={cn(
                                            "group flex items-center justify-between p-4 rounded-2xl transition-all border",
                                            player.rank === 1 ? "bg-yellow-500/[0.04] border-yellow-500/10 hover:bg-yellow-500/[0.06]" :
                                                player.rank === 2 ? "bg-slate-400/[0.04] border-slate-400/10 hover:bg-slate-400/[0.06]" :
                                                    player.rank === 3 ? "bg-orange-800/[0.04] border-orange-800/10 hover:bg-orange-800/[0.06]" :
                                                        "bg-transparent border-transparent hover:bg-white/[0.01]"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <Avatar className="h-12 w-12 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
                                                    <AvatarImage src={optimizeAvatarUrl(player.avatar)} />
                                                    <AvatarFallback className="bg-zinc-800 font-bold">{player.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {player.id === user?.id && (
                                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0c0c0c] rounded-full" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[14px] text-white/90">{player.name} {player.id === user?.id && "(You)"}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                                                        LVL {player.level}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-emerald-500/60">{player.xp} XP</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black border transition-all",
                                                player.rank === 1 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.15)]" :
                                                    player.rank === 2 ? "bg-slate-400/20 text-slate-400 border-slate-400/20" :
                                                        player.rank === 3 ? "bg-orange-800/20 text-orange-800 border-orange-800/20" :
                                                            "bg-white/5 text-white/20 border-white/5"
                                            )}>
                                                {player.rank <= 3 ? (
                                                    <Trophy className="w-4 h-4" />
                                                ) : (
                                                    player.rank
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {leaderboard.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                                        <ScrollText className="w-10 h-10 mb-4" />
                                        <p className="text-sm font-bold uppercase tracking-widest">Syncing Rank...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Friend Dialog */}
            <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
                <DialogContent className="sm:max-w-md bg-[#111111] border-white/5 rounded-3xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white tracking-tight">Add Friend</DialogTitle>
                        <DialogDescription className="text-zinc-500">
                            Invite your friends to Kairos by their email address to compete and stay consistent together.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Input
                                id="email"
                                placeholder="friend@example.com"
                                value={friendEmail}
                                onChange={(e) => setFriendEmail(e.target.value)}
                                className="bg-zinc-900 border-white/5 rounded-xl h-12 text-white focus:border-emerald-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <DialogFooter className="sm:justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsAddFriendOpen(false)}
                            className="rounded-xl h-11 px-6 hover:bg-white/5 border-none"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSendRequest}
                            disabled={isSubmittingFriend || !friendEmail}
                            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-8 rounded-xl h-11 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                        >
                            {isSubmittingFriend ? "Sending..." : "Send Request"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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

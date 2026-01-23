"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
    Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts"
import {
    ArrowDown, ArrowUp, BarChart3, Calendar,
    CheckCircle2, Crown, Flame, Gift,
    Lock, Medal, Target,
    TrendingUp, Trophy, Wallet, Zap, TrendingDown
} from "lucide-react"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import StarBorder from "@/components/StarBorder"

interface Achievement {
    id: string
    name: string
    description: string
    icon: any
    unlocked: boolean
    progress: number
    total: number
    rarity: "common" | "rare" | "epic" | "legendary"
}

interface ScoreMilestone {
    score: number
    title: string
    color: string
}

// Professional SVG Line Chart Component
// Professional Responsive SVG Line Chart Component
const LineChart = ({ data }: { data: number[] }) => {
    const chartData = data.map((val, i) => ({ day: `D${i + 1}`, value: val }))

    return (
        <div className="w-full h-[280px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="day"
                        hide
                    />
                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                    <RechartsTooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-[#0a0a0a] border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-xl">
                                        <p className="text-emerald-400 font-bold text-sm">{payload[0].value}%</p>
                                        <p className="text-white/40 text-[10px] uppercase font-bold">Focus Score</p>
                                    </div>
                                )
                            }
                            return null
                        }}
                    />
                    <Area
                        type="linear"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default function GamifiedDashboard() {
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()

    // Gamification data
    const userLevel = 12
    const currentXP = 2450
    const nextLevelXP = 3000
    const xpProgress = (currentXP / nextLevelXP) * 100

    // Stats with historical data
    const focusScore = 78
    const monthlyFocusScoreHistory = [
        42, 45, 48, 50, 52, 55, 58, 60, 62, 65,
        67, 70, 68, 71, 73, 75, 72, 74, 76, 78,
        75, 77, 79, 80, 78, 76, 78, 79, 77, 78
    ]
    const focusScoreHistory = [45, 52, 48, 65, 70, 68, 78]
    const todaySpending = 45.32
    const spendingHistory = [120, 85, 95, 60, 75, 50, 45.32]
    const monthlyBudget = 2000

    const habits = [
        { id: 1, name: "Morning Exercise", completed: true, streak: 12, xp: 50 },
        { id: 2, name: "Meditation", completed: true, streak: 8, xp: 50 },
        { id: 3, name: "Reading", completed: false, streak: 5, xp: 50 },
        { id: 4, name: "Hydration Goal", completed: true, streak: 15, xp: 50 },
    ]
    const habitsHistory = [1, 2, 2, 3, 3, 3, 3]
    const completedHabits = habits.filter(h => h.completed).length
    const totalDailyXP = habits.filter(h => h.completed).reduce((sum, h) => sum + h.xp, 0)

    // Score Milestones
    const scoreMilestones: ScoreMilestone[] = [
        { score: 90, title: "Perfect Master", color: "from-emerald-400 to-green-500" },
        { score: 85, title: "Elite Performer", color: "from-emerald-400 to-green-500" },
        { score: 80, title: "Excellence Champion", color: "from-emerald-400 to-green-500" },
        { score: 75, title: "Strong Achiever", color: "from-emerald-400 to-green-500" },
        { score: 70, title: "Rising Star", color: "from-green-400 to-emerald-500" },
        { score: 60, title: "Good Progress", color: "from-emerald-300 to-emerald-400" },
        { score: 50, title: "Making Strides", color: "from-gray-300 to-gray-400" },
    ]

    const currentMilestone = scoreMilestones.find(m => focusScore >= m.score) || scoreMilestones[scoreMilestones.length - 1]
    const nextMilestone = scoreMilestones.find(m => m.score > focusScore)

    // Achievements
    const achievements: Achievement[] = [
        {
            id: "streak_7",
            name: "Weekly Warrior",
            description: "7-day habit streak",
            icon: Flame,
            unlocked: true,
            progress: 7,
            total: 7,
            rarity: "common"
        },
        {
            id: "focus_80",
            name: "Focus Master",
            description: "Reach 80% focus score",
            icon: Target,
            unlocked: false,
            progress: 78,
            total: 80,
            rarity: "rare"
        },
        {
            id: "budget_master",
            name: "Budget Boss",
            description: "Stay under budget for 7 days",
            icon: Wallet,
            unlocked: true,
            progress: 7,
            total: 7,
            rarity: "epic"
        },
        {
            id: "perfect_week",
            name: "Perfect Week",
            description: "100% habits for 7 days",
            icon: Crown,
            unlocked: false,
            progress: 3,
            total: 7,
            rarity: "legendary"
        },
    ]

    const unlockedCount = achievements.filter(a => a.unlocked).length

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()
    }, [supabase.auth])


    const userName = user?.user_metadata?.full_name ||
        user?.user_metadata?.first_name ||
        "User"

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening"

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "common": return "from-gray-400 to-gray-500"
            case "rare": return "from-emerald-400 to-emerald-500"
            case "epic": return "from-green-400 to-green-500"
            case "legendary": return "from-emerald-300 to-emerald-400"
            default: return "from-gray-400 to-gray-500"
        }
    }

    // Mini Graph Component
    const MiniGraph = ({ data }: { data: number[] }) => {
        const color = "emerald"
        const max = Math.max(...data)
        const min = Math.min(...data)
        const range = max - min || 1

        return (
            <div
                className="flex items-end gap-1 h-12"
            >
                {data.map((value, i) => {
                    const height = ((value - min) / range) * 100
                    return (
                        <div key={i} className="flex-1 flex items-end group relative">
                            <div
                                className={`w-full bg-emerald-500/20 rounded-t transition-all duration-300 cursor-pointer hover:bg-emerald-500/40`}
                                style={{
                                    height: `${Math.max(height, 10)}%`,
                                    transformOrigin: 'bottom'
                                }}
                            />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-10 group-hover:translate-y-0 translate-y-1">
                                {value.toFixed(value % 1 === 0 ? 0 : 1)}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white pb-12">
            <DashboardNav />

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 animate-fadeIn">
                    {/* Welcome & Live Progress */}
                    <StarBorder as="div" className="lg:col-span-2 block w-full relative group" innerClassName="h-full flex flex-col justify-center p-6 bg-black border-none">
                        <div className="flex items-center gap-6 relative z-10">
                            <div className="relative">
                                {/* Enhanced Profile Picture Space */}
                                <div className="relative shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer">
                                        <div className="absolute inset-0 bg-emerald-500/5 group-hover/avatar:bg-emerald-500/10 transition-colors" />
                                        {user?.user_metadata?.avatar_url ? (
                                            <Image
                                                src={user.user_metadata.avatar_url}
                                                alt={userName}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="text-xl font-bold text-emerald-400">
                                                {userName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{greeting}</span>
                                </div>
                                <h1 className="text-3xl font-bold tracking-tight text-white">
                                    {userName}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3 hover:border-emerald-500/20 transition-all cursor-pointer group/badge">
                                    <Trophy className="h-4 w-4 text-emerald-400" />
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-wider leading-none">Rank</p>
                                        <p className="text-xs font-bold text-white leading-tight">{currentMilestone.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Bar Integrated in Welcome */}
                        <div className="mt-6 relative z-10">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Growth Progress</span>
                                <span className="text-[10px] font-bold text-emerald-400">{currentXP} <span className="text-white/10">/</span> {nextLevelXP}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${xpProgress}%` }}
                                />
                            </div>
                        </div>
                    </StarBorder>

                    {/* Daily Missions / To-Do Panel */}
                    <StarBorder as="div" className="block w-full" innerClassName="h-full bg-black border-none p-6 group">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                                    <Zap className="h-4 w-4 text-emerald-400" />
                                </div>
                                <h2 className="text-sm font-bold tracking-tight text-white/90">Daily Quests</h2>
                            </div>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">+150 XP</span>
                        </div>

                        <div className="space-y-3">
                            {[
                                { title: "Complete focus session", reward: "50 XP", done: true },
                                { title: "Log evening spending", reward: "30 XP", done: false },
                                { title: "Reach 80% habit completion", reward: "70 XP", done: false },
                            ].map((quest, i) => (
                                <div
                                    key={i}
                                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group/quest ${quest.done
                                        ? "bg-emerald-500/5 border-emerald-500/10 opacity-60"
                                        : "bg-white/[0.02] border-white/5 hover:border-emerald-500/20"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${quest.done ? "bg-emerald-500 border-emerald-500" : "border-white/10 group-hover/quest:border-emerald-500"
                                            }`}>
                                            {quest.done && <CheckCircle2 className="h-3 w-3 text-black" />}
                                        </div>
                                        <span className={`text-xs font-medium ${quest.done ? "text-white/30 line-through" : "text-white/70"}`}>
                                            {quest.title}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold ${quest.done ? "text-emerald-500/30" : "text-emerald-500/60"}`}>
                                        +{quest.reward}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </StarBorder>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    {/* Monthly Analytics Chart */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-black border border-white/10 group overflow-hidden">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                                    <BarChart3 className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold tracking-tight">Performance Matrix</h2>
                                    <p className="text-white/30 text-xs">Monthly focus score trajectory</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Active Score</p>
                                <p className="text-3xl font-bold text-emerald-400">{focusScore}%</p>
                            </div>
                        </div>

                        {/* Responsive Chart Container */}
                        <div className="relative w-full overflow-hidden flex justify-center">
                            <LineChart data={monthlyFocusScoreHistory} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Momentum</span>
                                </div>
                                <p className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                                    <ArrowUp className="h-4 w-4" />
                                    36<span className="text-xs opacity-50">pts</span>
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <Target className="h-4 w-4 text-emerald-400" />
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Peak</span>
                                </div>
                                <p className="text-xl font-bold text-white">
                                    {Math.max(...monthlyFocusScoreHistory)}%
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-2">
                                    <Calendar className="h-4 w-4 text-emerald-400" />
                                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Avg</span>
                                </div>
                                <p className="text-xl font-bold text-white">
                                    {(monthlyFocusScoreHistory.reduce((a, b) => a + b, 0) / monthlyFocusScoreHistory.length).toFixed(0)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 p-6 rounded-2xl bg-black border border-white/10 flex flex-col group">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                                <Medal className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight">Mastery Ranks</h2>
                                <p className="text-emerald-400/20 text-[10px] font-bold uppercase tracking-widest">Growth Path</p>
                            </div>
                        </div>

                        <div className="space-y-3 flex-1">
                            {scoreMilestones.map((milestone) => {
                                const isUnlocked = focusScore >= milestone.score
                                const isCurrent = milestone.score === currentMilestone.score

                                return (
                                    <div
                                        key={milestone.score}
                                        className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden relative group/rank ${isCurrent
                                            ? `bg-emerald-500/5 border-emerald-500/20`
                                            : isUnlocked
                                                ? "bg-white/[0.01] border-white/5 hover:border-emerald-500/10"
                                                : "bg-white/[0.005] border-white/5 opacity-30 grayscale"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-lg ${isUnlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                                                    {isUnlocked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-xs tracking-tight ${isCurrent ? 'text-emerald-400' : 'text-white/70'}`}>
                                                        {milestone.title}
                                                    </p>
                                                    <p className="text-[9px] text-white/20 font-medium">{milestone.score}% required</p>
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <div className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                                    <span className="text-[7px] font-bold uppercase text-emerald-400 tracking-tighter">Current</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Focus Score */}
                    <div className="p-5 rounded-2xl bg-black border border-white/10 group cursor-pointer h-full hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-transform">
                                    <Target className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Focus Intensity</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                                <ArrowUp className="h-3 w-3" />
                                +13%
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-3xl font-bold text-white mb-0.5">{focusScore}%</p>
                        </div>

                        <div>
                            <p className="text-white/20 text-[10px] mb-2 font-bold uppercase tracking-widest text-[8px]">Daily Trend</p>
                            <MiniGraph data={focusScoreHistory} />
                        </div>
                    </div>

                    {/* Spending */}
                    <div className="p-5 rounded-2xl bg-black border border-white/10 group cursor-pointer h-full hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-transform">
                                    <Wallet className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Expenditure</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                                <ArrowDown className="h-3 w-3" />
                                -24%
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-3xl font-bold text-white mb-0.5">${todaySpending}</p>
                        </div>

                        <div>
                            <p className="text-white/20 text-[10px] mb-2 font-bold uppercase tracking-widest text-[8px]">Daily Spending</p>
                            <MiniGraph data={spendingHistory} />
                        </div>
                    </div>

                    {/* Habits */}
                    <div className="p-5 rounded-2xl bg-black border border-white/10 group cursor-pointer h-full hover:border-emerald-500/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 transition-transform">
                                    <Flame className="h-4 w-4 text-emerald-400" />
                                </div>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">Consistency</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full">
                                <Flame className="h-3 w-3" />
                                12D STREAK
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-3xl font-bold text-white mb-0.5">{completedHabits} <span className="text-white/20">/ {habits.length}</span></p>
                        </div>

                        <div>
                            <p className="text-white/20 text-[10px] mb-2 font-bold uppercase tracking-widest text-[8px]">Progress</p>
                            <MiniGraph data={habitsHistory} />
                        </div>
                    </div>
                </div>

                {/* Achievements & Rewards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                    {/* Achievements */}
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-black border border-white/10 group flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                                    <Trophy className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Achievements</h2>
                                    <p className="text-white/30 text-xs">{unlockedCount} of {achievements.length} unlocked</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/60 hover:text-emerald-400 transition-colors">
                                View All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${achievement.unlocked
                                        ? "bg-white/[0.02] border-white/10 hover:border-emerald-500/20"
                                        : "bg-white/[0.01] border-white/5 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 shrink-0">
                                            <achievement.icon className={`h-4 w-4 ${achievement.unlocked ? "text-emerald-400" : "text-white/20"}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className="font-bold text-xs">{achievement.name}</h3>
                                                {achievement.unlocked && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                                            </div>
                                            <p className="text-[10px] text-white/30 line-clamp-1">{achievement.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Daily Rewards */}
                    <div className="block w-full p-6 rounded-2xl bg-black border border-white/10 group cursor-pointer flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/10">
                                <Gift className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold">Daily Rewards</h2>
                                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Streak progress</p>
                            </div>
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                { day: 1, xp: 50, claimed: true },
                                { day: 2, xp: 75, claimed: true },
                                { day: 3, xp: 100, claimed: true },
                                { day: 4, xp: 150, current: true },
                                { day: 5, xp: 200 },
                                { day: 6, xp: 250 },
                                { day: 7, xp: 500, special: true },
                            ].map((item) => (
                                <div
                                    key={item.day}
                                    className={`min-w-[70px] flex-1 p-3 rounded-xl border transition-all duration-300 ${item.claimed
                                        ? "bg-emerald-500/10 border-emerald-500/20 opacity-40"
                                        : item.current
                                            ? "bg-emerald-500/20 border-emerald-500/40"
                                            : "bg-white/[0.02] border-white/5"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-bold text-white/30">D{item.day}</span>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${item.claimed
                                            ? "text-emerald-400"
                                            : item.current
                                                ? "bg-emerald-500 text-black"
                                                : "text-white/20"
                                            }`}>
                                            {item.claimed ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                                        </div>
                                        <span className="text-[9px] font-bold text-white/40">{item.xp}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="p-6 rounded-2xl bg-black border border-white/10 group cursor-pointer h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10">
                            <TrendingUp className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Leaderboard</h2>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Global Ranking</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            { rank: 1, name: "Sarah K.", xp: "12,450", you: false },
                            { rank: 2, name: "Marcus V.", xp: "11,200", you: false },
                            { rank: 3, name: "Alex J.", xp: "10,800", you: false },
                            { rank: 4, name: "You", xp: "9,450", you: true },
                            { rank: 5, name: "Elena R.", xp: "8,900", you: false }
                        ].map((player) => (
                            <div
                                key={player.rank}
                                className={`flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 border ${player.you
                                    ? "bg-emerald-500/5 border-emerald-500/20"
                                    : "bg-white/[0.01] border-white/5 hover:border-white/10"
                                    }`}
                            >
                                <div className="relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border ${player.rank === 1 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" :
                                        "border-white/10 bg-white/5 text-white/40"
                                        }`}>
                                        {player.rank}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className={`font-bold text-xs ${player.you ? "text-emerald-400" : "text-white/70"}`}>{player.name}</p>
                                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{player.xp} XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>


            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s ease-out;
                }
            `}</style>
        </div>
    )
}

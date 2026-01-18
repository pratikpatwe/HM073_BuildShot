"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
    Activity, ArrowDown, ArrowUp, Award, BarChart3, Bell, Calendar,
    CheckCircle2, ChevronRight, Clock, Crown, Flame, Gift,
    History, Layout, Loader2, Lock, Medal, Menu, MessageSquare,
    MoreHorizontal, Search, Settings, Shield, Star, Target,
    TrendingUp, Trophy, User, Wallet, Zap, Sparkles, TrendingDown
} from "lucide-react"
import GamifiedDashboardNav from "@/components/dashboard/gamified-dashboard-nav"
import AIChatbot from "@/components/dashboard/ai-chatbot"
import TargetCursor from "@/components/ui/target-cursor"
import StarBorder from "@/components/StarBorder"
import TargetCorners from "@/components/ui/target-corners"

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
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
    const padding = { top: 40, right: 30, bottom: 40, left: 50 }
    const width = 800 // Base width for viewBox
    const height = 320 // Base height for viewBox
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    // Generate points
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * chartWidth
        const y = chartHeight - ((value - min) / range) * chartHeight
        return { x, y, value, index }
    })

    // Create smooth curve path
    const smoothPath = points
        .map((p, i) => {
            if (i === 0) return `M ${p.x} ${p.y}`
            const prev = points[i - 1]
            const cp1x = prev.x + (p.x - prev.x) / 3
            const cp1y = prev.y
            const cp2x = prev.x + (2 * (p.x - prev.x)) / 3
            const cp2y = p.y
            return `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`
        })
        .join(' ')

    const areaPath = `${smoothPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

    const gridLines = [0, 1, 2, 3, 4, 5].map(i => (i / 5) * chartHeight)

    return (
        <div className="relative w-full aspect-[8/3.2] min-h-[280px]">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g transform={`translate(${padding.left}, ${padding.top})`}>
                    {/* Grid lines */}
                    {gridLines.map((y, i) => (
                        <line
                            key={i}
                            x1={0}
                            y1={y}
                            x2={chartWidth}
                            y2={y}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}

                    {/* Area fill */}
                    <path d={areaPath} fill="url(#areaGradient)" />

                    {/* Main line */}
                    <path
                        d={smoothPath}
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow)"
                        className="transition-all duration-1000"
                    />

                    {/* Data points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={15}
                                fill="transparent"
                                onMouseEnter={() => setHoveredPoint(i)}
                                onMouseLeave={() => setHoveredPoint(null)}
                                className="cursor-pointer"
                            />
                            <circle
                                cx={p.x}
                                cy={p.y}
                                r={hoveredPoint === i ? 6 : 3}
                                fill="#10b981"
                                stroke="#0a0a0a"
                                strokeWidth="2"
                                className="transition-all duration-200"
                            />

                            {/* Tooltip */}
                            {hoveredPoint === i && (
                                <g className="pointer-events-none">
                                    <rect
                                        x={p.x - 40}
                                        y={p.y - 55}
                                        width={80}
                                        height={42}
                                        rx={12}
                                        fill="#0a0a0a"
                                        stroke="#10b981"
                                        strokeWidth="1.5"
                                        className="animate-fadeIn"
                                        filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                                    />
                                    <text
                                        x={p.x}
                                        y={p.y - 38}
                                        textAnchor="middle"
                                        fill="#10b981"
                                        fontSize="14"
                                        fontWeight="900"
                                    >
                                        {p.value}%
                                    </text>
                                    <text
                                        x={p.x}
                                        y={p.y - 25}
                                        textAnchor="middle"
                                        fill="rgba(255,255,255,0.4)"
                                        fontSize="10"
                                        fontWeight="500"
                                    >
                                        DAY {i + 1}
                                    </text>
                                </g>
                            )}
                        </g>
                    ))}

                    {/* Axis Labels */}
                    {points.filter((_, i) => i % 5 === 0 || i === points.length - 1).map((p, i) => (
                        <text
                            key={i}
                            x={p.x}
                            y={chartHeight + 25}
                            textAnchor="middle"
                            fill="rgba(255,255,255,0.3)"
                            fontSize="10"
                            fontWeight="bold"
                        >
                            D{p.index + 1}
                        </text>
                    ))}
                </g>
            </svg>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default function GamifiedDashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [showAchievementsCursor, setShowAchievementsCursor] = useState(false)
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
            setLoading(false)
        }
        getUser()
    }, [supabase.auth])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center animate-pulse">
                        <Sparkles className="h-6 w-6 text-black" />
                    </div>
                    <p className="text-white/40 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

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
        const [hovered, setHovered] = useState(false)
        const max = Math.max(...data)
        const min = Math.min(...data)
        const range = max - min || 1

        return (
            <div
                className="flex items-end gap-1 h-12 transition-all duration-300"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {data.map((value, i) => {
                    const height = ((value - min) / range) * 100
                    return (
                        <div key={i} className="flex-1 flex items-end group relative">
                            <div
                                className={`w-full bg-gradient-to-t from-${color}-500 to-${color}-400 rounded-t transition-all duration-300 cursor-pointer hover:brightness-150 hover:scale-y-110`}
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
            <GamifiedDashboardNav />

            {/* Premium Background with Green Gradient Glow */}
            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(16, 185, 129, 0.08), transparent 60%), #050505",
                }}
            />

            <main className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
                {/* Daily Briefing Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16 animate-fadeIn">
                    {/* Welcome & Live Progress */}
                    <StarBorder as="div" className="lg:col-span-2 block w-full relative group" innerClassName="h-full flex flex-col justify-center p-8 bg-black border-none">
                        <TargetCorners className="opacity-0 group-hover:opacity-100 transition-opacity" color="#10b981" />
                        <div className="flex items-center gap-8 relative z-10">
                            <div className="relative">
                                {/* Enhanced Profile Picture Space */}
                                <div className="relative shrink-0">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/10 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer">
                                        <div className="absolute inset-0 bg-emerald-500/5 group-hover/avatar:bg-emerald-500/10 transition-colors" />
                                        <div className="text-3xl font-black text-emerald-400 group-hover/avatar:scale-110 transition-transform duration-500">
                                            {userName.charAt(0)}
                                        </div>
                                        {/* Premium Glow Effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/20 to-transparent blur-xl opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    {/* Status Indicator */}
                                    <div className="absolute -bottom-1 -right-1 p-1 bg-[#0B0B0B] rounded-xl border border-white/5">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em]">{greeting}</span>
                                        </div>
                                        <div className="h-px w-8 bg-white/10" />
                                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Commander Profile</span>
                                    </div>
                                    <h1 className="text-5xl font-black tracking-tight text-white mb-2">
                                        {userName}
                                    </h1>
                                    <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        System Status: Optimal Performance
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group/badge">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover/badge:scale-110 transition-transform">
                                        <Trophy className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Current Title</p>
                                        <p className="text-sm font-bold text-white">{currentMilestone.title}</p>
                                    </div>
                                </div>

                                <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex items-center gap-3 hover:border-emerald-500/40 transition-all cursor-pointer group/badge">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover/badge:scale-110 transition-transform">
                                        <Crown className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Kairos Level</p>
                                        <p className="text-sm font-bold text-white">Level {userLevel}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* XP Bar Integrated in Welcome */}
                        <div className="mt-8 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white/40 uppercase tracking-widest">XP Progress to Level {userLevel + 1}</span>
                                <span className="text-xs font-black text-emerald-400">{currentXP} <span className="text-white/20">/</span> {nextLevelXP}</span>
                            </div>
                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 group-hover:border-emerald-500/20 transition-all">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 rounded-full relative transition-all duration-1000"
                                    style={{ width: `${xpProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                </div>
                            </div>
                        </div>
                    </StarBorder>

                    {/* Daily Missions / To-Do Panel */}
                    <StarBorder as="div" className="block w-full" innerClassName="h-full bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-6 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <Zap className="h-5 w-5 text-emerald-400" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight text-white/90">Daily Quests</h2>
                            </div>
                            <span className="text-[10px] font-black bg-white/5 px-2 py-1 rounded text-white/40 uppercase tracking-widest">+150 XP Potential</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: "Complete focus session", reward: "50 XP", done: true },
                                { title: "Log evening spending", reward: "30 XP", done: false },
                                { title: "Reach 80% habit completion", reward: "70 XP", done: false },
                            ].map((quest, i) => (
                                <div
                                    key={i}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group/quest ${quest.done
                                        ? "bg-emerald-500/5 border-emerald-500/20 opacity-60"
                                        : "bg-white/[0.02] border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-6 w-6 rounded-lg border flex items-center justify-center transition-all ${quest.done ? "bg-emerald-500 border-emerald-500" : "border-white/20 group-hover/quest:border-emerald-500"
                                            }`}>
                                            {quest.done && <CheckCircle2 className="h-3.5 w-3.5 text-black" />}
                                        </div>
                                        <span className={`text-sm font-medium ${quest.done ? "text-white/40 line-through" : "text-white/70"}`}>
                                            {quest.title}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold ${quest.done ? "text-emerald-500/50" : "text-emerald-500"}`}>
                                        +{quest.reward}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </StarBorder>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
                    {/* Monthly Analytics Chart */}
                    <StarBorder as="div" className="lg:col-span-2 block w-full" innerClassName="h-full bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-10 group overflow-hidden">
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:scale-110 transition-transform">
                                    <BarChart3 className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight">Performance Matrix</h2>
                                    <p className="text-white/40 text-sm">Real-time focus score trajectory</p>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Active Score</p>
                                <p className="text-4xl font-black text-emerald-400">{focusScore}%</p>
                            </div>
                        </div>

                        {/* Responsive Chart Container */}
                        <div className="relative w-full overflow-hidden flex justify-center">
                            <LineChart data={monthlyFocusScoreHistory} />
                        </div>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className="h-5 w-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Momentum</span>
                                </div>
                                <p className="text-3xl font-black text-emerald-400 flex items-center gap-2">
                                    <ArrowUp className="h-6 w-6" />
                                    36<span className="text-sm opacity-50">pts</span>
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-4">
                                    <Target className="h-5 w-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Peak</span>
                                </div>
                                <p className="text-3xl font-black text-white">
                                    {Math.max(...monthlyFocusScoreHistory)}%
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
                                <div className="flex items-center gap-3 mb-4">
                                    <Calendar className="h-5 w-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Avg</span>
                                </div>
                                <p className="text-3xl font-black text-white">
                                    {(monthlyFocusScoreHistory.reduce((a, b) => a + b, 0) / monthlyFocusScoreHistory.length).toFixed(0)}%
                                </p>
                            </div>
                        </div>

                        {nextMilestone && (
                            <div className="mt-10 p-8 bg-gradient-to-r from-emerald-500/10 via-green-500/5 to-transparent border border-emerald-500/20 rounded-2xl hover:border-emerald-500/40 transition-all group/next">
                                <div className="flex items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="p-3 rounded-xl bg-emerald-500/20">
                                            <Star className="h-6 w-6 text-emerald-400 group-hover/next:rotate-[144deg] transition-transform duration-1000" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-emerald-300">Objective: {nextMilestone.title}</p>
                                            <p className="text-xs text-white/40 font-medium">Earn {nextMilestone.score - focusScore} more points to promote</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-xl font-black text-emerald-400">{nextMilestone.score}%</p>
                                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Target</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </StarBorder>

                    <StarBorder as="div" className="lg:col-span-1 block w-full relative" innerClassName="h-full flex flex-col bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-6 group">
                        <TargetCorners className="opacity-0 group-hover:opacity-100 transition-opacity" color="#10b981" />
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                <Medal className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight">Ranks</h2>
                                <p className="text-emerald-400/40 text-[10px] font-bold uppercase tracking-widest">Path to mastery</p>
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {scoreMilestones.map((milestone) => {
                                const isUnlocked = focusScore >= milestone.score
                                const isCurrent = milestone.score === currentMilestone.score

                                return (
                                    <div
                                        key={milestone.score}
                                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden relative group/rank ${isCurrent
                                            ? `bg-emerald-500/10 border-emerald-500/30 shadow-xl shadow-emerald-500/5`
                                            : isUnlocked
                                                ? "bg-white/[0.02] border-white/5 hover:border-emerald-500/20"
                                                : "bg-white/[0.01] border-white/5 opacity-40 grayscale"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20'}`}>
                                                    {isUnlocked ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className={`font-bold text-sm tracking-tight ${isCurrent ? 'text-emerald-400' : 'text-white/80'}`}>
                                                        {milestone.title}
                                                    </p>
                                                    <p className="text-[10px] text-emerald-400/40 font-medium">{milestone.score}% Required</p>
                                                </div>
                                            </div>
                                            {isCurrent && (
                                                <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-tighter">Current</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </StarBorder>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Focus Score */}
                    <StarBorder as="div" className="block w-full" innerClassName="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-6 group cursor-pointer h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                                    <Target className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Focus Score</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <ArrowUp className="h-3 w-3" />
                                +13%
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-4xl font-bold text-emerald-400 mb-1">{focusScore}%</p>
                            <p className="text-white/30 text-xs">7-day average: 62%</p>
                        </div>

                        <div className="mb-2">
                            <p className="text-white/40 text-xs mb-2">Last 7 Days</p>
                            <MiniGraph data={focusScoreHistory} />
                        </div>
                    </StarBorder>

                    {/* Spending */}
                    <StarBorder as="div" className="block w-full" innerClassName="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-6 group cursor-pointer h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                                    <Wallet className="h-5 w-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Today's Spending</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                <ArrowDown className="h-3 w-3" />
                                -24%
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-4xl font-bold text-white mb-1">${todaySpending}</p>
                            <p className="text-white/30 text-xs text-emerald-400/60 font-medium">Budget: ${monthlyBudget}/month</p>
                        </div>

                        <div className="mb-2">
                            <p className="text-white/40 text-xs mb-2 text-emerald-400/40 font-bold uppercase tracking-widest text-[10px]">Daily Spending Trend</p>
                            <MiniGraph data={spendingHistory} />
                        </div>
                    </StarBorder>

                    {/* Habits */}
                    <StarBorder as="div" className="block w-full" innerClassName="bg-gradient-to-br from-[#111] to-[#0a0a0a] border-none p-6 group cursor-pointer h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                                    <Flame className="h-5 w-5 text-emerald-400 group-hover:scale-125 transition-transform" />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Habits</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                <Flame className="h-3 w-3 text-emerald-400" />
                                <span className="text-emerald-400">12 day streak</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-4xl font-bold text-white mb-1">
                                {completedHabits} <span className="text-emerald-400/30">/ {habits.length}</span>
                            </p>
                            <p className="text-emerald-400/40 text-[10px] font-black uppercase tracking-widest">{Math.round((completedHabits / habits.length) * 100)}% completion today</p>
                        </div>

                        <div className="mb-2">
                            <p className="text-white/40 text-xs mb-2 text-emerald-400/40 font-bold uppercase tracking-widest text-[10px]">Completion Trend</p>
                            <MiniGraph data={habitsHistory} />
                        </div>
                    </StarBorder>
                </div>

                {/* Achievements & Rewards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Achievements */}
                    <StarBorder
                        as="div"
                        className="block w-full relative group"
                        innerClassName="h-full flex flex-col bg-black border-none p-6 group cursor-pointer"
                        onMouseEnter={() => setShowAchievementsCursor(true)}
                        onMouseLeave={() => setShowAchievementsCursor(false)}
                    >
                        <TargetCorners className="opacity-0 group-hover:opacity-100 transition-opacity" color="#10b981" />
                        {showAchievementsCursor && <TargetCursor targetSelector=".achievement-card-target" />}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    <Trophy className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Achievements</h2>
                                    <p className="text-emerald-400/40 text-sm font-medium">{unlockedCount} of {achievements.length} unlocked</p>
                                </div>
                            </div>
                            <button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group">
                                View All
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`achievement-card-target relative p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] overflow-hidden ${achievement.unlocked
                                        ? "bg-gradient-to-br from-white/5 to-white/[0.02] border-white/10 hover:border-emerald-500/30"
                                        : "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-80"
                                        }`}
                                >
                                    {achievement.unlocked && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400 animate-scaleIn" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} bg-opacity-20 border ${achievement.unlocked ? "border-opacity-30" : "border-opacity-10"
                                            }`}>
                                            {achievement.unlocked ? (
                                                <achievement.icon className="h-5 w-5 text-white" />
                                            ) : (
                                                <Lock className="h-5 w-5 text-white/40" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-sm mb-0.5">{achievement.name}</h3>
                                            <p className="text-xs text-white/40">{achievement.description}</p>
                                        </div>
                                    </div>

                                    {!achievement.unlocked && (
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-white/40">Progress</span>
                                                <span className="text-xs font-medium text-white/60">
                                                    {achievement.progress} / {achievement.total}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} rounded-full transition-all duration-500`}
                                                    style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </StarBorder>

                    {/* Daily Rewards */}
                    <StarBorder as="div" className="block w-full" innerClassName="h-full flex flex-col bg-black border-none p-6 group cursor-pointer">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30">
                                <Gift className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Daily Rewards</h2>
                                <p className="text-emerald-400/40 text-sm font-medium">Claim your streaks!</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[
                                { day: 1, reward: "50 XP", claimed: true },
                                { day: 2, reward: "75 XP", claimed: true },
                                { day: 3, reward: "100 XP", claimed: true },
                                { day: 4, reward: "150 XP + Badge", claimed: false, current: true },
                                { day: 5, reward: "200 XP", claimed: false },
                                { day: 6, reward: "250 XP", claimed: false },
                                { day: 7, reward: "500 XP + Trophy", claimed: false, special: true },
                            ].map((item) => (
                                <div
                                    key={item.day}
                                    className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-[1.02] ${item.claimed
                                        ? "bg-emerald-500/10 border-emerald-500/30 opacity-60"
                                        : item.current
                                            ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/40 shadow-lg shadow-emerald-500/20"
                                            : item.special
                                                ? "bg-gradient-to-r from-emerald-500/30 to-green-500/30 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${item.claimed
                                                ? "bg-emerald-500/20 text-emerald-400"
                                                : item.current
                                                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-black"
                                                    : item.special
                                                        ? "bg-gradient-to-br from-yellow-500 to-orange-500 text-black"
                                                        : "bg-white/5 text-white/40"
                                                }`}>
                                                {item.day}
                                            </div>
                                            <span className={`text-sm font-medium ${item.current ? "text-white" : "text-white/60"
                                                }`}>
                                                {item.reward}
                                            </span>
                                        </div>
                                        {item.claimed ? (
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                        ) : item.current ? (
                                            <button className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-bold hover:bg-emerald-400 transition-all hover:scale-110 active:scale-95">
                                                Claim
                                            </button>
                                        ) : (
                                            <Lock className="h-4 w-4 text-white/20" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </StarBorder>
                </div>

                {/* Leaderboard */}
                <StarBorder as="div" className="block w-full relative group" innerClassName="bg-black border-none p-6 group cursor-pointer h-full">
                    <TargetCorners className="opacity-0 group-hover:opacity-100 transition-opacity" color="#10b981" />
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Leaderboard</h2>
                            <p className="text-emerald-400/40 text-sm font-medium">Top performers this week</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {[
                            { rank: 1, name: "Sarah K.", xp: "12,450", trend: "up", you: false },
                            { rank: 2, name: "Marcus V.", xp: "11,200", trend: "up", you: false },
                            { rank: 3, name: "Alex J.", xp: "10,800", trend: "down", you: false },
                            { rank: 4, name: "You", xp: "9,450", trend: "up", you: true },
                            { rank: 5, name: "Elena R.", xp: "8,900", trend: "down", you: false }
                        ].map((player) => (
                            <div
                                key={player.rank}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${player.you
                                    ? "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/40 shadow-lg"
                                    : "bg-white/[0.02] hover:bg-white/5"
                                    }`}
                            >
                                <div className="relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-2 ${player.rank === 1 ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" :
                                        player.rank === 2 ? "border-emerald-500/60 bg-emerald-500/5 text-emerald-400/60" :
                                            player.rank === 3 ? "border-emerald-500/40 bg-emerald-500/0 text-emerald-400/40" :
                                                "border-white/10 bg-white/5 text-white/40"
                                        }`}>
                                        {player.rank}
                                    </div>
                                    {player.rank <= 3 && (
                                        <Crown className={`absolute -top-2 -right-2 h-5 w-5 ${player.rank === 1 ? "text-emerald-400" :
                                            player.rank === 2 ? "text-emerald-400/60" : "text-emerald-400/40"
                                            }`} />
                                    )}
                                </div>
                                <span className={`font-bold text-sm ${player.you ? "text-emerald-400" : "text-emerald-400/80"}`}>{player.name}</span>
                                <div className="flex items-center gap-1">
                                    <Zap className="h-4 w-4 text-emerald-400/60" />
                                    <span className="font-bold text-sm text-emerald-400/80">{player.xp}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </StarBorder>
            </main >

            <AIChatbot />

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
        </div >
    )
}

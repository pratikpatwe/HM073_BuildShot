"use client"

import { useState, useEffect } from "react"
import { Zap, Trophy, Target, TrendingUp, Flame } from "lucide-react"

interface FocusScoreCardProps {
    score: number
}

export default function FocusScoreCard({ score }: FocusScoreCardProps) {
    const [displayScore, setDisplayScore] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        let start = 0
        const increment = score / 40
        const interval = setInterval(() => {
            start += increment
            if (start >= score) {
                setDisplayScore(score)
                clearInterval(interval)
            } else {
                setDisplayScore(Math.floor(start))
            }
        }, 16)
        return () => clearInterval(interval)
    }, [score])

    const circumference = 565
    const strokeDashoffset = circumference - (displayScore / 100) * circumference

    const getScoreLevel = (score: number) => {
        if (score >= 90) return { label: "Elite", color: "text-emerald-300", bg: "from-emerald-400 to-green-300" }
        if (score >= 75) return { label: "Strong", color: "text-emerald-400", bg: "from-emerald-500 to-green-400" }
        if (score >= 50) return { label: "Growing", color: "text-yellow-400", bg: "from-yellow-400 to-orange-400" }
        return { label: "Building", color: "text-orange-400", bg: "from-orange-400 to-red-400" }
    }

    const level = getScoreLevel(score)

    return (
        <div
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-emerald-500/10 p-8 transition-all duration-500 hover:border-emerald-500/30 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Subtle glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-emerald-500" />
                            <p className="text-white/60 text-sm font-medium tracking-wide">Daily Focus Score</p>
                        </div>
                        <h2 className="text-2xl font-bold text-white">How aligned is your day?</h2>
                    </div>
                    <div className={`p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 transition-all duration-300 ${isHovered ? "scale-110" : ""}`}>
                        <Zap className="h-5 w-5 text-emerald-400" />
                    </div>
                </div>

                {/* Score Circle */}
                <div className="flex items-center justify-center mb-8">
                    <div className="relative w-48 h-48">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="url(#scoreGradient)"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-300"
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#22c55e" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-5xl font-bold bg-gradient-to-r ${level.bg} bg-clip-text text-transparent`}>
                                {displayScore}
                            </span>
                            <span className="text-white/40 text-sm mt-1">/100</span>
                        </div>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: "Habits", value: "92%", trend: "up", icon: Flame },
                        { label: "Mood", value: "78%", trend: "stable", icon: TrendingUp },
                        { label: "Budget", value: "65%", trend: "down", icon: Target },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="bg-white/[0.02] hover:bg-emerald-500/5 rounded-xl p-4 border border-white/5 hover:border-emerald-500/20 transition-all duration-300 cursor-pointer group/card"
                        >
                            <div className="flex items-center gap-1.5 mb-2">
                                <item.icon className="h-3.5 w-3.5 text-white/40 group-hover/card:text-emerald-400 transition-colors" />
                                <p className="text-white/40 text-xs font-medium">{item.label}</p>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-xl font-bold ${item.trend === "up" ? "text-emerald-400" : item.trend === "down" ? "text-yellow-400" : "text-white/80"}`}>
                                    {item.value}
                                </span>
                                <span className="text-xs text-white/30">
                                    {item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "→"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Level Badge */}
                {score >= 75 && (
                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-emerald-400" />
                            <p className="text-emerald-400 font-semibold text-sm">Level: {level.label}</p>
                        </div>
                        <p className="text-white/50 text-xs">
                            You&apos;re performing above average. Keep this momentum going.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

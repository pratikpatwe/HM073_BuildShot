"use client"

import { useState } from "react"
import { Smile, TrendingUp, PenLine, Meh, Frown, Zap, Heart } from "lucide-react"

interface MoodCardProps {
    mood: {
        current: string
        trend: string
    }
}

const moodIcons: Record<string, { icon: typeof Smile; color: string; bg: string }> = {
    happy: { icon: Smile, color: "text-emerald-400", bg: "from-emerald-500/20 to-green-500/10" },
    neutral: { icon: Meh, color: "text-white/60", bg: "from-white/10 to-white/5" },
    sad: { icon: Frown, color: "text-blue-400", bg: "from-blue-500/20 to-blue-500/10" },
    energetic: { icon: Zap, color: "text-yellow-400", bg: "from-yellow-500/20 to-orange-500/10" },
}

export default function MoodCard({ mood }: MoodCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    const currentMood = moodIcons[mood.current] || moodIcons.neutral
    const MoodIcon = currentMood.icon

    return (
        <div
            className="rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-emerald-500/10 p-6 hover:border-emerald-500/20 transition-all duration-300 h-full flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Mood</h3>
                    <p className="text-white/40 text-xs font-medium">7-Day Trend</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 transition-all duration-300 ${isHovered ? "scale-110" : ""}`}>
                    <Heart className="h-5 w-5 text-emerald-400" />
                </div>
            </div>

            {/* Current Mood Display */}
            <div className={`mb-6 p-6 rounded-xl border-2 text-center transition-all duration-300 bg-gradient-to-br ${currentMood.bg} border-white/5 hover:border-emerald-500/20`}>
                <p className="text-white/40 text-xs mb-3">Today&apos;s Mood</p>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-3 transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>
                    <MoodIcon className={`h-8 w-8 ${currentMood.color}`} />
                </div>
                <p className={`text-sm font-bold capitalize ${currentMood.color}`}>
                    {mood.current}
                </p>
            </div>

            {/* Mood Trend */}
            <div className="mb-4 p-4 bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10 rounded-xl flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                    <p className="text-white/40 text-xs">Trend this week</p>
                    <p className="text-emerald-400 text-sm font-bold">
                        {mood.trend === "up" ? "Improving" : mood.trend === "down" ? "Declining" : "Stable"}
                    </p>
                </div>
            </div>

            {/* Last Journal Entry */}
            <div className="mb-4 p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all duration-300 flex-1">
                <p className="text-white/40 text-xs mb-2 font-medium">Last Entry</p>
                <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
                    &quot;Had a great day today. Accomplished my goals and felt motivated throughout.&quot;
                </p>
            </div>

            {/* Action Button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 font-medium group">
                <PenLine className="h-4 w-4" />
                <span>Write Journal</span>
            </button>
        </div>
    )
}

"use client"

import { Bell, Search, ChevronDown } from "lucide-react"

interface DashboardHeaderProps {
    userName?: string
    userAvatar?: string
}

export default function DashboardHeader({ userName = "Alex", userAvatar }: DashboardHeaderProps) {
    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening"

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B0B0B]/80 backdrop-blur-sm sticky top-0 z-20">
            {/* Left Side - Greeting */}
            <div>
                <p className="text-white/40 text-sm">{greeting},</p>
                <h1 className="text-xl font-bold text-white">{userName}</h1>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <button className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group">
                    <Search className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                </button>

                {/* Notifications */}
                <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group">
                    <Bell className="h-4 w-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
                </button>

                {/* User Menu */}
                <button className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group">
                    {userAvatar ? (
                        <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-lg object-cover" />
                    ) : (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-400">{userName.charAt(0)}</span>
                        </div>
                    )}
                    <ChevronDown className="h-3.5 w-3.5 text-white/40 group-hover:text-emerald-400 transition-colors" />
                </button>
            </div>
        </header>
    )
}

"use client"

import { Home, Target, Wallet, Flame, BookOpen, BarChart3, Settings, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const mainNavigation = [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: Target, label: "Focus Score", href: "/dashboard/focus" },
    { icon: Wallet, label: "Finances", href: "/dashboard/finances" },
    { icon: Flame, label: "Habits", href: "/dashboard/habits" },
    { icon: BookOpen, label: "Journal", href: "/dashboard/journal" },
]

const secondaryNavigation = [
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
]

interface SidebarProps {
    userName?: string
    userPlan?: string
}

export default function DashboardSidebar({ userName = "Alex Johnson", userPlan = "Free Plan" }: SidebarProps) {
    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen bg-[#0B0B0B] border-r border-white/5 flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-5 border-b border-white/5">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300">
                        <span className="text-black font-bold text-lg">K</span>
                    </div>
                    <span className="text-lg font-bold text-white">Kairos</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider px-3 mb-3">Main</p>
                {mainNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                                }`}
                        >
                            <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"}`} />
                            <span className="text-sm font-medium">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                        </Link>
                    )
                })}

                <div className="h-px bg-white/5 my-4" />

                <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider px-3 mb-3">Tools</p>
                {secondaryNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                                    : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                                }`}
                        >
                            <item.icon className={`h-4 w-4 ${isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"}`} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    )
                })}

                {/* AI Assistant Quick Access */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-white">Kairos AI</span>
                    </div>
                    <p className="text-white/40 text-xs mb-3">Get personalized insights and recommendations.</p>
                    <button className="w-full py-2 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors">
                        Ask AI
                    </button>
                </div>
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white/5">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">{userName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-white/40">{userPlan}</p>
                    </div>
                </div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 mt-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300">
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}

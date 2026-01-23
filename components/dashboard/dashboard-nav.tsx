"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Wallet,
    Calendar,
    Target,
    BarChart3,
    Settings,
    ChevronDown,
    Medal,
    Home,
    Menu,
    X,
    LogOut,
    BookOpen
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardNav() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isJournalOpen, setIsJournalOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: Home },
        { name: "Finance Tracker", href: "/finance", icon: Wallet },
        { name: "Habit Tracker", href: "/habits", icon: Target },
        { name: "Daily Journal", href: "/journal", icon: BookOpen },
    ]

    return (
        <nav className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
            <div className="bg-[#0B0B0B]/80 backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/5 rounded-full pl-4 pr-1.5 py-1.5">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/kairos-logo.svg" alt="Kairos" className="h-8 w-8 rounded-lg" />
                        <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent hidden sm:block">
                            Kairos
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${isActive
                                        ? "text-emerald-400"
                                        : "text-white/60 hover:text-emerald-400"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all text-sm font-medium cursor-pointer shadow-none"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-2 bg-[#0B0B0B]/95 backdrop-blur-md border border-emerald-500/20 rounded-2xl shadow-xl">
                    <div className="px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                        ? "bg-emerald-500/20 text-emerald-400"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            )
                        })}

                        <div className="pt-4 mt-4 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white/60 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all font-medium cursor-pointer shadow-none"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Dashboard() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [supabase.auth])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut({ scope: 'local' })
        if (error) {
            toast.error("Logout failed", {
                description: error.message,
            })
        } else {
            toast.success("Logged out successfully")
            router.push("/onboarding")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-8">
            <div className="flex flex-col items-center gap-8">
                {/* User Profile Image */}
                <div className="relative">
                    {user?.user_metadata?.avatar_url ? (
                        <img
                            src={user.user_metadata.avatar_url}
                            alt="Profile"
                            className="w-24 h-24 rounded-[32px] border border-white/10 object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-[32px] border border-white/10 bg-white/5 flex items-center justify-center text-3xl font-bold text-emerald-400">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Authenticated as</p>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                        {user?.user_metadata?.full_name ||
                            (user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim() : null) ||
                            'Kairos User'}
                    </h1>
                    <p className="text-emerald-400 text-base font-medium mb-6 opacity-80 tracking-wide">
                        {user?.email}
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 opacity-60">
                        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                            ID: {user?.id?.slice(0, 8)}...
                        </div>
                        <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            Provider: {user?.app_metadata?.provider || 'Email'}
                        </div>
                    </div>
                </div>

                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-white cursor-pointer px-10 rounded-2xl h-12 transition-all duration-300 font-medium"
                >
                    Log out
                </Button>
            </div>
        </div>
    )
}

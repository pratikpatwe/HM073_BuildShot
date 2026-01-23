"use client"

import UnifiedChatbot from "@/components/UnifiedChatbot"
import { usePathname } from "next/navigation"

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Determine the mode based on the current route
    const mode = pathname?.includes("/finance") ? "finance" : "general"

    return (
        <div className="relative min-h-screen">
            {children}
            <UnifiedChatbot mode={mode} />
        </div>
    )
}

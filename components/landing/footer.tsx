"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Mail } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

// Dynamically import TextPressure to avoid SSR issues
const TextPressure = dynamic(() => import("@/components/ui/text-pressure"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <span className="text-[80px] sm:text-[150px] font-bold text-[#0B0B0B] uppercase">Kairos</span>
        </div>
    ),
})

export function Footer() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <>

            {/* Sticky Footer with TextPressure Effect */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #00C853 0%, #1DB954 100%)"
                }}
            >
                <div className="container mx-auto px-4 pt-16 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start">
                        {/* Footer Links */}
                        <motion.div
                            className="flex flex-row space-x-12 sm:space-x-16 md:space-x-24 text-sm sm:text-lg mb-8 md:mb-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <ul className="space-y-2" style={{ color: "#0B0B0B" }}>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="#features">Features</Link>
                                </li>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/ai-ethics">AI & Ethics</Link>
                                </li>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/privacy">Privacy</Link>
                                </li>
                            </ul>
                            <ul className="space-y-2" style={{ color: "#0B0B0B" }}>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/contact">Contact</Link>
                                </li>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/onboarding?mode=signup">Sign Up</Link>
                                </li>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/onboarding">Login</Link>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* TextPressure Effect */}
                <div className="w-full h-[180px] sm:h-[240px] md:h-[300px] relative mt-6 mb-4 px-4 py-6">
                    <TextPressure
                        text="KAIROS"
                        textColor="#0B0B0B"
                        weight={true}
                        width={true}
                        italic={false}
                        alpha={false}
                        flex={true}
                        stroke={false}
                        scale={true}
                        minFontSize={60}
                        className="font-bold"
                    />
                </div>

                {/* Bottom bar */}
                <div className="w-full py-4 text-center" style={{ backgroundColor: "rgba(11, 11, 11, 0.1)" }}>
                    <p className="text-sm font-medium" style={{ color: "#0B0B0B" }}>
                        Act at the Right Moment • © 2026 Kairos
                    </p>
                </div>
            </div>
        </>
    )
}

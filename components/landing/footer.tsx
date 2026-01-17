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
            {/* Regular Footer */}
            <footer className="relative border-t border-white/10 py-16" ref={ref}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {/* Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                            className="md:col-span-2"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/kairos-logo.svg" alt="Kairos" className="h-10 w-10 rounded-lg" />
                                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                    Kairos
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-4 max-w-sm">
                                Act at the Right Moment. Your AI-powered life management platform for finances, habits, and well-being.
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>contact@kairos.app</span>
                            </div>
                        </motion.div>

                        {/* Product Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="#features" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#testimonials" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        Testimonials
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#faq" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        FAQ
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Legal Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/privacy" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        Terms of Service
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/ai-ethics" className="text-muted-foreground hover:text-emerald-400 transition-colors">
                                        AI & Ethics
                                    </Link>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    {/* Copyright */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground"
                    >
                        © 2026 Kairos. All rights reserved.
                    </motion.div>
                </div>
            </footer>

            {/* Sticky Footer with TextPressure Effect */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    background: "linear-gradient(135deg, #00C853 0%, #1DB954 100%)"
                }}
            >
                <div className="container mx-auto px-4 py-8">
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
                                    <Link href="/signup">Sign Up</Link>
                                </li>
                                <li className="hover:underline cursor-pointer transition-colors font-medium">
                                    <Link href="/login">Login</Link>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>

                {/* TextPressure Effect */}
                <div className="w-full h-[150px] sm:h-[200px] md:h-[250px] relative overflow-hidden">
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

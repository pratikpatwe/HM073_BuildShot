"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
    const [isLaunchHovered, setIsLaunchHovered] = useState(false)
    const [isHowHovered, setIsHowHovered] = useState(false)

    return (
        <>
            <section className="relative overflow-hidden min-h-screen flex flex-col">
                {/* Gradient background effects */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(0, 200, 83, 0.15), transparent 60%)",
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 right-0 h-1/2 z-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(29, 185, 84, 0.1), transparent 60%)",
                    }}
                />

                <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10 flex-1 flex flex-col">
                    <div className="mx-auto max-w-4xl text-center flex-1 flex flex-col justify-center">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                Act at the Right Moment
                            </Badge>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-8"
                        >
                            <h1 id="main-title" className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                                Act at the{" "}
                                <span
                                    className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 bg-clip-text text-transparent px-2 pb-2"
                                    style={{ fontFamily: "var(--font-great-vibes), cursive" }}
                                >
                                    Right Moment
                                </span>
                            </h1>
                        </motion.div>

                        {/* Description - max 2 rows */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="mx-auto mb-6 max-w-2xl text-xl text-muted-foreground leading-relaxed"
                        >
                            Kairos is an AI-powered life management platform that brings your finances, habits, and mental well-being into one intelligent system.
                        </motion.p>

                        {/* Supporting Line */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.25 }}
                            className="mx-auto mb-12 max-w-xl text-lg text-muted-foreground/80"
                        >
                            Track what matters, understand your patterns, and make better daily decisions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            {/* Primary CTA */}
                            <Link href="/signup">
                                <div
                                    className="group cursor-pointer border border-emerald-500/30 bg-gradient-to-r from-emerald-500 to-green-600 gap-2 h-[56px] flex items-center px-6 rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
                                    onMouseEnter={() => setIsLaunchHovered(true)}
                                    onMouseLeave={() => setIsLaunchHovered(false)}
                                >
                                    <p className="font-semibold tracking-tight text-white flex items-center gap-2 justify-center text-base">
                                        Get Started
                                    </p>
                                    <div className="relative w-5 h-5 overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 1, x: 0, y: 0 }}
                                            animate={{
                                                opacity: isLaunchHovered ? 0 : 1,
                                                x: isLaunchHovered ? 10 : 0,
                                                y: isLaunchHovered ? -10 : 0
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <ArrowRight className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0, x: -10, y: 10 }}
                                            animate={{
                                                opacity: isLaunchHovered ? 1 : 0,
                                                x: isLaunchHovered ? 0 : -10,
                                                y: isLaunchHovered ? 0 : 10
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <ArrowUpRight className="h-5 w-5 text-white" />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>

                            {/* Secondary CTA */}
                            <Link href="#features">
                                <div
                                    className="group cursor-pointer border border-border bg-secondary/50 backdrop-blur-sm gap-2 h-[56px] flex items-center px-6 rounded-full hover:bg-secondary/80 transition-all duration-300"
                                    onMouseEnter={() => setIsHowHovered(true)}
                                    onMouseLeave={() => setIsHowHovered(false)}
                                >
                                    <p className="font-medium tracking-tight text-foreground flex items-center gap-2 justify-center text-base">
                                        See How It Works
                                    </p>
                                    <div className="relative w-5 h-5 overflow-hidden">
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 1, x: 0, y: 0 }}
                                            animate={{
                                                opacity: isHowHovered ? 0 : 1,
                                                x: isHowHovered ? 10 : 0,
                                                y: isHowHovered ? -10 : 0
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                        </motion.div>
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0, x: -10, y: 10 }}
                                            animate={{
                                                opacity: isHowHovered ? 1 : 0,
                                                x: isHowHovered ? 0 : -10,
                                                y: isHowHovered ? 0 : 10
                                            }}
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                        >
                                            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                                        </motion.div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-16 flex items-center justify-center gap-2 text-muted-foreground"
                        >
                            <span className="text-sm">Aligned with</span>
                            <span className="text-sm font-medium text-emerald-400">SDG 3: Good Health and Well-Being</span>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    )
}

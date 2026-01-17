"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Heart, TrendingDown, Eye, Battery, Globe } from "lucide-react"
import TargetCursor from "@/components/ui/target-cursor"

const benefits = [
    {
        icon: Heart,
        text: "Build healthier habits",
    },
    {
        icon: TrendingDown,
        text: "Reduce financial stress",
    },
    {
        icon: Eye,
        text: "Improve self-awareness",
    },
    {
        icon: Battery,
        text: "Stay consistent without burnout",
    },
]

export default function WhyKairos() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const [showTargetCursor, setShowTargetCursor] = useState(false)

    return (
        <section
            className="relative overflow-hidden py-24 md:py-32"
            onMouseEnter={() => setShowTargetCursor(true)}
            onMouseLeave={() => setShowTargetCursor(false)}
        >
            {showTargetCursor && <TargetCursor targetSelector=".cursor-target" />}

            <div className="container mx-auto px-4" ref={ref}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6">
                            <Globe className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400 uppercase tracking-wide">Why Kairos</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Life isn't divided into apps —{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                so why should your data be?
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                            Kairos helps individuals take control of their well-being holistically.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.text}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className="cursor-target flex items-center gap-4 p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/5 to-transparent hover:from-emerald-500/10 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center shrink-0">
                                    <benefit.icon className="h-6 w-6 text-emerald-400" />
                                </div>
                                <span className="text-lg font-medium">{benefit.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="cursor-target inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald-500/30 bg-emerald-500/10"
                    >
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">3</span>
                        </div>
                        <span className="text-muted-foreground">
                            Aligned with <span className="text-emerald-400 font-medium">SDG 3: Good Health and Well-Being</span>
                        </span>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mt-6 text-muted-foreground"
                    >
                        Kairos focuses on long-term personal balance, not short-term productivity hacks.
                    </motion.p>
                </div>
            </div>
        </section>
    )
}

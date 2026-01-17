"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Bot, Zap, Layers, TrendingUp } from "lucide-react"

export default function AISection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section className="relative overflow-hidden py-24 md:py-32">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-950/10 to-background" />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6">
                            <Bot className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400 uppercase tracking-wide">AI at the Core</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            One AI.{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                                Multiple Contexts.
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Kairos is powered by a modular AI system that adapts to different life domains — finance, habits, mood, and productivity.
                        </p>
                    </motion.div>

                    {/* AI Visualization Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/10 to-transparent p-8 md:p-12"
                    >
                        {/* Glowing orb effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />

                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Adaptive Learning</h3>
                                <p className="text-sm text-muted-foreground">Learns from your behavior patterns</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30">
                                    <Layers className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Modular Architecture</h3>
                                <p className="text-sm text-muted-foreground">Grows with your needs</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-400/30">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Deeper Personalization</h3>
                                <p className="text-sm text-muted-foreground">Smarter insights over time</p>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="text-center text-muted-foreground mt-8 max-w-xl mx-auto"
                        >
                            As the platform grows, Kairos grows with it — enabling deeper personalization, smarter insights, and preventive guidance without changing the core experience.
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

"use client"

import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef } from "react"

const faqs = [
    {
        question: "What is Kairos?",
        answer: "Kairos is an AI-powered platform that helps you manage finances, habits, and mental well-being from one unified dashboard. It brings together the tools you need to make better daily decisions.",
    },
    {
        question: "Is Kairos a medical or financial advisory tool?",
        answer: "No. Kairos provides insights and awareness, not diagnoses or professional advice. It's designed to help you understand your patterns and make more informed personal decisions.",
    },
    {
        question: "How does the AI work?",
        answer: "Kairos uses a context-aware AI system that analyzes user activity and provides explainable guidance based on behavior patterns. The AI adapts to different life domains like finance, habits, and mood.",
    },
    {
        question: "Is my data private?",
        answer: "Yes. User data is private, secure, and fully controlled by the user. We take data privacy seriously and ensure your personal information is protected.",
    },
    {
        question: "Can Kairos scale beyond this version?",
        answer: "Absolutely. Kairos is built with modular architecture, allowing future expansion into deeper analytics, coaching, and integrations. The platform is designed to grow with your needs.",
    },
]

export function FAQSection() {
    const [openItems, setOpenItems] = useState<number[]>([])
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    const toggleItem = (index: number) => {
        setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
    }

    return (
        <section id="faq" className="relative overflow-hidden py-24 md:py-32" ref={ref}>
            {/* Background blur effects */}
            <div className="absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6">
                        <HelpCircle className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 uppercase tracking-wide">FAQs</span>
                    </div>
                </motion.div>

                <motion.h2
                    className="mx-auto mt-2 max-w-xl text-center text-4xl md:text-5xl font-bold mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Questions? We've got{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                        answers
                    </span>
                </motion.h2>

                <div className="mx-auto max-w-2xl flex flex-col gap-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/5 to-transparent p-6 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleItem(index)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    toggleItem(index)
                                }
                            }}
                        >
                            <div className="flex items-start justify-between">
                                <h3 className="font-semibold pr-4 text-lg">{faq.question}</h3>
                                <motion.div
                                    animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="shrink-0"
                                >
                                    {openItems.includes(index) ? (
                                        <Minus className="text-emerald-400 h-5 w-5" />
                                    ) : (
                                        <Plus className="text-emerald-400 h-5 w-5" />
                                    )}
                                </motion.div>
                            </div>
                            <AnimatePresence>
                                {openItems.includes(index) && (
                                    <motion.div
                                        className="mt-4 text-muted-foreground leading-relaxed overflow-hidden"
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut",
                                            opacity: { duration: 0.2 },
                                        }}
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

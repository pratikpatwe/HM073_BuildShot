"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Quote, Star } from "lucide-react"

const testimonials = [
    {
        quote: "Kairos helped me see how my spending habits affected my mood and focus. It's not just tracking — it actually makes you think.",
        author: "Early User",
        role: "Beta Tester",
    },
    {
        quote: "The AI feels surprisingly personal. It explains patterns instead of throwing numbers at you.",
        author: "Beta Tester",
        role: "Early Adopter",
    },
    {
        quote: "For the first time, everything feels connected in one place.",
        author: "Student User",
        role: "Beta Tester",
    },
]

export default function Testimonials() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section id="testimonials" className="relative overflow-hidden py-24 md:py-32">
            {/* Background effects */}
            <div className="absolute top-1/2 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -left-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10" ref={ref}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 mb-6">
                        <Star className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 uppercase tracking-wide">Testimonials</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        What our{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                            users say
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Early feedback from our beta testers has been incredibly positive.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-emerald-500/10 to-transparent p-8 hover:border-emerald-500/30 transition-all duration-300"
                        >
                            <Quote className="h-8 w-8 text-emerald-500/30 mb-4" />
                            <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {testimonial.author.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{testimonial.author}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>

                            {/* Beta badge */}
                            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                <span className="text-xs text-emerald-400">Beta</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

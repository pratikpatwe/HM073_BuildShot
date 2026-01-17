"use client"

import type React from "react"

import Earth from "@/components/ui/globe"
import ScrambleHover from "@/components/ui/scramble"
import { FollowerPointerCard } from "@/components/ui/following-pointer"
import { motion, useInView } from "framer-motion"
import { Suspense, useRef, useState } from "react"
import { geist } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Brain, LayoutDashboard, Wallet, TrendingUp, Heart, Target, PiggyBank, LineChart, Lightbulb, RotateCcw, Smile, BookOpen } from "lucide-react"

export default function Features() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const [isHovering, setIsHovering] = useState(false)
    const [isCliHovering, setIsCliHovering] = useState(false)
    const [isFeature3Hovering, setIsFeature3Hovering] = useState(false)
    const [isFeature4Hovering, setIsFeature4Hovering] = useState(false)
    const [inputValue, setInputValue] = useState("")

    // Kairos green colors
    const [baseColor] = useState<[number, number, number]>([0, 0.78, 0.33])
    const [glowColor] = useState<[number, number, number]>([0.11, 0.73, 0.35])
    const [dark] = useState<number>(1)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            setInputValue("")
        }
    }

    return (
        <section id="features" className="text-foreground relative overflow-hidden py-12 sm:py-24 md:py-32">
            <div className="bg-emerald-500 absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 rounded-full opacity-30 blur-3xl select-none"></div>
            <div className="via-emerald-500/50 absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent transition-all ease-in-out"></div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="container mx-auto flex flex-col items-center gap-6 sm:gap-12"
            >
                <h2
                    className={cn(
                        "via-foreground mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px]",
                        geist.className,
                    )}
                >
                    Everything you need to <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">thrive</span>
                </h2>
                <FollowerPointerCard
                    title={
                        <div className="flex items-center gap-2">
                            <span>Kairos Features</span>
                        </div>
                    }
                >
                    <div className="cursor-none">
                        <div className="grid grid-cols-12 gap-4 justify-center">
                            {/* Context-Aware AI Assistant */}
                            <motion.div
                                className="group border-emerald-500/20 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-2"
                                onMouseEnter={() => setIsCliHovering(true)}
                                onMouseLeave={() => setIsCliHovering(false)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "rgba(16, 185, 129, 0.6)",
                                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
                                }}
                                style={{ transition: "all 0s ease-in-out" }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <Brain className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl leading-none font-semibold tracking-tight">Context-Aware AI Assistant</h3>
                                    </div>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            A fine-tuned AI chatbot that understands your actions in real time — adapting guidance based on context, not templates.
                                        </p>
                                    </div>
                                </div>
                                <div className="pointer-events-none flex grow items-center justify-center select-none relative">
                                    <div
                                        className="relative w-full h-[400px] rounded-xl overflow-hidden"
                                        style={{ borderRadius: "20px" }}
                                    >
                                        {/* Background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-black/50 rounded-xl"></div>

                                        {/* Animated SVG Connecting Lines */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={isCliHovering ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <svg width="100%" height="100%" viewBox="0 0 121 94" className="absolute">
                                                <motion.path
                                                    d="M 60.688 1.59 L 60.688 92.449 M 60.688 92.449 L 119.368 92.449 M 60.688 92.449 L 1.414 92.449"
                                                    stroke="rgba(16, 185, 129, 0.5)"
                                                    fill="transparent"
                                                    strokeDasharray="2 2"
                                                    initial={{ pathLength: 0 }}
                                                    animate={isCliHovering ? { pathLength: 1 } : { pathLength: 0 }}
                                                    transition={{
                                                        duration: 2,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            </svg>
                                            <svg width="100%" height="100%" viewBox="0 0 121 94" className="absolute">
                                                <motion.path
                                                    d="M 60.688 92.449 L 60.688 1.59 M 60.688 1.59 L 119.368 1.59 M 60.688 1.59 L 1.414 1.59"
                                                    stroke="rgba(16, 185, 129, 0.5)"
                                                    fill="transparent"
                                                    strokeDasharray="2 2"
                                                    initial={{ pathLength: 0 }}
                                                    animate={isCliHovering ? { pathLength: 1 } : { pathLength: 0 }}
                                                    transition={{
                                                        duration: 2,
                                                        delay: 0.5,
                                                        ease: "easeInOut",
                                                    }}
                                                />
                                            </svg>
                                        </motion.div>

                                        {/* Animated Green Blur Effect */}
                                        <motion.div
                                            className="absolute top-1/2 left-1/2 w-16 h-16 bg-emerald-500 rounded-full blur-[74px] opacity-65 transform -translate-x-1/2 -translate-y-1/2"
                                            initial={{ scale: 1 }}
                                            animate={isCliHovering ? { scale: [1, 1.342, 1, 1.342] } : { scale: 1 }}
                                            transition={{
                                                duration: 3,
                                                ease: "easeInOut",
                                                repeat: isCliHovering ? Number.POSITIVE_INFINITY : 0,
                                                repeatType: "loop",
                                            }}
                                        />

                                        {/* Main Content Container with Staggered Animations */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex items-center gap-8">
                                                {/* Left Column - Finance Features */}
                                                <div className="flex flex-col gap-3">
                                                    {[
                                                        { icon: Wallet, label: "Expenses" },
                                                        { icon: PiggyBank, label: "Budgets" },
                                                        { icon: Lightbulb, label: "Insights" },
                                                    ].map((item, index) => (
                                                        <motion.div
                                                            key={`left-${index}`}
                                                            className="bg-white rounded px-3 py-2 flex items-center gap-2 text-black text-sm font-medium shadow-sm"
                                                            initial={{ opacity: 1, x: 0 }}
                                                            animate={isCliHovering ? { x: [-20, 0] } : { x: 0 }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: index * 0.1,
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            <item.icon className="h-4 w-4 text-emerald-600" />
                                                            {item.label}
                                                        </motion.div>
                                                    ))}
                                                </div>

                                                {/* Center Logo */}
                                                <motion.div
                                                    className="w-16 h-16 border border-emerald-500/30 rounded-lg overflow-hidden shadow-lg bg-[#0B0B0B] flex items-center justify-center"
                                                    initial={{ opacity: 1, scale: 1 }}
                                                    animate={isCliHovering ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                                >
                                                    <img
                                                        src="/kairos-logo.svg"
                                                        alt="Kairos"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </motion.div>

                                                {/* Right Column - Life Features */}
                                                <div className="flex flex-col gap-3">
                                                    {[
                                                        { icon: RotateCcw, label: "Habits" },
                                                        { icon: Smile, label: "Mood" },
                                                        { icon: BookOpen, label: "Journal" },
                                                    ].map((item, index) => (
                                                        <motion.div
                                                            key={`right-${index}`}
                                                            className="bg-white rounded px-3 py-2 flex items-center gap-2 text-black text-sm font-medium shadow-sm"
                                                            initial={{ opacity: 1, x: 0 }}
                                                            animate={isCliHovering ? { x: [20, 0] } : { x: 0 }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: index * 0.1,
                                                            }}
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            <item.icon className="h-4 w-4 text-emerald-600" />
                                                            {item.label}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Animated Circular Border */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            initial={{ opacity: 0 }}
                                            animate={isCliHovering ? { opacity: 1 } : { opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <svg width="350" height="350" viewBox="0 0 350 350" className="opacity-40">
                                                <motion.path
                                                    d="M 175 1.159 C 271.01 1.159 348.841 78.99 348.841 175 C 348.841 271.01 271.01 348.841 175 348.841 C 78.99 348.841 1.159 271.01 1.159 175 C 1.159 78.99 78.99 1.159 175 1.159 Z"
                                                    stroke="rgba(16, 185, 129, 0.38)"
                                                    strokeWidth="1.16"
                                                    fill="transparent"
                                                    strokeDasharray="4 4"
                                                    initial={{ pathLength: 0, rotate: 0 }}
                                                    animate={isCliHovering ? { pathLength: 1, rotate: 360 } : { pathLength: 0, rotate: 0 }}
                                                    transition={{
                                                        pathLength: { duration: 3, ease: "easeInOut" },
                                                        rotate: {
                                                            duration: 20,
                                                            repeat: isCliHovering ? Number.POSITIVE_INFINITY : 0,
                                                            ease: "linear",
                                                        },
                                                    }}
                                                />
                                            </svg>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Unified Life Dashboard */}
                            <motion.div
                                className="group border-emerald-500/20 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-8"
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "rgba(16, 185, 129, 0.6)",
                                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
                                }}
                                style={{ transition: "all 0s ease-in-out" }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <LayoutDashboard className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl leading-none font-semibold tracking-tight">Unified Life Dashboard</h3>
                                    </div>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            A single dashboard that connects money, habits, and mental health — so nothing lives in isolation.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex min-h-[300px] grow items-start justify-center select-none">
                                    <h1 className="mt-8 text-center text-5xl leading-[100%] font-semibold sm:leading-normal lg:mt-12 lg:text-6xl">
                                        <span className='bg-background relative mt-3 inline-block w-fit rounded-md border border-emerald-500/30 px-1.5 py-0.5'>
                                            <ScrambleHover
                                                text="KAIROS"
                                                scrambleSpeed={70}
                                                maxIterations={20}
                                                useOriginalCharsOnly={false}
                                                className="cursor-pointer bg-gradient-to-t from-emerald-400 to-green-500 bg-clip-text text-transparent"
                                                isHovering={isHovering}
                                                setIsHovering={setIsHovering}
                                                characters="abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+-=[]{}|;':,.<>?"
                                            />
                                        </span>
                                    </h1>
                                    <div className="absolute top-64 z-10 flex items-center justify-center">
                                        <div className="w-[400px] h-[400px]">
                                            <Suspense
                                                fallback={
                                                    <div className="bg-emerald-500/20 h-[400px] w-[400px] animate-pulse rounded-full"></div>
                                                }
                                            >
                                                <Earth baseColor={baseColor} markerColor={[1, 1, 1]} glowColor={glowColor} dark={dark} />
                                            </Suspense>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 w-full translate-y-20 scale-x-[1.2] opacity-70 transition-all duration-1000 group-hover:translate-y-8 group-hover:opacity-100">
                                        <div className="from-emerald-500/50 to-emerald-500/0 absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[512px] dark:opacity-100"></div>
                                        <div className="from-emerald-500/30 to-emerald-500/0 absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-200 rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[256px] dark:opacity-100"></div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Smart Finance Tracking */}
                            <motion.div
                                className="group border-emerald-500/20 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-2"
                                onMouseEnter={() => setIsFeature3Hovering(true)}
                                onMouseLeave={() => setIsFeature3Hovering(false)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: "rgba(16, 185, 129, 0.5)",
                                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.2)",
                                }}
                                style={{ transition: "all 0s ease-in-out" }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <LineChart className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl leading-none font-semibold tracking-tight">Smart Finance Tracking</h3>
                                    </div>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            Track income and expenses effortlessly with visual budgets. Kairos helps you understand why you spend — not just where.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex grow items-center justify-center select-none relative min-h-[300px] p-4">
                                    <div className="w-full max-w-lg">
                                        <div className="relative rounded-2xl border border-emerald-500/20 bg-black/20 dark:bg-white/5 backdrop-blur-sm">
                                            <div className="p-4">
                                                <textarea
                                                    className="w-full min-h-[100px] bg-transparent border-none text-white placeholder:text-white/50 resize-none focus:outline-none text-base leading-relaxed"
                                                    placeholder="Ask about your spending patterns..."
                                                    value={inputValue}
                                                    onChange={(e) => setInputValue(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between px-4 pb-4">
                                                <div className="flex items-center gap-3">
                                                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-white/70"
                                                        >
                                                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                                                        </svg>
                                                    </button>
                                                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-colors text-white font-medium">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <circle cx="12" cy="12" r="10"></circle>
                                                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                                                            <path d="M2 12h20"></path>
                                                        </svg>
                                                        Analyze
                                                    </button>
                                                </div>
                                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-white/70"
                                                    >
                                                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                                                        <path d="M22 2 11 13"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Habit & Mood Tracking */}
                            <motion.div
                                className="group border-emerald-500/20 text-card-foreground relative col-span-12 flex flex-col overflow-hidden rounded-xl border-2 p-6 shadow-xl transition-all ease-in-out md:col-span-6 xl:col-span-6 xl:col-start-8"
                                onMouseEnter={() => setIsFeature4Hovering(true)}
                                onMouseLeave={() => setIsFeature4Hovering(false)}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                                transition={{ duration: 0.5, delay: 1.0 }}
                                whileHover={{
                                    rotateY: 5,
                                    rotateX: 2,
                                    boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                                    borderColor: "rgba(16, 185, 129, 0.6)",
                                }}
                                style={{ transition: "all 0s ease-in-out" }}
                            >
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <Target className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <h3 className="text-2xl leading-none font-semibold tracking-tight">Habit & Mood Intelligence</h3>
                                    </div>
                                    <div className="text-md text-muted-foreground flex flex-col gap-2 text-sm">
                                        <p className="max-w-[460px]">
                                            Create habits, track consistency, and visualize progress. See emotional trends and understand how they connect to your routines.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex grow items-center justify-center select-none relative min-h-[300px] p-4">
                                    <div className="relative w-full max-w-sm">
                                        {/* Habit tracker visualization */}
                                        <div className="grid grid-cols-7 gap-2 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                            {Array.from({ length: 28 }).map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    className={`w-8 h-8 rounded-md ${(i * 13) % 10 > 3
                                                        ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                                                        : 'bg-white/10'
                                                        }`}
                                                    initial={{ scale: 0 }}
                                                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                                                    transition={{ duration: 0.3, delay: 1.2 + i * 0.02 }}
                                                    whileHover={{ scale: 1.2 }}
                                                />
                                            ))}
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none"></div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </FollowerPointerCard>
            </motion.div>
        </section>
    )
}

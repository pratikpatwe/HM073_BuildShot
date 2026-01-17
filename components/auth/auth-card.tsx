"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface AuthCardProps {
    isLoading: boolean
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    rememberMe: boolean
    setRememberMe: (remember: boolean) => void
    firstName: string
    setFirstName: (name: string) => void
    lastName: string
    setLastName: (name: string) => void
    onSignIn: (e: React.FormEvent) => void
    onSignUp: (e: React.FormEvent) => void
    onSocialLogin: (provider: string) => void
    onForgotPassword: () => void
    activeTab: string
    setActiveTab: (tab: string) => void
}

export function AuthCard({
    isLoading,
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    onSignIn,
    onSignUp,
    onSocialLogin,
    onForgotPassword,
    activeTab,
    setActiveTab,
}: AuthCardProps) {
    const [showPassword, setShowPassword] = useState(false)

    const handleRedirect = () => {
        window.open("https://www.youtube.com/@diecastbydollarall", "_blank")
    }

    return (
        <div className="w-full max-w-md mx-auto relative z-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[32px] p-6 shadow-2xl overflow-hidden"
            >
                {/* Switcher Tab */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex bg-black/30 backdrop-blur-sm rounded-full p-1 border border-white/10 relative">
                        <button
                            onClick={() => setActiveTab("signup")}
                            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 cursor-pointer ${activeTab === "signup" ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                        >
                            {activeTab === "signup" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">Sign up</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("signin")}
                            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 z-10 cursor-pointer ${activeTab === "signin" ? "text-white" : "text-white/60 hover:text-white"
                                }`}
                        >
                            {activeTab === "signin" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">Sign in</span>
                        </button>
                    </div>
                    <Link href="/" className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10 hover:bg-black/40 transition-all duration-200 cursor-pointer">
                        <Home className="w-5 h-5 text-white/80" />
                    </Link>
                </div>

                <h1 className="text-2xl font-normal text-white mb-6">
                    {activeTab === "signup" ? "Create an account" : "Welcome back"}
                </h1>

                {/* Google Button */}
                <div className="flex flex-col gap-3 mb-6">
                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onSocialLogin("Google")}
                        className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 flex items-center justify-center gap-3 transition-all duration-300 text-white font-medium cursor-pointer"
                    >
                        <img src="/google.svg" alt="Google" className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </motion.button>
                </div>

                {/* Divider */}
                <div className="flex items-center mb-6">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="px-4 text-white/40 text-[10px] sm:text-xs font-semibold tracking-wider">
                        OR CONTINUE WITH EMAIL
                    </span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <div className="relative">
                    <AnimatePresence mode="wait">
                        {activeTab === "signup" ? (
                            <motion.div
                                key="signup"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        onSignUp(e)
                                    }}
                                    className="space-y-3"
                                    noValidate
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 text-base"
                                            placeholder="First name"
                                        />
                                        <Input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 text-base"
                                            placeholder="Last name"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 pl-12 text-base autofill:shadow-[0_0_0_1000px_#0b0b0b_inset]"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 pl-12 pr-12 text-base autofill:shadow-[0_0_0_1000px_#0b0b0b_inset] transition-all duration-200"
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 cursor-pointer z-10"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-12 mt-4 text-base cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Creating account..." : "Create an account"}
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signin"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        onSignIn(e)
                                    }}
                                    className="space-y-3"
                                    noValidate
                                >
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 pl-12 text-base autofill:shadow-[0_0_0_1000px_#0b0b0b_inset]"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl h-12 text-white placeholder:text-white/40 focus:border-white/30 pl-12 pr-12 text-base autofill:shadow-[0_0_0_1000px_#0b0b0b_inset] transition-all duration-200"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 cursor-pointer z-10"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <button
                                            type="button"
                                            onClick={onForgotPassword}
                                            className="text-white/60 hover:text-white text-sm cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 text-white font-medium rounded-2xl h-12 mt-4 text-base cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Signing in..." : "Sign in"}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-center text-white/40 text-xs mt-4">
                    {activeTab === "signup"
                        ? "By creating an account, you agree to our Terms & Service"
                        : "By signing in, you agree to our Terms & Service"}
                </p>
            </motion.div>
        </div>
    )
}

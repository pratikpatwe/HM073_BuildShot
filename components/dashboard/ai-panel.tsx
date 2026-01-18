"use client"

import { useState } from "react"
import { Bot, Send, Sparkles } from "lucide-react"

export default function AIPanel() {
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 1500)
        setInput("")
    }

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border border-emerald-500/10 p-6 flex flex-col h-full hover:border-emerald-500/20 transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10">
                        <Sparkles className="h-4 w-4 text-emerald-400" />
                    </div>
                    Kairos AI
                </h3>
                <div className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Online</span>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 mb-4 space-y-3 min-h-[180px] overflow-y-auto">
                {/* AI Message */}
                <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div className="bg-white/[0.03] rounded-xl rounded-tl-sm p-3 border border-white/5 flex-1">
                        <p className="text-white/70 text-sm leading-relaxed">
                            Your focus score is strong today! You&apos;ve completed 2 out of 3 habits. Keep up the momentum!
                        </p>
                    </div>
                </div>

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <div className="bg-white/[0.03] rounded-xl rounded-tl-sm p-3 border border-white/5">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Suggested Questions */}
                <div className="pt-2">
                    <p className="text-white/30 text-xs mb-2 font-medium">Quick questions:</p>
                    <div className="space-y-2">
                        <button className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-white/60 hover:text-white/80 text-sm">
                            Why is my focus score lower today?
                        </button>
                        <button className="w-full text-left p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 text-white/60 hover:text-white/80 text-sm">
                            What should I focus on now?
                        </button>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask Kairos..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/40 transition-colors"
                />
                <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 transition-colors flex items-center justify-center font-medium"
                >
                    <Send className="h-4 w-4" />
                </button>
            </form>
        </div>
    )
}

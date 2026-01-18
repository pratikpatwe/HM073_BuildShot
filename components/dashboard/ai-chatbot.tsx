"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, X, Sparkles, Minimize2 } from "lucide-react"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: "Hi! I'm Kairos AI. I can help you understand your patterns, give insights about your spending, habits, and mood. What would you like to know?"
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input
        }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "Based on your spending patterns, you tend to spend more on weekends. Consider setting a weekend budget limit.",
                "Your habit streak for exercise is strong! Keep it up. Consistency is key to lasting change.",
                "I notice your mood tends to be better on days when you complete your morning routine. That's a great insight!",
                "Your focus score has improved 15% this week. The meditation habit seems to be helping.",
            ]
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: responses[Math.floor(Math.random() * responses.length)]
            }
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
        }, 1500)
    }

    const quickQuestions = [
        "Why is my focus score low today?",
        "How can I improve my habits?",
        "Analyze my spending this week"
    ]

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
                <Sparkles className="h-6 w-6 text-black group-hover:rotate-12 transition-transform" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </button>
        )
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isMinimized ? "w-72" : "w-96"}`}>
            {/* Chat Window */}
            <div className="bg-[#0f0f0f] border border-emerald-500/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-black" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">Kairos AI</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-emerald-400 text-xs">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                        >
                            <Minimize2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {!isMinimized && (
                    <>
                        {/* Messages */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    {message.role === "assistant" && (
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                            <Bot className="h-4 w-4 text-emerald-400" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.role === "user"
                                                ? "bg-emerald-500 text-black rounded-br-sm"
                                                : "bg-white/5 text-white/80 rounded-bl-sm border border-white/5"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div className="bg-white/5 rounded-2xl rounded-bl-sm px-4 py-3 border border-white/5">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-emerald-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        {messages.length === 1 && (
                            <div className="px-4 pb-2">
                                <p className="text-white/30 text-xs mb-2">Quick questions:</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setInput(q)}
                                            className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask Kairos AI..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/40 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

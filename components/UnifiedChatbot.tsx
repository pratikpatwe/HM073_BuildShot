"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, Maximize2, Minimize2, Plus, MessageSquare, History, User } from "lucide-react"
import { ChatBubbleBottomCenterTextIcon, MicrophoneIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
}

interface UnifiedChatbotProps {
    mode?: "finance" | "general"
    initialMessage?: string
}

export default function UnifiedChatbot({
    mode = "general",
    initialMessage
}: UnifiedChatbotProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [input, setInput] = useState("")

    const defaultMessages: Record<string, string> = {
        general: "Hi! I'm Kairos AI. I can help you understand your patterns, give insights about your spending, habits, and mood. What would you like to know?",
        finance: "Hi! I'm Kairos AI, your personal financial assistant. I can help you analyze your spending, identify trends, and provide insights on your accounts. How can I assist you today?"
    }

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: initialMessage || defaultMessages[mode] || defaultMessages.general
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isTyping) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    mode: mode
                }),
            });

            const data = await response.json();

            if (data.response) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response
                };
                setMessages(prev => [...prev, aiMessage]);
            } else {
                // Fallback for mock/simulation if general endpoint doesn't exist yet
                if (mode === "general") {
                    throw new Error("Simulate General Response");
                }
                throw new Error(data.error || 'Failed to get response');
            }
        } catch (error) {
            if (mode === "general") {
                // Simulation for general mode if API isn't ready
                setTimeout(() => {
                    const responses = [
                        "I've analyzed your recent habit streaks. You're most consistent with morning routines!",
                        "Looking at your mood logs, there's a strong correlation between exercise and positive energy.",
                        "Your productivity peaks in the late afternoon. Consider scheduling focus time then.",
                        "You've completed 80% of your habits this week. Great progress!"
                    ];
                    const aiMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: responses[Math.floor(Math.random() * responses.length)]
                    };
                    setMessages(prev => [...prev, aiMessage]);
                    setIsTyping(false);
                }, 1000);
            } else {
                console.error('Chat error:', error);
                const errorMessage: Message = {
                    id: (Date.now() + 2).toString(),
                    role: "assistant",
                    content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
                };
                setMessages(prev => [...prev, errorMessage]);
                setIsTyping(false);
            }
        } finally {
            if (mode !== "general") setIsTyping(false);
        }
    }

    const quickQuestions = mode === "finance" ? [
        "Analyze my spending this week",
        "What is my total balance?",
        "Show me my top categories",
        "Any savings tips for me?"
    ] : [
        "Why is my focus score low?",
        "How can I improve my habits?",
        "Analyze my productivity this week",
        "Give me a daily tip"
    ];

    const triggerButton = (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center cursor-pointer group"
        >
            <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-black group-hover:rotate-12 transition-transform" />
        </motion.button>
    )

    if (!isOpen) return triggerButton

    if (isExpanded) {
        return (
            <>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setIsExpanded(false)}
                    className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="fixed inset-4 md:inset-10 z-[100] bg-[#0b0b0b] flex overflow-hidden rounded-3xl border border-emerald-500/20 shadow-2xl shadow-black/80"
                >
                    {/* ChatGPT Style Sidebar */}
                    <div className="w-64 bg-[#0d0d0d] border-r border-white/5 hidden md:flex flex-col p-3">
                        <button className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white text-sm mb-4">
                            <Plus className="h-4 w-4" />
                            New Chat
                        </button>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-4 px-2">History</div>
                            <button className="flex items-center gap-3 w-full p-2.5 rounded-lg bg-white/5 text-white text-sm text-left truncate group border border-emerald-500/20">
                                <MessageSquare className="h-4 w-4 text-emerald-400" />
                                {mode === "finance" ? "Financial Analysis" : "Life Insights"}
                            </button>
                            <button className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/5 text-white/60 text-sm text-left truncate group">
                                <History className="h-4 w-4" />
                                Previous Session
                            </button>
                        </div>

                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col relative h-full">
                        {/* Header */}
                        <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0b0b0b]/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-white/40 text-sm">Kairos AI</span>
                                <span className="text-white/20">/</span>
                                <span className="text-white font-medium text-sm">
                                    {mode === "finance" ? "Financial Mode" : "Universal Mode"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                                    title="Collapse"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </header>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                                {messages.map((message) => (
                                    <div key={message.id} className="group">
                                        <div className={`flex gap-4 md:gap-6 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                            {message.role === 'assistant' && (
                                                <div className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-emerald-500/10 overflow-hidden p-1">
                                                    <img src="/kairos-logo.svg" alt="Kairos AI" className="w-full h-full object-contain" />
                                                </div>
                                            )}
                                            <div className={`flex-1 max-w-[85%] md:max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                                <div className={`inline-block text-left ${message.role === 'user'
                                                    ? 'bg-emerald-500 text-black rounded-2xl px-5 py-3 shadow-lg shadow-emerald-500/20'
                                                    : 'text-white/90 leading-relaxed'
                                                    }`}>
                                                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">
                                                        {message.content}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-4 md:gap-6 animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-[#0d0d0d] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 p-1">
                                            <img src="/kairos-logo.svg" alt="Kairos AI" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex gap-1.5 pt-3">
                                            <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} className="h-10" />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b] to-transparent">
                            <div className="max-w-3xl mx-auto relative group">
                                <form onSubmit={handleSubmit} className="relative">
                                    <textarea
                                        rows={1}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Message Kairos AI..."
                                        className="w-full bg-[#18181b] border border-white/10 rounded-2xl px-4 py-4 pr-14 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/30 transition-all resize-none shadow-xl"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSubmit(e as any);
                                            }
                                        }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="p-2 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
                                            title="Voice Chat"
                                        >
                                            <MicrophoneIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isTyping}
                                            className="p-2 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-20 disabled:grayscale transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                </form>
                                <p className="text-[10px] text-center text-white/20 mt-3 uppercase tracking-tighter">
                                    Kairos AI can make mistakes. Focus on what matters.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50 w-96 transition-all duration-300"
        >
            <div className="bg-[#0f0f0f] border border-emerald-500/20 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div>
                            <h3 className="text-white font-semibold text-sm">Kairos AI</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                            title="Expand to Full View"
                        >
                            <Maximize2 className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-7 h-7 rounded-lg bg-[#0d0d0d] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 p-1">
                                    <img src="/kairos-logo.svg" alt="Kairos AI" className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.role === "user"
                                    ? "bg-emerald-500 text-black rounded-br-sm font-medium"
                                    : "bg-white/5 text-white/80 rounded-bl-sm border border-white/5"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-7 h-7 rounded-lg bg-[#0d0d0d] border border-emerald-500/30 flex items-center justify-center flex-shrink-0 p-1">
                                <img src="/kairos-logo.svg" alt="Kairos AI" className="w-full h-full object-contain" />
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
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(q)}
                                    className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all cursor-pointer"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-[#0f0f0f]">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Kairos AI..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/40 transition-colors"
                        />
                        <button
                            type="button"
                            className="p-2.5 rounded-xl text-white/40 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Voice Chat"
                        >
                            <MicrophoneIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

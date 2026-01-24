"use client"

import { useState, useRef, useEffect } from "react"
import { Send, X, Maximize2, Minimize2, Plus, MessageSquare, History, User, Trash2 } from "lucide-react"
import { ChatBubbleBottomCenterTextIcon, MicrophoneIcon } from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { dataEventEmitter, DATA_UPDATED_EVENT } from "@/lib/events"

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
    const [isRecording, setIsRecording] = useState(false)
    const isRecordingRef = useRef(false)
    const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const audioChunksRef = useRef<Blob[]>([])

    const [sessions, setSessions] = useState<any[]>([])
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Setup Audio Analysis for Silence Detection
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            audioContextRef.current = audioContext;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let lastSpeechTime = Date.now();
            const SILENCE_THRESHOLD = 1500; // 1.5 seconds
            const VOLUME_THRESHOLD = 30;   // Sensitivity

            const monitorSilence = () => {
                if (!isRecordingRef.current) return;

                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((a, b) => a + b) / bufferLength;

                if (volume > VOLUME_THRESHOLD) {
                    lastSpeechTime = Date.now();
                } else if (Date.now() - lastSpeechTime > SILENCE_THRESHOLD) {
                    // Silence detected - Commit chunk and reset
                    if (audioChunksRef.current.length > 0) {
                        console.log("[STT] Silence detected, transcribing chunk...");
                        commitChunk();
                        lastSpeechTime = Date.now(); // Reset timer for next chunk
                    }
                }
                requestAnimationFrame(monitorSilence);
            };

            const commitChunk = () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    // This triggers onstop
                    mediaRecorderRef.current.stop();

                    if (isRecordingRef.current) {
                        // Restart recording immediately for the next chunk
                        const newRecorder = new MediaRecorder(stream);
                        setupRecorder(newRecorder);
                        newRecorder.start();
                    }
                }
            };

            const setupRecorder = (recorder: MediaRecorder) => {
                mediaRecorderRef.current = recorder;
                audioChunksRef.current = [];

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                recorder.onstop = async () => {
                    if (audioChunksRef.current.length === 0) return;

                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    try {
                        const res = await fetch('/api/stt', {
                            method: 'POST',
                            body: formData,
                        });

                        if (!res.ok) throw new Error("Transcription failed");

                        const data = await res.json();
                        if (data.transcript) {
                            setInput(prev => prev + (prev ? " " : "") + data.transcript);
                        }
                    } catch (error) {
                        console.error("STT Chunk Error:", error);
                    }
                };
            };

            const initialRecorder = new MediaRecorder(stream);
            setupRecorder(initialRecorder);
            initialRecorder.start();

            isRecordingRef.current = true;
            setIsRecording(true);
            monitorSilence();

        } catch (error) {
            console.error("Mic Access Error:", error);
            toast.error("Could not access microphone");
        }
    };

    const stopRecording = () => {
        isRecordingRef.current = false;
        setIsRecording(false);

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();

        try {
            const res = await fetch(`/api/chat?sessionId=${sessionId}`, { method: 'DELETE' });
            if (res.ok) {
                setSessions(prev => prev.filter(s => s._id !== sessionId));
                toast.success("Chat deleted successfully");
                if (currentSessionId === sessionId) {
                    startNewChat();
                }
            }
        } catch (e) {
            toast.error("Failed to delete chat");
            console.error("Failed to delete session", e);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/chat')
            const data = await res.json()
            if (data.sessions) setSessions(data.sessions)
        } catch (e) {
            console.error("Failed to fetch sessions", e)
        }
    }

    const loadSession = async (sessionId: string) => {
        try {
            const res = await fetch(`/api/chat?sessionId=${sessionId}`)
            const data = await res.json()
            if (data.session) {
                setMessages(data.session.messages.map((m: any, idx: number) => ({
                    id: `${sessionId}-${idx}`,
                    role: m.role,
                    content: m.content
                })))
                setCurrentSessionId(sessionId)
            }
        } catch (e) {
            console.error("Failed to load session", e)
        }
    }

    const startNewChat = () => {
        setMessages([{
            id: "1",
            role: "assistant",
            content: initialMessage || defaultMessages[mode] || defaultMessages.general
        }])
        setCurrentSessionId(null)
    }

    useEffect(() => {
        if (isOpen) {
            fetchSessions()
        }
    }, [isOpen])

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
                    mode: mode,
                    sessionId: currentSessionId,
                    localTime: new Date().toLocaleString()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server responded with ${response.status}`);
            }

            const data = await response.json();

            if (data.response) {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: data.response
                };
                setMessages(prev => [...prev, aiMessage]);
                if (data.sessionId && !currentSessionId) {
                    setCurrentSessionId(data.sessionId);
                    fetchSessions();
                }

                if (data.toolsExecuted) {
                    dataEventEmitter.emit(DATA_UPDATED_EVENT);
                }
            } else {
                throw new Error('No response content received from AI');
            }
        } catch (error: any) {
            console.error('Chat error:', error);

            const isQuotaError = error.message?.includes('429') || error.message?.includes('quota');

            if (isQuotaError) {
                toast.error("AI Quota Exceeded", {
                    description: "You've reached the free tier limit. Please try again in a few minutes.",
                    duration: 5000,
                });
            }

            const errorMessage: Message = {
                id: (Date.now() + 2).toString(),
                role: "assistant",
                content: isQuotaError
                    ? "I've reached my daily limit for now. Please wait a bit or check back tomorrow!"
                    : `I'm sorry, I'm having trouble: ${error.message || "Unknown connection error"}`
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
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
                        <button
                            onClick={startNewChat}
                            className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-white text-sm mb-4 cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                            New Chat
                        </button>
                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mt-4 px-2">History</div>
                            {sessions.map((session) => (
                                <div
                                    key={session._id}
                                    className="relative group/item"
                                >
                                    <button
                                        onClick={() => loadSession(session._id)}
                                        className={cn(
                                            "flex items-center gap-3 w-full p-2.5 rounded-lg text-white text-sm text-left truncate group border transition-all cursor-pointer pr-10",
                                            currentSessionId === session._id
                                                ? "bg-white/5 border-emerald-500/20"
                                                : "hover:bg-white/5 border-transparent text-white/60 hover:text-white"
                                        )}
                                    >
                                        <MessageSquare className={cn(
                                            "h-4 w-4 shrink-0",
                                            currentSessionId === session._id ? "text-emerald-400" : "text-white/20"
                                        )} />
                                        <span className="truncate">{session.title}</span>
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteSession(e, session._id)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/10 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover/item:opacity-100 transition-all cursor-pointer"
                                        title="Delete chat"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))}
                            {sessions.length === 0 && (
                                <div className="text-[10px] text-white/10 px-2 py-4 italic">No history yet</div>
                            )}
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
                                                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/5 prose-table:my-4 prose-table:border-collapse prose-table:w-full prose-table:text-left">
                                                        {message.role === 'assistant' ? (
                                                            <ReactMarkdown
                                                                remarkPlugins={[remarkGfm]}
                                                                components={{
                                                                    table: ({ node, ...props }) => (
                                                                        <div className="overflow-x-auto my-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                                                            <table className="min-w-full border-collapse" {...props} />
                                                                        </div>
                                                                    ),
                                                                    thead: ({ node, ...props }) => <thead className="bg-white/[0.05]" {...props} />,
                                                                    th: ({ node, ...props }) => (
                                                                        <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 border-b border-white/5" {...props} />
                                                                    ),
                                                                    td: ({ node, ...props }) => (
                                                                        <td className="px-5 py-4 text-sm border-b border-white/[0.02] text-white/70" {...props} />
                                                                    ),
                                                                }}
                                                            >
                                                                {message.content}
                                                            </ReactMarkdown>
                                                        ) : (
                                                            <div className="whitespace-pre-wrap">{message.content}</div>
                                                        )}
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
                                            onClick={handleMicClick}
                                            className={cn(
                                                "p-2 rounded-xl transition-all cursor-pointer",
                                                isRecording
                                                    ? "bg-red-500/20 text-red-500 animate-pulse"
                                                    : "text-white/40 hover:text-emerald-400 hover:bg-white/5"
                                            )}
                                            title={isRecording ? "Stop Recording" : "Voice Chat"}
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
                                {message.role === 'assistant' ? (
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                table: ({ node, ...props }) => (
                                                    <div className="overflow-x-auto my-4 rounded-xl border border-white/10 bg-white/[0.03]">
                                                        <table className="min-w-full border-collapse" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead className="bg-white/5" {...props} />,
                                                th: ({ node, ...props }) => <th className="px-3 py-2 text-[9px] font-bold uppercase text-emerald-500 border-b border-white/10" {...props} />,
                                                td: ({ node, ...props }) => <td className="px-3 py-2 text-[12px] border-b border-white/5 text-white/60" {...props} />,
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                )}
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
                            onClick={handleMicClick}
                            className={cn(
                                "p-2.5 rounded-xl transition-all cursor-pointer",
                                isRecording
                                    ? "bg-red-500/20 text-red-500 animate-pulse"
                                    : "text-white/40 hover:text-emerald-400 hover:bg-white/5"
                            )}
                            title={isRecording ? "Stop Recording" : "Voice Chat"}
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

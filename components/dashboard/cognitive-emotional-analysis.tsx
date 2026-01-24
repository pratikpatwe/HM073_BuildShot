"use client"

import { useEffect, useState } from "react"
import { Brain, TrendingUp, AlertTriangle, Activity, Zap, Heart, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

interface AnalysisData {
    moodScore: number;
    stressLevel: number;
    productivityScore: number;
    resilienceScore: number;
    indicators: {
        financialDip: boolean;
        habitConsistency: number;
        taskCompletion: number;
        journalSentiment: string;
    };
}

export function CognitiveEmotionalAnalysis() {
    const [data, setData] = useState<AnalysisData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        fetchAnalysis()
    }, [])

    const fetchAnalysis = async () => {
        try {
            const res = await fetch('/api/analysis')
            if (res.ok) {
                const json = await res.json()
                setData(json.analysis)
                // If resilience score is very low, show alert
                if (json.analysis && json.analysis.resilienceScore < 35) {
                    setShowAlert(true)
                }
            }
        } catch (error) {
            console.error("Failed to fetch analysis", error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="w-full h-48 bg-white/[0.02] border border-white/5 rounded-[32px] animate-pulse flex items-center justify-center">
            <Brain className="w-8 h-8 text-emerald-500/20" />
        </div>
    )

    if (!data) return null;

    return (
        <div className="w-full bg-[#0c0c0c] border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-500/10 transition-all">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px]" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Brain className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Cognitive Analysis</h2>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-[0.1em] mt-0.5">AI-Powered Emotional State</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Real-time Pulse active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Mood Score */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/60 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mood</span>
                        <Heart className={cn("w-4 h-4", data.moodScore > 60 ? "text-emerald-500" : "text-red-500")} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{(data.moodScore || 0).toFixed(3).replace(/\.?0+$/, '')}</span>
                        <span className="text-zinc-600 font-bold text-sm">%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${data.moodScore}%` }} />
                    </div>
                </div>

                {/* Stress Level */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/60 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Stress Level</span>
                        <Zap className={cn("w-4 h-4", data.stressLevel < 40 ? "text-emerald-500" : "text-orange-500")} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{(data.stressLevel || 0).toFixed(3).replace(/\.?0+$/, '')}</span>
                        <span className="text-zinc-600 font-bold text-sm">%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${data.stressLevel}%` }} />
                    </div>
                </div>

                {/* Productivity */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 hover:bg-zinc-900/60 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cognitive Load</span>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{(data.productivityScore || 0).toFixed(3).replace(/\.?0+$/, '')}</span>
                        <span className="text-zinc-600 font-bold text-sm">%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${data.productivityScore}%` }} />
                    </div>
                </div>

                {/* Overall Resilience */}
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Emotional Resilience</span>
                        <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white tracking-tighter">{(data.resilienceScore || 0).toFixed(3).replace(/\.?0+$/, '')}</span>
                        <span className="text-emerald-500/40 font-bold text-sm">INDEX</span>
                    </div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-4">Calculated from Finance, Habits & Tasks</p>
                </div>
            </div>

            {/* Indicator Badges */}
            <div className="mt-8 flex flex-wrap gap-3">
                <div className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                    data.indicators.financialDip ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20")}>
                    {data.indicators.financialDip ? "Financial instability detected" : "Financial rhythm stable"}
                </div>
                <div className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    <span className="text-emerald-500">{(data.indicators.habitConsistency).toFixed(0)}%</span> Habit adherence
                </div>
                <div className="bg-zinc-900 border border-white/5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                    Journal tone: <span className={cn(data.indicators.journalSentiment === 'negative' ? 'text-red-500' : 'text-emerald-500')}>{data.indicators.journalSentiment}</span>
                </div>
            </div>

            {/* Mental Health Dialog */}
            <Dialog open={showAlert} onOpenChange={setShowAlert}>
                <DialogContent className="sm:max-w-md bg-[#111111] border-red-500/20 rounded-3xl p-8">
                    <DialogHeader className="items-center text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-white tracking-tight uppercase">Wellbeing Alert</DialogTitle>
                        <DialogDescription className="text-zinc-400 text-lg py-4">
                            Our AI has noticed a significant dip in your emotional resilience index. Your mental health is our priority.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl mb-6">
                        <p className="text-sm text-red-400 font-medium text-center">
                            "It's okay not to be okay. Reaching out is a sign of strength."
                        </p>
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-3">
                        <Button
                            onClick={() => setShowAlert(false)}
                            variant="ghost"
                            className="flex-1 rounded-xl h-12 text-zinc-500 font-bold hover:bg-white/5"
                        >
                            I'm handling it
                        </Button>
                        <Button
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black rounded-xl h-12 shadow-lg shadow-emerald-500/20"
                            onClick={() => {
                                window.open('https://www.mentalhealth.gov', '_blank')
                                setShowAlert(false)
                            }}
                        >
                            GET SUPPORT
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

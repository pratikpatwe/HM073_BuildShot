"use client"

import { useMemo } from "react"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface HabitStatsGraphProps {
    data: { date: string, value: number }[]
    range: 'week' | 'month' | 'year' | 'all'
}

export function HabitStatsGraph({ data, range }: HabitStatsGraphProps) {
    const formattedData = useMemo(() => {
        return data.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            })
        }))
    }, [data])

    if (data.length === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center border border-white/5 rounded-3xl bg-white/[0.02]">
                <p className="text-white/20 font-bold uppercase tracking-widest text-[11px]">No data for this period</p>
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData}>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                        minTickGap={30}
                    />
                    <YAxis
                        hide
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#10b981' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={3}
                        fill="url(#gradient)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

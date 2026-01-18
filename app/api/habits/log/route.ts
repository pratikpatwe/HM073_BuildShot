import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HabitLog from '@/models/HabitLog';
import Habit from '@/models/Habit';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { habitId, status, date } = await req.json();

        const logDate = date ? new Date(date) : new Date();
        logDate.setHours(0, 0, 0, 0);

        // Update or create log
        await HabitLog.findOneAndUpdate(
            { habitId, userId, date: logDate },
            { status },
            { upsert: true, new: true }
        );

        // Recalculate streak
        const allLogs = await HabitLog.find({ habitId, status: 'done' }).sort({ date: -1 });
        const habit = await Habit.findById(habitId);

        if (habit) {
            let currentStreak = 0;
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            // Current Streak Calculation
            // We check the most recent logs to see if they are consecutive
            let checkDate = new Date();
            checkDate.setHours(0, 0, 0, 0);

            // If the last log is not today or yesterday, streak might be 0
            // (Unless it's a custom schedule - for simplicity we'll check consecutive days for now)

            for (let i = 0; i < allLogs.length; i++) {
                const logDate = new Date(allLogs[i].date);
                logDate.setHours(0, 0, 0, 0);

                // If this is the first log we check...
                if (i === 0) {
                    // If the most recent log is older than yesterday, streak is broken
                    const dayDiff = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (dayDiff > 1) break;
                    currentStreak = 1;
                    checkDate = logDate;
                    continue;
                }

                const dayDiff = Math.floor((checkDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                if (dayDiff === 1) {
                    currentStreak++;
                    checkDate = logDate;
                } else if (dayDiff === 0) {
                    continue; // Skip duplicate dates if any
                } else {
                    break; // Gap found
                }
            }

            // Best Streak Calculation
            let bestStreak = habit.bestStreak || 0;
            let tempStreak = 0;
            let lastDate: Date | null = null;

            // Re-sort logs by date ascending to find best streak
            const sortedLogs = [...allLogs].sort((a, b) => a.date.getTime() - b.date.getTime());

            sortedLogs.forEach(log => {
                const logDate = new Date(log.date);
                if (!lastDate) {
                    tempStreak = 1;
                } else {
                    const diff = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
                    if (diff === 1) {
                        tempStreak++;
                    } else if (diff > 1) {
                        tempStreak = 1;
                    }
                }
                lastDate = logDate;
                if (tempStreak > bestStreak) bestStreak = tempStreak;
            });

            await Habit.findByIdAndUpdate(habitId, {
                streak: currentStreak,
                bestStreak: bestStreak
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

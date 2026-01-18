import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import HabitLog from '@/models/HabitLog';
import Habit from '@/models/Habit';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { searchParams } = new URL(req.url);
        const range = searchParams.get('range') || 'week'; // week, month, year, all

        const now = new Date();
        let startDate = new Date();

        if (range === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (range === 'month') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (range === 'year') {
            startDate.setFullYear(now.getFullYear() - 1);
        } else {
            startDate = new Date(0); // All time
        }

        const logs = await HabitLog.find({
            userId,
            date: { $gte: startDate },
            status: 'done'
        });

        const habitsCount = await Habit.countDocuments({ userId });

        // Aggregate by day
        const dataMap: Record<string, number> = {};
        logs.forEach(log => {
            const dateStr = log.date.toISOString().split('T')[0];
            dataMap[dateStr] = (dataMap[dateStr] || 0) + 1;
        });

        // Convert to sorted array
        const result = Object.entries(dataMap).map(([date, count]) => ({
            date,
            value: habitsCount > 0 ? (count / habitsCount) * 100 : 0
        })).sort((a, b) => a.date.localeCompare(b.date));

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

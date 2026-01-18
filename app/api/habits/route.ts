import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;

        const { searchParams } = new URL(req.url);
        const weekStartParam = searchParams.get('weekStart');
        const weekEndParam = searchParams.get('weekEnd');

        const habits = await Habit.find({ userId }).lean();

        // Get logs for the last 30 days OR the requested week range
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        let queryStart = thirtyDaysAgo;
        let queryEnd = now;

        if (weekStartParam) {
            const ws = new Date(weekStartParam);
            if (ws < queryStart) queryStart = ws;
        }
        if (weekEndParam) {
            const we = new Date(weekEndParam);
            if (we > queryEnd) queryEnd = we;
        }

        const logs = await HabitLog.find({
            userId,
            date: { $gte: queryStart, $lte: queryEnd }
        }).lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Merge status into habits efficiently
        const habitsWithStatus = habits.map(habit => {
            const hId = habit._id.toString();
            const habitLogs = logs.filter(l => l.habitId && l.habitId.toString() === hId);
            const todayLog = habitLogs.find(l => {
                const d = new Date(l.date);
                d.setHours(0, 0, 0, 0);
                return d.getTime() === today.getTime();
            });

            return {
                ...habit,
                id: hId,
                status: todayLog ? todayLog.status : 'none',
                weeklyLogs: habitLogs.map(l => ({
                    date: l.date,
                    status: l.status
                }))
            };
        });

        return NextResponse.json(habitsWithStatus);
    } catch (error: any) {
        console.error("Habits GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const data = await req.json();

        const habit = await Habit.create({
            ...data,
            userId,
        });

        return NextResponse.json({ ...habit.toObject(), id: habit._id.toString(), status: 'none' });
    } catch (error: any) {
        console.error("Habits POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Habit ID required' }, { status: 400 });
        }

        const data = await req.json();
        const habit = await Habit.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true }
        );

        if (!habit) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        return NextResponse.json(habit);
    } catch (error: any) {
        console.error("Habits PATCH error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Habit ID required' }, { status: 400 });
        }

        const result = await Habit.findOneAndUpdate(
            { _id: id, userId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Habits DELETE error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

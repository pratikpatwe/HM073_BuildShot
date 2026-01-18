import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import UserSettings from '@/models/UserSettings';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;

        let settings = await UserSettings.findOne({ userId });
        if (!settings) {
            settings = await UserSettings.create({ userId, bedtime: "23:00" });
        }

        return NextResponse.json(settings);
    } catch (error: any) {
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
        const { bedtime } = await req.json();

        const settings = await UserSettings.findOneAndUpdate(
            { userId },
            { bedtime },
            { upsert: true, new: true }
        );

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

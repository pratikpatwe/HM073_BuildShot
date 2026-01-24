import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { getOrCreateProfile, addXp, XP_VALUES } from '@/lib/xp';
import Profile from '@/models/Profile';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { name, email, avatar } = data;

        const profile = await getOrCreateProfile(payload.userId, email, name, avatar);
        if (!profile) return NextResponse.json({ error: 'Failed to sync profile' }, { status: 500 });

        // Check for daily login XP
        const lastUpdate = new Date(profile.lastXpUpdate || 0);
        const today = new Date();
        const isDifferentDay = lastUpdate.getDate() !== today.getDate() ||
            lastUpdate.getMonth() !== today.getMonth() ||
            lastUpdate.getFullYear() !== today.getFullYear();

        let updatedProfile = profile;
        if (isDifferentDay) {
            updatedProfile = await addXp(payload.userId, XP_VALUES.DAILY_LOGIN) || profile;
        }

        return NextResponse.json({
            profile: {
                xp: updatedProfile.xp,
                level: updatedProfile.level,
                friends: updatedProfile.friends
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

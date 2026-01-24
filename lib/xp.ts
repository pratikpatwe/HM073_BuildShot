import Profile from '@/models/Profile';
import connectDB from './mongodb';

export const XP_VALUES = {
    DAILY_LOGIN: 10,
    ADD_TRANSACTION: 5,
    HABIT_COMPLETE: 15,
    TASK_COMPLETE: 20,
    JOURNAL_ENTRY: 25,
};

export async function addXp(userId: string, amount: number) {
    try {
        await connectDB();

        const profile = await Profile.findOneAndUpdate(
            { userId },
            {
                $inc: { xp: amount },
                $set: { lastXpUpdate: new Date() }
            },
            { upsert: false, new: true }
        );

        if (profile) {
            // Level formula: level = floor(sqrt(xp / 100)) + 1
            const newLevel = Math.floor(Math.sqrt(profile.xp / 100)) + 1;
            if (newLevel > profile.level) {
                await Profile.updateOne({ userId }, { $set: { level: newLevel } });
            }
        }

        return profile;
    } catch (error) {
        console.error('Error adding XP:', error);
        return null;
    }
}

export async function getOrCreateProfile(userId: string, email: string, name: string, avatar?: string) {
    try {
        await connectDB();
        let profile = await Profile.findOne({ userId });

        if (!profile) {
            profile = await Profile.create({
                userId,
                email,
                name,
                avatar,
                xp: 0,
                level: 1,
            });
        } else if (name !== profile.name || avatar !== profile.avatar) {
            // Sync profile info if changed in auth
            await Profile.updateOne({ userId }, { $set: { name, avatar } });
        }

        return profile;
    } catch (error) {
        console.error('Error in getOrCreateProfile:', error);
        return null;
    }
}

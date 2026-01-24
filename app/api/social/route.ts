import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Profile from '@/models/Profile';
import FriendRequest from '@/models/FriendRequest';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = payload.userId;

        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action'); // leaderboard, requests, search

        if (action === 'leaderboard') {
            const profile = await Profile.findOne({ userId });
            if (!profile) return NextResponse.json({ leaderboard: [] });

            // Fetch profile and friends' profiles
            const friendsIds = profile.friends || [];
            const idsToFetch = [userId, ...friendsIds];

            const leaderboard = await Profile.find({
                userId: { $in: idsToFetch }
            })
                .sort({ xp: -1 })
                .lean();

            return NextResponse.json({
                leaderboard: leaderboard.map((p, index) => ({
                    id: p.userId,
                    name: p.name,
                    email: p.email,
                    avatar: p.avatar,
                    xp: p.xp,
                    level: p.level,
                    rank: index + 1
                }))
            });
        }

        if (action === 'requests') {
            const requests = await FriendRequest.find({
                receiverId: userId,
                status: 'pending'
            }).lean();

            return NextResponse.json({
                requests: requests.map(r => ({
                    id: r._id,
                    senderId: r.senderId,
                    senderName: r.senderName,
                    senderEmail: r.senderEmail,
                    createdAt: r.createdAt
                }))
            });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const senderId = payload.userId;

        const data = await req.json();
        const { action, email, requestId } = data;

        if (action === 'send_request') {
            if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

            // Find user by email in Profiles
            const receiverProfile = await Profile.findOne({ email: email.toLowerCase().trim() });
            if (!receiverProfile) {
                return NextResponse.json({ error: 'User not found on Karios' }, { status: 404 });
            }

            if (receiverProfile.userId === senderId) {
                return NextResponse.json({ error: 'You cannot add yourself' }, { status: 400 });
            }

            // Check if already friends
            const senderProfile = await Profile.findOne({ userId: senderId });
            if (senderProfile?.friends.includes(receiverProfile.userId)) {
                return NextResponse.json({ error: 'Already friends' }, { status: 400 });
            }

            // Create request
            try {
                await FriendRequest.create({
                    senderId,
                    senderEmail: senderProfile?.email,
                    senderName: senderProfile?.name,
                    receiverId: receiverProfile.userId,
                    status: 'pending'
                });
                return NextResponse.json({ success: true, message: 'Request sent!' });
            } catch (e: any) {
                if (e.code === 11000) return NextResponse.json({ error: 'Request already pending' }, { status: 400 });
                throw e;
            }
        }

        if (action === 'accept_request') {
            const request = await FriendRequest.findById(requestId);
            if (!request || request.receiverId !== senderId) {
                return NextResponse.json({ error: 'Request not found' }, { status: 404 });
            }

            // Update profiles
            await Profile.updateOne({ userId: senderId }, { $addToSet: { friends: request.senderId } });
            await Profile.updateOne({ userId: request.senderId }, { $addToSet: { friends: senderId } });

            // Delete request or update status
            await FriendRequest.findByIdAndDelete(requestId);

            return NextResponse.json({ success: true });
        }

        if (action === 'reject_request') {
            await FriendRequest.findOneAndDelete({ _id: requestId, receiverId: senderId });
            return NextResponse.json({ success: true });
        }

        if (action === 'remove_friend') {
            const { friendId } = data;
            if (!friendId) return NextResponse.json({ error: 'Friend ID required' }, { status: 400 });

            // Remove from both ends
            await Promise.all([
                Profile.updateOne({ userId: senderId }, { $pull: { friends: friendId } }),
                Profile.updateOne({ userId: friendId }, { $pull: { friends: senderId } })
            ]);

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

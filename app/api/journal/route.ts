import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Journal from '@/models/Journal';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { addXp, XP_VALUES } from '@/lib/xp';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = payload.userId;

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const tag = searchParams.get('tag');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build query
        const query: any = { userId, isDeleted: false };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const journals = await Journal.find(query)
            .sort({ createdAt: -1 })
            .lean();

        const formattedJournals = journals.map(journal => ({
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            tags: journal.tags,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt,
        }));

        return NextResponse.json({ journals: formattedJournals });
    } catch (error: any) {
        console.error("Journal GET error:", error);
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

        const { title, content, tags } = data;

        if (!title?.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 });
        }
        if (!content?.trim()) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const journal = await Journal.create({
            userId,
            title: title.trim(),
            content: content.trim(),
            tags: tags || [],
        });

        // Award XP for daily journal (first entry today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayEntries = await Journal.countDocuments({
            userId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
            isDeleted: false
        });

        if (todayEntries === 1) { // This was the first one
            await addXp(userId, XP_VALUES.JOURNAL_ENTRY);
        }

        return NextResponse.json({
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            tags: journal.tags,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt,
        });
    } catch (error: any) {
        console.error("Journal POST error:", error);
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
            return NextResponse.json({ error: 'Journal ID required' }, { status: 400 });
        }

        const data = await req.json();
        const journal = await Journal.findOneAndUpdate(
            { _id: id, userId },
            { $set: data },
            { new: true }
        );

        if (!journal) {
            return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: journal._id.toString(),
            title: journal.title,
            content: journal.content,
            tags: journal.tags,
            createdAt: journal.createdAt,
            updatedAt: journal.updatedAt,
        });
    } catch (error: any) {
        console.error("Journal PATCH error:", error);
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
            return NextResponse.json({ error: 'Journal ID required' }, { status: 400 });
        }

        const result = await Journal.findOneAndUpdate(
            { _id: id, userId },
            { $set: { isDeleted: true } },
            { new: true }
        );

        if (!result) {
            return NextResponse.json({ error: 'Journal not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Journal DELETE error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

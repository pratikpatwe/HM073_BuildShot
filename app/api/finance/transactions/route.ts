import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse query params
        const searchParams = request.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const period = searchParams.get('period');
        const startDateParam = searchParams.get('startDate');
        const endDateParam = searchParams.get('endDate');

        // Build query
        const query: any = { userId: payload.userId };

        // Handle date range
        if (startDateParam || endDateParam) {
            query.date = {};
            if (startDateParam) query.date.$gte = new Date(startDateParam);
            if (endDateParam) query.date.$lte = new Date(endDateParam);
        } else if (period && period !== 'all') {
            const now = new Date();
            let startDate = new Date();
            if (period === 'week') startDate.setDate(now.getDate() - 7);
            else if (period === 'month') startDate.setMonth(now.getMonth() - 1);
            else if (period === 'year') startDate.setFullYear(now.getFullYear() - 1);
            query.date = { $gte: startDate };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (type && type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { merchant: { $regex: search, $options: 'i' } },
                { rawDescription: { $regex: search, $options: 'i' } }
            ];
        }

        // Execute query
        const skip = (page - 1) * limit;
        const sort: any = { date: sortOrder === 'desc' ? -1 : 1 };

        const [transactions, total] = await Promise.all([
            Transaction.find(query).sort(sort).skip(skip).limit(limit).lean(),
            Transaction.countDocuments(query)
        ]);

        return NextResponse.json({
            transactions,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Transactions fetch error:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Find or create account
        let account = await Account.findOne({ userId: payload.userId, bankName: body.bankName || 'Manual' });
        if (!account) {
            account = await Account.create({
                userId: payload.userId,
                bankName: body.bankName || 'Manual',
                accountType: 'cash',
            });
        }

        const transaction = await Transaction.create({
            userId: payload.userId,
            accountId: account._id,
            date: new Date(body.date),
            amount: Number(body.amount),
            type: body.type,
            merchant: body.merchant || body.description,
            rawDescription: body.description,
            category: body.category || 'Other',
            channel: 'Manual',
            tags: [],
        });

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        console.error('Transaction create error:', error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(request);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { transactionIds } = await request.json();

        if (!Array.isArray(transactionIds)) {
            return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
        }

        await Transaction.deleteMany({
            _id: { $in: transactionIds },
            userId: payload.userId
        });

        return NextResponse.json({ success: true, count: transactionIds.length });
    } catch (error) {
        console.error('Transaction delete error:', error);
        return NextResponse.json({ error: 'Failed to delete transactions' }, { status: 500 });
    }
}

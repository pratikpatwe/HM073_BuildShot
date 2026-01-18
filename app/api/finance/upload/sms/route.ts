import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { parseMultipleSMS } from '@/lib/parsers/smsParser';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(request);

        if (!payload) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { smsText, bankName = 'Other', accountType = 'savings' } = await request.json();

        if (!smsText || typeof smsText !== 'string') {
            return NextResponse.json(
                { error: 'Please provide SMS text' },
                { status: 400 }
            );
        }

        // Parse SMS messages
        const parsedTransactions = parseMultipleSMS(smsText);

        if (parsedTransactions.length === 0) {
            return NextResponse.json(
                { error: 'No transactions found in the SMS text. Please check the format.' },
                { status: 400 }
            );
        }

        // Find or create account
        let account = await Account.findOne({ userId: payload.userId, bankName });

        if (!account) {
            account = await Account.create({
                userId: payload.userId,
                bankName,
                accountType,
            });
        }

        // Create transactions
        const transactionData = parsedTransactions.map(t => ({
            accountId: account!._id,
            userId: payload.userId,
            date: t.date,
            amount: t.amount,
            type: t.type,
            merchant: t.merchant,
            rawDescription: t.description,
            category: t.category,
            tags: t.tags,
            channel: t.channel,
            balanceAfter: t.balance,
        }));

        const newTxns = await Transaction.insertMany(transactionData);

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${newTxns.length} transactions from SMS`,
            transactionCount: newTxns.length,
            transactions: newTxns.map(t => ({
                id: t._id,
                date: t.date,
                amount: t.amount,
                type: t.type,
                merchant: t.merchant,
                category: t.category,
            })),
        });
    } catch (error) {
        console.error('SMS upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process SMS text. Please try again.' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/auth';
import { NextRequest } from 'next/server';
import HabitLog from '@/models/HabitLog';
import Todo from '@/models/Todo';
import Journal from '@/models/Journal';
import Transaction from '@/models/Transaction';
import CognitiveAnalysis from '@/models/CognitiveAnalysis';

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const payload = await getUserFromRequest(req);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = payload.userId;

        // 1. Fetch Today's Data for Analysis
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // a. Habits (Consistency today)
        const [habitLogs, totalHabits] = await Promise.all([
            HabitLog.countDocuments({ userId, date: today, status: 'done' }),
            HabitLog.countDocuments({ userId, date: today })
        ]);
        const habitConsistency = totalHabits > 0 ? (habitLogs / totalHabits) * 100 : 0;

        // b. To-Dos (Task completion today)
        const [doneTodos, totalTodos] = await Promise.all([
            Todo.countDocuments({ userId, date: { $gte: today, $lt: tomorrow }, isCompleted: true, isDeleted: false }),
            Todo.countDocuments({ userId, date: { $gte: today, $lt: tomorrow }, isDeleted: false })
        ]);
        const taskCompletion = totalTodos > 0 ? (doneTodos / totalTodos) * 100 : 0;

        // c. Finance Trend (Check for income depreciation vs last 30 days average)
        const last30Days = new Date();
        last30Days.setDate(today.getDate() - 30);

        const recentIncomes = await Transaction.find({
            userId,
            type: 'credit',
            date: { $gte: last30Days }
        });

        // Simplified: If no recent income or lower than usual, flag it
        const financialDip = recentIncomes.length === 0;

        // d. Journal Sentiment
        const recentJournal = await Journal.findOne({
            userId,
            isDeleted: false
        }).sort({ createdAt: -1 });

        let journalSentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (recentJournal) {
            const content = recentJournal.content.toLowerCase();
            const sadWords = ['sad', 'bad', 'angry', 'depressed', 'failure', 'hate', 'lose', 'pain', 'lonely', 'stress'];
            const happyWords = ['happy', 'good', 'great', 'win', 'love', 'success', 'joy', 'calm', 'peace'];

            const sadCount = sadWords.filter(w => content.includes(w)).length;
            const happyCount = happyWords.filter(w => content.includes(w)).length;

            if (sadCount > happyCount) journalSentiment = 'negative';
            if (happyCount > sadCount) journalSentiment = 'positive';
        }

        // Calculate Scores using a base mood score from journal sentiment
        const moodScore = journalSentiment === 'negative' ? 30 : journalSentiment === 'positive' ? 85 : 60;

        const productivityScore = (habitConsistency + taskCompletion) / 2;
        const financialStabilityScore = financialDip ? 40 : 80;
        const stressLevel = (100 - productivityScore) * 0.4 + (journalSentiment === 'negative' ? 40 : 10);
        const resilienceScore = (moodScore + productivityScore + financialStabilityScore + (100 - stressLevel)) / 4;

        // Save or update today's analysis
        const analysis = await CognitiveAnalysis.findOneAndUpdate(
            { userId, date: today },
            {
                userId,
                date: today,
                moodScore: Number(moodScore.toFixed(3)),
                stressLevel: Number(stressLevel.toFixed(3)),
                productivityScore: Number(productivityScore.toFixed(3)),
                financialStabilityScore: Number(financialStabilityScore.toFixed(3)),
                resilienceScore: Number(resilienceScore.toFixed(3)),
                indicators: {
                    financialDip,
                    habitConsistency,
                    taskCompletion,
                    journalSentiment
                }
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ analysis });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

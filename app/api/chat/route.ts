import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Habit from '@/models/Habit';
import Profile from '@/models/Profile';
import ChatSession from '@/models/ChatSession';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await getUserFromRequest(req);
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = userPayload.userId;

        const { message, mode = 'general', sessionId } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, userId });
        }

        if (!session) {
            session = await ChatSession.create({
                userId,
                title: message.substring(0, 40) + (message.length > 40 ? '...' : ''),
                mode,
                messages: []
            });
        }

        // Fetch context
        let context = '';
        const profile = await Profile.findOne({ userId });
        const userName = profile?.name || userPayload.name || 'User';

        if (mode === 'finance') {
            const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(10);
            context = transactions.length > 0
                ? `Financial Context: Recent transactions include ${transactions.map(t => `${t.merchant}: ₹${t.amount} (${t.category})`).join(', ')}`
                : 'Financial Context: No recent transactions found.';
        } else {
            const habits = await Habit.find({ userId });
            context = habits.length > 0
                ? `Life Context: Current habits being tracked: ${habits.map(h => h.name).join(', ')}`
                : 'Life Context: No active habits being tracked.';
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are Kairos AI, a premium personal assistant. 
Mode: ${mode}
User Name: ${userName}
Current Context: ${context}

Instructions:
1. Provide concise, helpful advice.
2. If in finance mode, focus on budget and spending.
3. If in general mode, focus on habits, productivity, and well-being.
4. Always maintain a premium, professional yet friendly tone.
5. Use markdown for formatting.`
        });

        // Format history for Gemini SDK
        const history = session.messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // Update session
        session.messages.push({ role: 'user', content: message, timestamp: new Date() });
        session.messages.push({ role: 'assistant', content: responseText, timestamp: new Date() });

        // Auto-rename if "mature" (e.g., after 2 user messages / 4 total messages)
        // and if it still has a default-style title or only first message title
        if (session.messages.length === 4) {
            try {
                const namingModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const prompt = `Based on the following conversation snippets, generate a very short (3-5 words), professional title for this chat. Respond ONLY with the title.
                
                User: ${session.messages[0].content}
                AI: ${session.messages[1].content}
                User: ${session.messages[2].content}
                AI: ${session.messages[3].content}`;

                const titleResult = await namingModel.generateContent(prompt);
                const newTitle = titleResult.response.text().trim().replace(/^"(.*)"$/, '$1');
                if (newTitle) {
                    session.title = newTitle;
                }
            } catch (renameError) {
                console.error("Auto-rename failed:", renameError);
            }
        }

        await session.save();

        return NextResponse.json({
            response: responseText,
            sessionId: session._id,
            title: session.title
        });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await getUserFromRequest(req);
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = userPayload.userId;

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (sessionId) {
            const session = await ChatSession.findOne({ _id: sessionId, userId });
            if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
            return NextResponse.json({ session });
        }

        const sessions = await ChatSession.find({ userId })
            .select('title mode updatedAt')
            .sort({ updatedAt: -1 })
            .limit(20);

        return NextResponse.json({ sessions });
    } catch (error: any) {
        console.error("Chat GET Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await getUserFromRequest(req);
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = userPayload.userId;

        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        const result = await ChatSession.deleteOne({ _id: sessionId, userId });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Session not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Session deleted' });
    } catch (error: any) {
        console.error("Chat DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Habit from '@/models/Habit'; // Assuming these exist or we handle errors
import User from '@/models/User';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
    try {
        const { message, mode = 'general' } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        let context = '';
        let userName = 'User';

        try {
            await connectDB();
            const userPayload = await getUserFromRequest(req);
            const userId = userPayload?.userId;

            if (userId) {
                const user = await User.findById(userId);
                userName = user?.name || 'User';

                if (mode === 'finance') {
                    // Fetch financial context
                    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(20);
                    context = `Financial Context: Recent transactions include ${transactions.map(t => `${t.merchant}: ₹${t.amount} (${t.category})`).join(', ')}`;
                } else {
                    // Fetch general/life context (Habits, etc.)
                    try {
                        const habits = await Habit.find({ userId });
                        context = `Life Context: Current habits being tracked: ${habits.map(h => h.name).join(', ')}`;
                    } catch (e) {
                        context = 'Life Context: No specific habits found.';
                    }
                }
            }
        } catch (dbError) {
            console.error("DB Context Error:", dbError);
            context = "Context: Using general knowledge (System data unavailable).";
        }

        const systemPrompt = `
You are Kairos AI, a premium personal assistant. 
Mode: ${mode}
User Name: ${userName}
Current Context: ${context}

Instructions:
1. Provide concise, helpful advice.
2. If in finance mode, focus on budget and spending.
3. If in general mode, focus on habits, productivity, and well-being.
4. Always maintain a premium, professional yet friendly tone.
5. Use markdown for formatting.

User Question: ${message}
`;

        const result = await (ai as any).models.generateContent({
            model: "gemini-1.5-flash",
            contents: systemPrompt
        });

        const responseText = result.text || "I'm sorry, I couldn't generate a response at this time.";
        return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

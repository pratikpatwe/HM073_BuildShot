import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFromRequest } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import Habit from '@/models/Habit';
import Profile from '@/models/Profile';
import ChatSession from '@/models/ChatSession';
import { allTools, toolsMap } from '@/tools/tools-index';

const API_KEYS = [
    process.env.GEMINI_API_KEY_PP_1,
    process.env.GEMINI_API_KEY_PD_1,
    process.env.GEMINI_API_KEY_KJ_1
].filter(Boolean) as string[];

let currentKeyIndex = 0;

function getGenAI() {
    const key = API_KEYS[currentKeyIndex];
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    return new GoogleGenerativeAI(key);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const userPayload = await getUserFromRequest(req);
        if (!userPayload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const userId = userPayload.userId;

        const { message, mode = 'general', sessionId, localTime } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const currentTime = localTime || new Date().toLocaleString();

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

        const history = session.messages.map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        let response: any;
        let responseText = "";
        let success = false;
        let attempts = 0;
        let toolsExecuted = false;

        while (!success && attempts < API_KEYS.length) {
            try {
                // ... (rest of model initialization)
                const genAI = getGenAI();
                const model = genAI.getGenerativeModel({
                    model: "gemini-3-flash-preview",
                    tools: [{
                        functionDeclarations: allTools.map(t => ({
                            name: t.name,
                            description: t.description,
                            parameters: t.parameters as any
                        }))
                    }],
                    systemInstruction: `You are Kairos AI, a premium personal assistant. 
Mode: ${mode}
User Name: ${userName}
Current Context: ${context}
Today's Date: ${currentTime} (Always use this for relative dates like 'tomorrow', 'next week', etc.)

Instructions:
1. Provide concise, helpful advice.
2. If in finance mode, focus on budget and spending.
3. If in general mode, focus on habits, productivity, and well-being.
4. Use the provided tools to help the user with their data (finance, habits, mood, tasks, etc.).
5. If a tool is called, use its output to provide a final response to the user.
6. Always maintain a premium, professional yet friendly tone.
8. Use proper GitHub Flavored Markdown (GFM). 
9. When creating tables, ensure they are preceded and followed by a blank line, and use standard pipe and dash syntax.
10. Do not use random symbols; keep the layout clean and professional.`
                });

                const chat = model.startChat({ history });
                response = await chat.sendMessage(message);

                // RE-ACT LOOP
                for (let i = 0; i < 5; i++) {
                    const candidate = response.response.candidates?.[0];
                    const parts = candidate?.content?.parts || [];
                    const calls = parts.filter((p: any) => p.functionCall);

                    if (calls.length === 0) {
                        responseText = response.response.text();
                        break;
                    }

                    const toolResponses = [];
                    for (const call of calls) {
                        const toolName = call.functionCall!.name;
                        const toolArgs = call.functionCall!.args;
                        const tool = toolsMap[toolName];

                        if (tool) {
                            console.log(`[AI TOOL CALL] ${toolName}`, toolArgs);
                            const result = await tool.execute(toolArgs, userId);
                            toolsExecuted = true;
                            toolResponses.push({
                                functionResponse: {
                                    name: toolName,
                                    response: result
                                }
                            });
                        } else {
                            toolResponses.push({
                                functionResponse: {
                                    name: toolName,
                                    response: { error: "Tool not found" }
                                }
                            });
                        }
                    }

                    response = await chat.sendMessage(toolResponses);
                    responseText = response.response.text();
                }
                success = true;
            } catch (error: any) {
                // ... (retry logic)
                console.error(`Attempt ${attempts + 1} failed with key index ${currentKeyIndex}:`, error.message);
                attempts++;
                const isRetryable =
                    error.message?.includes('429') ||
                    error.message?.includes('quota') ||
                    error.message?.includes('503') ||
                    error.message?.includes('overloaded');

                if (isRetryable) {
                    if (attempts >= API_KEYS.length) throw error;
                    continue; // try next key
                }
                throw error;
            }
        }

        // Final safety check for responseText
        if (!responseText && response.response) {
            responseText = response.response.text();
        }

        const finalContent = responseText || "I've processed your request.";

        // Update session
        session.messages.push({ role: 'user', content: message, timestamp: new Date() });
        session.messages.push({ role: 'assistant', content: finalContent, timestamp: new Date() });

        // Auto-rename
        if (session.messages.length === 4) {
            try {
                const namingGenAI = getGenAI();
                const namingModel = namingGenAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
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
            response: finalContent,
            sessionId: session._id,
            title: session.title,
            toolsExecuted // New flag
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

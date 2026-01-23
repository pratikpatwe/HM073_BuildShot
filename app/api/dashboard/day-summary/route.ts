import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import HabitLog from "@/models/HabitLog";
import Habit from "@/models/Habit";

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");

        if (!dateStr) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        const date = new Date(dateStr);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        await dbConnect();

        // Fetch all data in parallel
        const [transactions, allHabits, habitLogs] = await Promise.all([
            Transaction.find({
                userId: user.id,
                date: { $gte: startOfDay, $lte: endOfDay }
            }),
            Habit.find({ userId: user.id }),
            HabitLog.find({
                userId: user.id,
                date: { $gte: startOfDay, $lte: endOfDay }
            })
        ]);

        const income = transactions
            .filter(t => t.type === 'credit')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);

        const completedHabits = habitLogs.filter(log => log.status === 'done').length;
        const totalHabits = allHabits.length;

        return NextResponse.json({
            finance: {
                income,
                expenses,
                net: income - expenses,
                count: transactions.length
            },
            habits: {
                completed: completedHabits,
                total: totalHabits
            }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

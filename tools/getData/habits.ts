import connectDB from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";

export const getHabits = {
    name: "get_habits",
    description: "Get a list of all active habits for the user.",
    parameters: {
        type: "object",
        properties: {
            includeDeleted: { type: "boolean", default: false }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const habits = await Habit.find({
                userId,
                isDeleted: args.includeDeleted ? { $in: [true, false] } : false
            }).lean();
            return { success: true, count: habits.length, habits };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const getHabitLogs = {
    name: "get_habit_logs",
    description: "Retrieve completion logs for habits within a date range.",
    parameters: {
        type: "object",
        properties: {
            habitId: { type: "string", description: "Optional: filter logs for a specific habit" },
            startDate: { type: "string", description: "ISO date format" },
            endDate: { type: "string", description: "ISO date format" }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const query: any = { userId };
            if (args.habitId) query.habitId = args.habitId;
            if (args.startDate || args.endDate) {
                query.date = {};
                if (args.startDate) query.date.$gte = new Date(args.startDate);
                if (args.endDate) query.date.$lte = new Date(args.endDate);
            }

            const logs = await HabitLog.find(query).sort({ date: -1 }).lean();
            return { success: true, count: logs.length, logs };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

import connectDB from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { addXp, XP_VALUES } from "@/lib/xp";

export const createHabit = {
    name: "create_habit",
    description: "Create a new habit to track.",
    parameters: {
        type: "object",
        properties: {
            name: { type: "string", description: "The name of the habit" },
            type: { type: "string", enum: ["Daily", "Weekdays", "Weekends", "Custom"], description: "Frequency of the habit" },
            category: { type: "string", description: "Category of the habit (e.g., Health, Productivity)" },
            color: { type: "string", description: "HEX color code for the habit" },
            iconName: { type: "string", description: "Lucide icon name (e.g., 'Target', 'Activity', 'Book')" }
        },
        required: ["name", "type", "category"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const habit = await Habit.create({
                ...args,
                userId,
            });
            return { success: true, habitId: habit._id, message: "Habit created successfully" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const logHabit = {
    name: "log_habit",
    description: "Mark a habit as done or not done for a specific date.",
    parameters: {
        type: "object",
        properties: {
            habitId: { type: "string", description: "The ID of the habit to log" },
            status: { type: "string", enum: ["done", "none"], description: "Status to set" },
            date: { type: "string", description: "The date of the log (ISO format, e.g., '2024-03-20')" }
        },
        required: ["habitId", "status"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const { habitId, status, date } = args;
            const logDate = date ? new Date(date) : new Date();
            logDate.setHours(0, 0, 0, 0);

            await HabitLog.findOneAndUpdate(
                { habitId, userId, date: logDate },
                { status },
                { upsert: true, new: true }
            );

            // Award XP only when marking habit as done
            let xpAwarded = 0;
            if (status === 'done') {
                await addXp(userId, XP_VALUES.HABIT_COMPLETE);
                xpAwarded = XP_VALUES.HABIT_COMPLETE;
            }

            return { success: true, xpAwarded, message: `Habit ${status === 'done' ? 'marked as completed' : 'unmarked'} for ${logDate.toDateString()}` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

import connectDB from "@/lib/mongodb";
import Habit from "@/models/Habit";

export const deleteHabit = {
    name: "delete_habit",
    description: "Delete a habit (soft delete).",
    parameters: {
        type: "object",
        properties: {
            habitId: { type: "string", description: "The ID of the habit to delete" }
        },
        required: ["habitId"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const habit = await Habit.findOneAndUpdate(
                { _id: args.habitId, userId },
                { $set: { isDeleted: true } },
                { new: true }
            );

            if (!habit) return { success: false, error: "Habit not found" };
            return { success: true, message: `Habit '${habit.name}' deleted successfully` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

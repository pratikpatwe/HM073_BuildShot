import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export const getTodoTasks = {
    name: "get_todo_tasks",
    description: "Retrieve todo tasks with filters for status, priority, and date.",
    parameters: {
        type: "object",
        properties: {
            isCompleted: { type: "boolean", description: "Filter by completion status" },
            priority: { type: "number", description: "Filter by specific priority level (1-10)" },
            label: { type: "string", description: "Filter by label (e.g., 'Work', 'Personal')" },
            date: { type: "string", description: "Specific date in ISO format" },
            limit: { type: "number", default: 50 }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const query: any = { userId, isDeleted: false };

            if (args.isCompleted !== undefined) query.isCompleted = args.isCompleted;
            if (args.priority) query.priority = args.priority;
            if (args.label) query.label = { $regex: args.label, $options: 'i' };
            if (args.date) {
                const searchDate = new Date(args.date);
                const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
                query.date = { $gte: startOfDay, $lte: endOfDay };
            }

            const todos = await Todo.find(query)
                .sort({ date: 1, priority: -1 })
                .limit(args.limit || 50)
                .lean();

            return { success: true, count: todos.length, todos };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

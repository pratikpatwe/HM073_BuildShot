import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { addXp, XP_VALUES } from "@/lib/xp";

export const createTodoTask = {
    name: "create_todo_task",
    description: "Create a new todo task.",
    parameters: {
        type: "object",
        properties: {
            title: { type: "string", description: "The title of the task" },
            description: { type: "string", description: "A detailed description of the task" },
            date: { type: "string", description: "The scheduled date for the task (ISO format, e.g., '2024-03-20')" },
            deadline: { type: "string", description: "The deadline for the task (ISO format)" },
            priority: { type: "number", minimum: 1, maximum: 10, description: "Priority level from 1 to 10 (10 is highest)" },
            label: { type: "string", description: "A label or category for the task (e.g., 'Work', 'Personal')" },
            location: { type: "string", description: "Location associated with the task" }
        },
        required: ["title", "date"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const todo = await Todo.create({
                userId,
                title: args.title.trim(),
                description: args.description?.trim(),
                date: new Date(args.date),
                deadline: args.deadline ? new Date(args.deadline) : undefined,
                priority: args.priority || 5,
                label: args.label?.trim(),
                location: args.location?.trim(),
            });
            return { success: true, todoId: todo._id, message: "Todo task created successfully" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

export const markTodoTaskStatus = {
    name: "mark_todo_task_status",
    description: "Update the completion status of a todo task.",
    parameters: {
        type: "object",
        properties: {
            todoId: { type: "string", description: "The unique ID of the todo task" },
            isCompleted: { type: "boolean", description: "True if task is completed, false otherwise" }
        },
        required: ["todoId", "isCompleted"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const { todoId, isCompleted } = args;
            const updateData: any = { isCompleted };
            if (isCompleted) {
                updateData.completedAt = new Date();
            } else {
                updateData.completedAt = null;
            }

            const todo = await Todo.findOneAndUpdate(
                { _id: todoId, userId },
                { $set: updateData },
                { new: true }
            );

            if (!todo) return { success: false, error: "Todo task not found" };

            // Award XP only when marking task as completed
            let xpAwarded = 0;
            if (isCompleted) {
                await addXp(userId, XP_VALUES.TASK_COMPLETE);
                xpAwarded = XP_VALUES.TASK_COMPLETE;
            }

            return { success: true, xpAwarded, message: `Task '${todo.title}' marked as ${isCompleted ? 'completed' : 'incomplete'}` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";

export const deleteTodoTask = {
    name: "delete_todo_task",
    description: "Delete a todo task (soft delete).",
    parameters: {
        type: "object",
        properties: {
            todoId: { type: "string", description: "The ID of the todo task to delete" }
        },
        required: ["todoId"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const todo = await Todo.findOneAndUpdate(
                { _id: args.todoId, userId },
                { $set: { isDeleted: true } },
                { new: true }
            );

            if (!todo) return { success: false, error: "Todo task not found" };
            return { success: true, message: `Task '${todo.title}' deleted successfully` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

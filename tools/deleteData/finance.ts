import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export const deleteTransactions = {
    name: "delete_transactions",
    description: "Delete one or more financial transactions by their IDs.",
    parameters: {
        type: "object",
        properties: {
            transactionIds: {
                type: "array",
                items: { type: "string" },
                description: "List of transaction IDs to delete"
            }
        },
        required: ["transactionIds"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const result = await Transaction.deleteMany({
                _id: { $in: args.transactionIds },
                userId: userId
            });
            return {
                success: true,
                count: result.deletedCount,
                message: `${result.deletedCount} transaction(s) deleted successfully`
            };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

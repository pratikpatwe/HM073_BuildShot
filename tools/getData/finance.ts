import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

export const getTransactions = {
    name: "get_transactions",
    description: "Retrieve financial transactions with optional filters for date range, category, and type.",
    parameters: {
        type: "object",
        properties: {
            startDate: { type: "string", description: "Start date in ISO format (e.g., '2024-01-01')" },
            endDate: { type: "string", description: "End date in ISO format (e.g., '2024-01-31')" },
            category: { type: "string", description: "Filter by category (e.g., 'Food', 'Travel')" },
            type: { type: "string", enum: ["credit", "debit"], description: "Filter by transaction type" },
            limit: { type: "number", default: 50, description: "Maximum number of transactions to return" }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const query: any = { userId };

            if (args.startDate || args.endDate) {
                query.date = {};
                if (args.startDate) query.date.$gte = new Date(args.startDate);
                if (args.endDate) query.date.$lte = new Date(args.endDate);
            }

            if (args.category) query.category = args.category;
            if (args.type) query.type = args.type;

            const transactions = await Transaction.find(query)
                .sort({ date: -1 })
                .limit(args.limit || 50)
                .lean();

            return { success: true, count: transactions.length, transactions };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

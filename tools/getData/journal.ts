import connectDB from "@/lib/mongodb";
import Journal from "@/models/Journal";

export const getJournalEntries = {
    name: "get_journal_entries",
    description: "Search or list journal entries with filters for dates, tags, and keywords.",
    parameters: {
        type: "object",
        properties: {
            search: { type: "string", description: "Keyword search in title or content" },
            tag: { type: "string", description: "Filter by a specific tag" },
            startDate: { type: "string", description: "ISO date format" },
            endDate: { type: "string", description: "ISO date format" },
            limit: { type: "number", default: 20 }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const query: any = { userId, isDeleted: false };

            if (args.search) {
                query.$or = [
                    { title: { $regex: args.search, $options: 'i' } },
                    { content: { $regex: args.search, $options: 'i' } }
                ];
            }

            if (args.tag) {
                query.tags = { $in: [args.tag] };
            }

            if (args.startDate || args.endDate) {
                query.createdAt = {};
                if (args.startDate) query.createdAt.$gte = new Date(args.startDate);
                if (args.endDate) query.createdAt.$lte = new Date(args.endDate);
            }

            const journals = await Journal.find(query)
                .sort({ createdAt: -1 })
                .limit(args.limit || 20)
                .lean();

            return { success: true, count: journals.length, journals };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

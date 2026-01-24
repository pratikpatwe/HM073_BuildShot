import connectDB from "@/lib/mongodb";
import Journal from "@/models/Journal";
import { addXp, XP_VALUES } from "@/lib/xp";

export const createJournalEntry = {
    name: "create_journal_entry",
    description: "Write a new journal entry.",
    parameters: {
        type: "object",
        properties: {
            title: { type: "string", description: "The title of the journal entry" },
            content: { type: "string", description: "The detailed content of the journal entry" },
            tags: { type: "array", items: { type: "string" }, description: "List of tags associated with this entry" }
        },
        required: ["title", "content"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const journal = await Journal.create({
                userId,
                title: args.title.trim(),
                content: args.content.trim(),
                tags: args.tags || [],
            });

            // Award XP for journal entry
            await addXp(userId, XP_VALUES.JOURNAL_ENTRY);

            return { success: true, journalId: journal._id, xpAwarded: XP_VALUES.JOURNAL_ENTRY, message: "Journal entry created successfully" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

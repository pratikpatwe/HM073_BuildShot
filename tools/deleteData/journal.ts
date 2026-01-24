import connectDB from "@/lib/mongodb";
import Journal from "@/models/Journal";

export const deleteJournalEntry = {
    name: "delete_journal_entry",
    description: "Delete a journal entry (soft delete).",
    parameters: {
        type: "object",
        properties: {
            journalId: { type: "string", description: "The ID of the journal entry to delete" }
        },
        required: ["journalId"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const journal = await Journal.findOneAndUpdate(
                { _id: args.journalId, userId },
                { $set: { isDeleted: true } },
                { new: true }
            );

            if (!journal) return { success: false, error: "Journal entry not found" };
            return { success: true, message: `Journal entry '${journal.title}' deleted successfully` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import Account from "@/models/Account";
import { addXp, XP_VALUES } from "@/lib/xp";

export const addTransaction = {
    name: "add_transaction",
    description: "Add a new financial transaction (expense or income).",
    parameters: {
        type: "object",
        properties: {
            amount: { type: "number", description: "The amount of the transaction" },
            type: { type: "string", enum: ["credit", "debit"], description: "Whether it's income (credit) or expense (debit)" },
            date: { type: "string", description: "The date of the transaction (ISO format)" },
            description: { type: "string", description: "A description of the transaction" },
            category: {
                type: "string",
                enum: ["Food", "Travel", "Shopping", "Entertainment", "Bills", "Health", "Education", "Rent", "Salary", "Investment", "Transfer", "Other"],
                description: "The category of the transaction"
            },
            merchant: { type: "string", description: "The merchant name" },
            bankName: { type: "string", description: "The bank or account name (defaults to 'Manual')" }
        },
        required: ["amount", "type", "date", "description", "category"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();

            // Find or create account
            let account = await Account.findOne({ userId, bankName: args.bankName || 'Manual' });
            if (!account) {
                account = await Account.create({
                    userId,
                    bankName: args.bankName || 'Manual',
                    accountType: 'cash',
                });
            }

            const transaction = await Transaction.create({
                userId,
                accountId: account._id,
                date: new Date(args.date),
                amount: Number(args.amount),
                type: args.type,
                merchant: args.merchant || args.description,
                rawDescription: args.description,
                category: args.category || 'Other',
                channel: 'Manual',
                tags: [],
            });

            // Award XP for adding transaction
            await addXp(userId, XP_VALUES.ADD_TRANSACTION);

            return { success: true, transactionId: transaction._id, xpAwarded: XP_VALUES.ADD_TRANSACTION, message: "Transaction added successfully" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

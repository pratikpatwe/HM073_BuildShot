import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export const getCalendarEvents = {
    name: "get_calendar_events",
    description: "Retrieve calendar events with filters for date range.",
    parameters: {
        type: "object",
        properties: {
            date: { type: "string", description: "Specific date in ISO format" },
            month: { type: "number", description: "Month number (0-11)" },
            year: { type: "number", description: "Year (e.g., 2024)" }
        }
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const query: any = { userId };

            if (args.date) {
                const searchDate = new Date(args.date);
                const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
                query.date = { $gte: startOfDay, $lte: endOfDay };
            } else if (args.month !== undefined && args.year) {
                const startDate = new Date(args.year, args.month, 1);
                const endDate = new Date(args.year, args.month + 1, 0);
                query.date = { $gte: startDate, $lte: endDate };
            }

            const events = await Event.find(query).sort({ date: 1, time: 1 }).lean();
            return { success: true, count: events.length, events };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

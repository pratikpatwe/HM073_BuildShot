import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export const createCalendarEvent = {
    name: "create_calendar_event",
    description: "Create a new calendar event.",
    parameters: {
        type: "object",
        properties: {
            title: { type: "string", description: "The title of the event" },
            description: { type: "string", description: "A detailed description of the event" },
            date: { type: "string", description: "The date of the event (ISO format, e.g., '2024-03-20')" },
            time: { type: "string", description: "The time of the event (e.g., '09:00 AM' or '14:30')" }
        },
        required: ["title", "date", "time"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const event = await Event.create({
                userId,
                title: args.title,
                description: args.description,
                time: args.time,
                date: new Date(args.date),
            });
            return { success: true, eventId: event._id, message: "Calendar event created successfully" };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

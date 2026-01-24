import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export const deleteCalendarEvent = {
    name: "delete_calendar_event",
    description: "Permanently delete a calendar event.",
    parameters: {
        type: "object",
        properties: {
            eventId: { type: "string", description: "The ID of the event to delete" }
        },
        required: ["eventId"]
    },
    execute: async (args: any, userId: string) => {
        try {
            await connectDB();
            const event = await Event.findOneAndDelete({
                _id: args.eventId,
                userId: userId
            });

            if (!event) return { success: false, error: "Event not found" };
            return { success: true, message: `Event '${event.title}' deleted successfully` };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }
};

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEvent extends Document {
    userId: string;
    title: string;
    description?: string;
    time: string; // e.g., "09:00 AM"
    date: Date;   // Storage as Date object (time part should be handled carefully)
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        userId: {
            type: String, // Clerk or Supabase ID
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        time: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index to quickly fetch events for a specific day
EventSchema.index({ userId: 1, date: 1 });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event;

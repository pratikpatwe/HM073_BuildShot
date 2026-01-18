import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHabitLog extends Document {
    habitId: mongoose.Types.ObjectId;
    userId: string;
    date: Date; // The specific day this log refers to (time set to 00:00:00)
    status: 'done' | 'none';
    createdAt: Date;
    updatedAt: Date;
}

const HabitLogSchema: Schema = new Schema(
    {
        habitId: {
            type: Schema.Types.ObjectId,
            ref: 'Habit',
            required: true,
            index: true,
        },
        userId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['done', 'none'],
            default: 'none',
        },
    },
    {
        timestamps: true,
    }
);

// Ensure only one log per habit per day
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

const HabitLog: Model<IHabitLog> = mongoose.models.HabitLog || mongoose.model<IHabitLog>('HabitLog', HabitLogSchema);

export default HabitLog;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHabit extends Document {
    userId: string;
    name: string;
    type: string; // 'Daily', 'Weekly', 'Custom'
    category: string;
    iconName: string;
    customDays: number[] | null;
    color: string;
    streak: number;
    bestStreak: number;
    createdAt: Date;
    updatedAt: Date;
}

const HabitSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Habit name is required'],
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['Daily', 'Weekly', 'Custom'],
            default: 'Daily',
        },
        category: {
            type: String,
            required: true,
        },
        iconName: {
            type: String,
            default: 'Target',
        },
        customDays: {
            type: [Number],
            default: null,
        },
        color: {
            type: String,
            default: '#FF9F0A', // Default orange
        },
        streak: {
            type: Number,
            default: 0,
        },
        bestStreak: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

HabitSchema.index({ userId: 1, createdAt: -1 });

// Delete the model if it exists to ensure schema updates are picked up in development
if (mongoose.models.Habit) {
    delete mongoose.models.Habit;
}

const Habit: Model<IHabit> = mongoose.model<IHabit>('Habit', HabitSchema);

export default Habit;

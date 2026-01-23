import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJournal extends Document {
    userId: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const JournalSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Journal title is required'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Journal content is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

JournalSchema.index({ userId: 1, createdAt: -1 });
JournalSchema.index({ userId: 1, tags: 1 });

// Delete the model if it exists to ensure schema updates are picked up in development
if (mongoose.models.Journal) {
    delete mongoose.models.Journal;
}

const Journal: Model<IJournal> = mongoose.model<IJournal>('Journal', JournalSchema);

export default Journal;

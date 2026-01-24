import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface IChatSession extends Document {
    userId: string;
    title: string;
    mode: 'finance' | 'general';
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const ChatSessionSchema: Schema = new Schema(
    {
        userId: { type: String, required: true, index: true },
        title: { type: String, required: true },
        mode: { type: String, enum: ['finance', 'general'], default: 'general' },
        messages: [MessageSchema],
    },
    {
        timestamps: true,
    }
);

// Ensure that indexing is applied correctly
ChatSessionSchema.index({ userId: 1, updatedAt: -1 });

const ChatSession: Model<IChatSession> = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);

export default ChatSession;

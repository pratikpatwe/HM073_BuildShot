import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITodo extends Document {
    userId: string;
    title: string;
    description?: string;
    date: Date;
    deadline?: Date;
    priority: number; // 1-10 scale
    label?: string;
    location?: string;
    reminder?: Date;
    isCompleted: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

const TodoSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: [true, 'User ID is required'],
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        date: {
            type: Date,
            required: [true, 'Task date is required'],
        },
        deadline: {
            type: Date,
        },
        priority: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
            default: 5,
        },
        label: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        reminder: {
            type: Date,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
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

TodoSchema.index({ userId: 1, date: 1 });
TodoSchema.index({ userId: 1, isCompleted: 1 });
TodoSchema.index({ userId: 1, label: 1 });
TodoSchema.index({ userId: 1, priority: -1 });

if (mongoose.models.Todo) {
    delete mongoose.models.Todo;
}

const Todo: Model<ITodo> = mongoose.model<ITodo>('Todo', TodoSchema);

export default Todo;

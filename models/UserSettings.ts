import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserSettings extends Document {
    userId: string;
    bedtime: string; // e.g., "23:00"
    createdAt: Date;
    updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        bedtime: {
            type: String,
            default: "23:00",
        },
    },
    {
        timestamps: true,
    }
);

const UserSettings: Model<IUserSettings> = mongoose.models.UserSettings || mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);

export default UserSettings;

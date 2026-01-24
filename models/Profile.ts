import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProfile extends Document {
    userId: string; // From Supabase
    email: string;
    name: string;
    avatar?: string;
    xp: number;
    level: number;
    friends: string[]; // Array of userId
    lastXpUpdate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        xp: {
            type: Number,
            default: 0,
        },
        level: {
            type: Number,
            default: 1,
        },
        friends: {
            type: [String],
            default: [],
        },
        lastXpUpdate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

ProfileSchema.index({ xp: -1 });

const Profile: Model<IProfile> = mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);

export default Profile;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICognitiveAnalysis extends Document {
    userId: string;
    date: Date;
    moodScore: number; // 0-100
    stressLevel: number; // 0-100
    productivityScore: number; // 0-100
    financialStabilityScore: number; // 0-100
    resilienceScore: number; // 0-100 (Overall)
    sentimentAnalysis: string;
    indicators: {
        financialDip: boolean;
        habitConsistency: number; // percentage
        taskCompletion: number; // percentage
        journalSentiment: 'positive' | 'neutral' | 'negative';
    };
    createdAt: Date;
}

const CognitiveAnalysisSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            default: Date.now,
            index: true,
        },
        moodScore: { type: Number, default: 50 },
        stressLevel: { type: Number, default: 30 },
        productivityScore: { type: Number, default: 50 },
        financialStabilityScore: { type: Number, default: 50 },
        resilienceScore: { type: Number, default: 50 },
        sentimentAnalysis: { type: String },
        indicators: {
            financialDip: { type: Boolean, default: false },
            habitConsistency: { type: Number, default: 0 },
            taskCompletion: { type: Number, default: 0 },
            journalSentiment: { type: String, enum: ['positive', 'neutral', 'negative'], default: 'neutral' },
        },
    },
    {
        timestamps: true,
    }
);

CognitiveAnalysisSchema.index({ userId: 1, date: -1 });

const CognitiveAnalysis: Model<ICognitiveAnalysis> = mongoose.models.CognitiveAnalysis || mongoose.model<ICognitiveAnalysis>('CognitiveAnalysis', CognitiveAnalysisSchema);

export default CognitiveAnalysis;

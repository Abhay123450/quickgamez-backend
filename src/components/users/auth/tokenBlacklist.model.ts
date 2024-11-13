import { Schema, model } from "mongoose";

interface TokenBlacklist {
    token: string;
    expiresAt: Date;
}

const tokenBlacklistSchema = new Schema<TokenBlacklist>({
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default:
            Date.now() +
                (process.env.ACCESS_TOKEN_VALIDITY as unknown as number) ||
            60 * 60 * 1000 // after 1 hour
    }
});

tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklistModel = model<TokenBlacklist>(
    "TokenBlacklist",
    tokenBlacklistSchema,
    "tokenBlacklist"
);

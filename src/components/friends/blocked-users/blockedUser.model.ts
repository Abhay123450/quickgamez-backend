import { Document, model, Schema, Types } from "mongoose";
import { BlockedUser } from "./BlockedUser.js";

export interface BlockedUserDocument
    extends Pick<BlockedUser, "createdAt" | "updatedAt">,
        Document {
    blockerUserId: Types.ObjectId;
    blockedUserId: Types.ObjectId;
}

const blockedUserSchema = new Schema<BlockedUserDocument>(
    {
        blockerUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        blockedUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

blockedUserSchema.index(
    { blockerUserId: 1, blockedUserId: 1 },
    { unique: true }
);

export const BlockedUserModel = model<BlockedUserDocument>(
    "BlockedUser",
    blockedUserSchema,
    "blockedUsers"
);

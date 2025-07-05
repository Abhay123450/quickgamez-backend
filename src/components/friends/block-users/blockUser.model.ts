import { Document, model, Schema, Types } from "mongoose";
import { BlockUser } from "./BlockUser.js";

export interface BlockUserDocument
    extends Pick<BlockUser, "createdAt" | "updatedAt">,
        Document {
    blockerUserId: Types.ObjectId;
    blockedUserId: Types.ObjectId;
}

const blockUserSchema = new Schema<BlockUserDocument>(
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

blockUserSchema.index({ blockerUserId: 1, blockedUserId: 1 }, { unique: true });

export const BlockUserModel = model<BlockUserDocument>(
    "BlockedUser",
    blockUserSchema,
    "blockedUsers"
);

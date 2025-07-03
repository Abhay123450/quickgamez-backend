import { Document, model, Schema } from "mongoose";
import { Friendship, friendshipStatus } from "./Friends.js";

export interface FreindsDocument
    extends Omit<Friendship, "userAId" | "userBId" | "id">,
        Document {
    userAId: Schema.Types.ObjectId;
    userBId: Schema.Types.ObjectId;
}

const friendsSchema = new Schema<FreindsDocument>(
    {
        userAId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userBId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: friendshipStatus,
            required: true,
            default: "pending"
        },
        friendSince: {
            type: Date,
            default: null
        },
        events: [
            {
                createdAt: {
                    type: Date,
                    default: Date.now(),
                    required: true
                },
                status: {
                    type: String,
                    enum: friendshipStatus,
                    required: true
                },
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                description: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

friendsSchema.index({ userAId: 1, userBId: 1 }, { unique: true });

friendsSchema.index({ userAId: 1, status: 1 }, { unique: false });
friendsSchema.index({ userBId: 1, status: 1 }, { unique: false });

export const FriendModel = model<FreindsDocument>(
    "Friend",
    friendsSchema,
    "friends"
);

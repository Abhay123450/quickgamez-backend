import { Document, model, Schema } from "mongoose";
import {
    Friendship,
    friendshipStatus,
    type FriendshipStatus
} from "./Friends.js";

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
            required: true
        },
        userBId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: String,
            enum: friendshipStatus,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const FriendModel = model<FreindsDocument>(
    "Friend",
    friendsSchema,
    "friends"
);

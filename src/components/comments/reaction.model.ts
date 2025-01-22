import { Document, model, Schema } from "mongoose";
import { CommentReaction } from "./CommentReaction.js";
import { Reaction } from "../../constants/CommentReaction.js";

export interface ReactionDocument
    extends Omit<CommentReaction, "commentId" | "userId">,
        Document {
    commentId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export const reactionSchema = new Schema<ReactionDocument>({
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reaction: {
        type: String,
        required: true,
        enum: Object.values(Reaction)
    }
});

reactionSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export const ReactionModel = model<ReactionDocument>(
    "Reaction",
    reactionSchema,
    "reactions"
);

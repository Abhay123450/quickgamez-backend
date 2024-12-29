import { Document, model, Schema, Types } from "mongoose";
import { Comment } from "./Comment.js";

export interface CommentDocument
    extends Omit<Comment, "parentCommentId" | "user">,
        Document {
    userId: Types.ObjectId;
    replyToCommentId: Schema.Types.ObjectId | null;
    parentCommentId: Schema.Types.ObjectId | null;
}

export const commentSchema = new Schema<CommentDocument>(
    {
        text: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        game: {
            type: String,
            required: true
        },
        replyToCommentId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        parentCommentId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        likeCount: {
            type: Number,
            default: 0,
            min: 0
        },
        dislikeCount: {
            type: Number,
            default: 0,
            min: 0
        },
        replyCount: {
            type: Number,
            default: 0,
            min: 0
        },
        activityCount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

export const CommentModel = model<CommentDocument>(
    "Comment",
    commentSchema,
    "comments"
);

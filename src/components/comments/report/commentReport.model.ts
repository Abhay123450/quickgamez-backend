import { Document, model, Schema } from "mongoose";
import { CommentReport } from "./CommentReport.js";

interface CommentReportDocument
    extends Document,
        Omit<CommentReport, "commentId" | "userId"> {
    commentId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export const commentReportSchema = new Schema<CommentReportDocument>({
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
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    reviewResult: {
        type: String,
        enum: ["accepted", "rejected", null],
        default: null
    }
});

export const CommentReportModel = model<CommentReportDocument>(
    "CommentReport",
    commentReportSchema,
    "commentReports"
);

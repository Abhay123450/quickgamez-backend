import { Types, isValidObjectId, SortOrder } from "mongoose";
import { Comment, NewComment, NewReply } from "./Comment.js";
import { CommentDocument, CommentModel } from "./comment.model.js";
import { CommentRepository } from "./CommentRepository.js";
import { ClientError, ServerError } from "../../utils/AppErrors.js";
import { User } from "../users/User.js";
import { ReactionModel } from "./reaction.model.js";
import { Reaction } from "../../constants/CommentReaction.js";
import { CommentReaction } from "./CommentReaction.js";
import { Sort } from "./CommentService.js";
import { CommentReportModel } from "./report/comment.model.js";

type PopulatedComment = Omit<CommentDocument, "userId"> & {
    userId: Pick<User, "username" | "name" | "avatar"> & {
        _id: Types.ObjectId;
    };
    replyToCommentId: {
        _id: Types.ObjectId;
        userId: Pick<User, "username" | "name"> & { _id: Types.ObjectId };
    } | null;
};

export class CommentRepositoryImpl implements CommentRepository {
    async addComment(comment: NewComment): Promise<Comment | null> {
        if (!isValidObjectId(comment.userId)) {
            throw new ClientError("Invalid user id", 400);
        }
        const commentModel = new CommentModel(comment);
        const commentSaved = await (
            await commentModel.save()
        ).populate<Pick<User, "username" | "name">>("userId", "username name");
        return this._convertCommentDocumentToComment(
            commentSaved as unknown as PopulatedComment
        ) as Comment;
    }
    async getCommentsByGameId(
        game: string,
        page: number,
        limit: number,
        sort: Sort
    ): Promise<Partial<Comment>[]> {
        let sortObj: { [key: string]: SortOrder } = { createdAt: "ascending" };

        switch (sort) {
            case Sort.NewestFirst:
                sortObj = { createdAt: "descending" };
                break;
            case Sort.OldestFirst:
                sortObj = { createdAt: "ascending" };
                break;
            case Sort.PopularFirst:
                sortObj = { likeCount: "descending" };
                break;
        }
        const comments = await CommentModel.find({
            game,
            parentCommentId: null
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort(sortObj)
            .populate<Pick<User, "username" | "name" | "avatar">>(
                "userId",
                "username name avatar"
            );
        if (!comments) return [];
        return comments.map((comment) => {
            return this._convertCommentDocumentToComment(
                comment as unknown as PopulatedComment
            );
        }) as Partial<Comment>[];
    }
    async getCommentsByUserId(
        userId: string,
        page: number,
        limit: number
    ): Promise<Comment[]> {
        const comments = await CommentModel.find({ userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate<Pick<User, "username" | "name" | "avatar">>(
                "userId",
                "username name avatar"
            );
        if (!comments) return [];
        return comments.map((comment) => {
            return this._convertCommentDocumentToComment(
                comment as unknown as PopulatedComment
            );
        }) as Comment[];
    }
    async updateComment(
        commentId: string,
        comment: Partial<Comment>
    ): Promise<boolean> {
        const commentUpdated = await CommentModel.findOneAndUpdate(
            { _id: commentId },
            { $set: comment }
        );
        if (!commentUpdated) {
            throw new ClientError("Comment not found or server error", 404);
        }
        return true;
    }
    async increamentCount(
        commentId: string,
        likeCount: number,
        dislikeCount: number,
        replyCount: number,
        activityCount: number
    ): Promise<boolean> {
        const commentUpdated = await CommentModel.findOneAndUpdate(
            { _id: commentId },
            { $inc: { likeCount, dislikeCount, replyCount, activityCount } }
        );
        if (!commentUpdated) {
            throw new ServerError("Failed to update comment stats");
        }
        return true;
    }
    async deleteComment(commentId: string, userId: string): Promise<boolean> {
        const commentDeleted = await CommentModel.findOneAndDelete({
            _id: commentId,
            userId
        });
        if (!commentDeleted) {
            throw new ServerError("Failed to delete comment");
        }
        return true;
    }
    async addReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean> {
        const alreadyReacted = await ReactionModel.findOne({
            commentId,
            userId
        });
        if (alreadyReacted && alreadyReacted.reaction === reaction) {
            return true;
        } else if (alreadyReacted) {
            return !!(await ReactionModel.updateOne(
                { commentId, userId },
                { reaction }
            ));
        }
        return !!(await new ReactionModel({
            commentId,
            userId,
            reaction
        }).save());
    }
    async updateReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean> {
        return !!(await ReactionModel.findOneAndUpdate(
            { commentId, userId },
            { reaction }
        ));
    }
    async removeReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean> {
        return !!(await ReactionModel.findOneAndDelete({
            commentId,
            userId,
            reaction
        }));
    }
    async getMyReaction(
        commentId: string,
        userId: string
    ): Promise<CommentReaction | null> {
        const reaction = await ReactionModel.findOne({
            commentId,
            userId
        });
        if (reaction) {
            return {
                commentId: reaction.commentId.toString(),
                userId: reaction.userId.toString(),
                reaction: reaction.reaction
            };
        }
        return null;
    }
    async getMyReactions(
        commentIdList: string[],
        userId: string
    ): Promise<CommentReaction[] | null> {
        const reactions = await ReactionModel.find({
            commentId: { $in: commentIdList },
            userId
        });
        if (reactions.length > 0) {
            return reactions.map((reaction) => {
                return {
                    commentId: reaction.commentId.toString(),
                    userId: reaction.userId.toString(),
                    reaction: reaction.reaction
                };
            });
        }
        return null;
    }
    async addReply(reply: NewReply): Promise<Comment | null> {
        const newReply = new CommentModel(reply);
        const replySaved = await (
            await newReply.save()
        ).populate<{
            userId: Pick<User, "username" | "name"> & { _id: Types.ObjectId };
            replyToCommentId: Pick<Comment, "commentId" | "user">;
        }>([
            {
                path: "userId",
                select: "userId username name"
            },
            {
                path: "replyToCommentId",
                select: "commentId userId",
                populate: {
                    path: "userId",
                    select: "userId username name"
                }
            }
        ]);
        return this._convertCommentDocumentToComment(
            replySaved as unknown as PopulatedComment
        ) as Comment;
    }

    async getRepliesByCommentId(
        commentId: string,
        page: number,
        limit: number
    ): Promise<Partial<Comment>[]> {
        const replies = await CommentModel.find({
            parentCommentId: commentId
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate<Pick<User, "userId" | "username" | "name">>(
                "userId",
                "userId username name"
            )
            .populate<Pick<Comment, "commentId" | "user">>({
                path: "replyToCommentId",
                select: "commentId userId",
                populate: {
                    path: "userId",
                    select: "userId username name"
                }
            });
        if (!replies) return [];
        return replies.map((reply) =>
            this._convertCommentDocumentToComment(
                reply as unknown as PopulatedComment
            )
        ) as Partial<Comment>[];
    }

    async reportComment(
        commentId: string,
        userId: string,
        reason: string
    ): Promise<boolean> {
        const comment = await CommentModel.findOne({ _id: commentId });
        if (!comment) {
            throw new ClientError("Comment not found", 404);
        }
        const report = await CommentReportModel.create({
            commentId,
            userId,
            reason
        });
        if (!report) {
            throw new ServerError("Failed to report comment", 500);
        }
        return true;
    }

    async getReportedComments(): Promise<Partial<Comment>[]> {
        const reports = await CommentReportModel.aggregate([
            { $match: { isReviewed: false } },
            {
                $group: {
                    _id: "$commentId",
                    count: { $sum: 1 },
                    reason: { $addToSet: "$reason" }
                }
            },
            { $sort: { count: -1 } },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "_id",
                    as: "comment"
                }
            }
        ]);
        return reports;
    }

    private _convertCommentDocumentToComment(
        commentDocument: PopulatedComment
    ): Partial<Comment> {
        const comment: Partial<Comment> = {};
        if (commentDocument._id)
            comment.commentId = commentDocument._id.toString();
        if (commentDocument.userId) {
            comment.user = {
                userId: commentDocument.userId._id.toString(),
                username: commentDocument.userId.username,
                name: commentDocument.userId.name,
                avatar: commentDocument.userId.avatar
            };
        } else {
            comment.user = null;
        }
        if (commentDocument.text)
            comment.text = commentDocument.censoredText || commentDocument.text;
        if (commentDocument.censoredText)
            comment.censoredText = commentDocument.censoredText;
        if (commentDocument.parentCommentId)
            comment.parentCommentId =
                commentDocument.parentCommentId.toString();
        if (commentDocument.replyToCommentId)
            comment.replyToComment = {
                commentId: commentDocument.replyToCommentId._id.toString(),
                user: {
                    userId: commentDocument.replyToCommentId.userId._id.toString(),
                    username: commentDocument.replyToCommentId.userId.username,
                    name: commentDocument.replyToCommentId.userId.name
                }
            };
        if ("likeCount" in commentDocument)
            comment.likeCount = commentDocument.likeCount;
        if ("dislikeCount" in commentDocument)
            comment.dislikeCount = commentDocument.dislikeCount;
        if ("replyCount" in commentDocument)
            comment.replyCount = commentDocument.replyCount;
        if (commentDocument.createdAt)
            comment.createdAt = commentDocument.createdAt;
        if (commentDocument.updatedAt)
            comment.updatedAt = commentDocument.updatedAt;

        return comment;
    }
}

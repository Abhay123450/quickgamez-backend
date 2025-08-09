import { Reaction } from "../../constants/CommentReaction.js";
import { ClientError, ServerError } from "../../utils/AppErrors.js";
import { censorBadWords } from "../../utils/censorBadWords.js";
import { Comment, NewComment, NewReply } from "./Comment.js";
import { CommentRepository } from "./CommentRepository.js";
import { CommentService, Sort } from "./CommentService.js";

export class CommentServiceImpl implements CommentService {
    private _commentRepository: CommentRepository;

    constructor(commentRepository: CommentRepository) {
        this._commentRepository = commentRepository;
    }
    async addComment(comment: NewComment): Promise<Comment | null> {
        comment.censoredText = censorBadWords(comment.text);
        return await this._commentRepository.addComment(comment);
    }
    async getCommentsByGameId(
        gameId: string,
        page: number,
        limit: number,
        sort: Sort,
        userId?: string
    ): Promise<Comment[]> {
        const comments = (await this._commentRepository.getCommentsByGameId(
            gameId,
            page,
            limit,
            sort
        )) as Comment[];
        if (comments.length < 0) return [];
        if (!userId) return comments;
        return this._populateUserReaction(comments, userId);
    }
    async getCommentsByUserId(
        userId: string,
        page: number,
        limit: number
    ): Promise<Comment[]> {
        return await this._commentRepository.getCommentsByUserId(
            userId,
            page,
            limit
        );
    }
    async deleteComment(commentId: string, userId: string): Promise<boolean> {
        return await this._commentRepository.deleteComment(commentId, userId);
    }
    async likeComment(commentId: string, userId: string): Promise<boolean> {
        const myReaction = await this._commentRepository.getMyReaction(
            commentId,
            userId
        );
        if (myReaction) {
            if (myReaction.reaction === Reaction.LIKE) {
                return true;
            }
            // previous reaction is dislike, change to like
            await this._commentRepository.updateReaction(
                commentId,
                userId,
                Reaction.LIKE
            );
            // increase like count and decrease dislike count by 1
            await this._commentRepository.increamentCount(
                commentId,
                1,
                -1,
                0,
                0
            );
            return true;
        }
        await this._commentRepository.addReaction(
            commentId,
            userId,
            Reaction.LIKE
        );
        // increase like count by 1
        await this._commentRepository.increamentCount(commentId, 1, 0, 0, 1);
        return true;
    }
    async unlikeComment(commentId: string, userId: string): Promise<boolean> {
        const myReaction = await this._commentRepository.getMyReaction(
            commentId,
            userId
        );
        if (!myReaction) {
            return true;
        }
        if (myReaction.reaction === Reaction.LIKE) {
            // decrease like count by 1
            await this._commentRepository.increamentCount(
                commentId,
                -1,
                0,
                0,
                -1
            );
        } else if (myReaction.reaction === Reaction.DISLIKE) {
            // cannot unlike a comment with dislike
            throw new ClientError("Cannot unlike a comment with dislike");
        }
        return await this._commentRepository.removeReaction(
            commentId,
            userId,
            Reaction.LIKE
        );
    }
    async dislikeComment(commentId: string, userId: string): Promise<boolean> {
        const myReaction = await this._commentRepository.getMyReaction(
            commentId,
            userId
        );
        if (myReaction) {
            if (myReaction.reaction === Reaction.DISLIKE) {
                return true;
            }
            // previous reaction is like, change to dislike
            await this._commentRepository.updateReaction(
                commentId,
                userId,
                Reaction.DISLIKE
            );
            // increase dislike count and decrease like count by 1
            await this._commentRepository.increamentCount(
                commentId,
                -1,
                1,
                0,
                0
            );
            return true;
        }
        await this._commentRepository.addReaction(
            commentId,
            userId,
            Reaction.DISLIKE
        );
        // increase dislike count by 1
        await this._commentRepository.increamentCount(commentId, 0, 1, 0, 1);
        return true;
    }
    async undislikeComment(
        commentId: string,
        userId: string
    ): Promise<boolean> {
        const myReaction = await this._commentRepository.getMyReaction(
            commentId,
            userId
        );
        if (!myReaction) {
            return true;
        }
        if (myReaction.reaction === Reaction.DISLIKE) {
            // decrease dislike count by 1
            await this._commentRepository.increamentCount(
                commentId,
                0,
                -1,
                0,
                -1
            );
        } else if (myReaction.reaction === Reaction.LIKE) {
            // cannot undislike a comment with like
            throw new ClientError("Cannot undislike a comment with like");
        }
        return await this._commentRepository.removeReaction(
            commentId,
            userId,
            Reaction.DISLIKE
        );
    }
    async addReply(reply: NewReply): Promise<Comment | null> {
        reply.censoredText = censorBadWords(reply.text);
        const replyAdded = await this._commentRepository.addReply(reply);

        if (!replyAdded) {
            throw new ServerError("Failed to add reply");
        }

        await this._commentRepository.increamentCount(
            reply.parentCommentId,
            0,
            0,
            1,
            1
        );

        return replyAdded;
    }
    async getRepliesByCommentId(
        commentId: string,
        page: number,
        limit: number,
        userId?: string
    ): Promise<Partial<Comment>[]> {
        const replies = await this._commentRepository.getRepliesByCommentId(
            commentId,
            page,
            limit
        );
        if (replies && replies.length > 0 && userId) {
            return this._populateUserReaction(replies as Comment[], userId);
        }
        return replies;
    }

    private async _populateUserReaction(
        comments: Comment[],
        userId: string
    ): Promise<Comment[]> {
        const commentIdList = comments.map((comment) => comment.commentId);

        const reactions = await this._commentRepository.getMyReactions(
            commentIdList,
            userId
        );
        if (!reactions) return comments;

        return comments.map((comment) => {
            const reaction = reactions.find(
                (reaction) => reaction.commentId === comment.commentId
            );
            if (!reaction) return { ...comment, myReaction: null };
            return { ...comment, myReaction: reaction.reaction };
        });
    }

    async reportComment(
        commentId: string,
        userId: string,
        reason: string
    ): Promise<boolean> {
        return await this._commentRepository.reportComment(
            commentId,
            userId,
            reason
        );
    }

    async getReportedComments(): Promise<any> {
        return await this._commentRepository.getReportedComments();
    }
}

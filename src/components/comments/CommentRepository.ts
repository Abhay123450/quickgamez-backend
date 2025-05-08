import { Reaction } from "../../constants/CommentReaction.js";
import { Comment, NewComment, NewReply } from "./Comment.js";
import { CommentReaction } from "./CommentReaction.js";
import { Sort } from "./CommentService.js";

export interface CommentRepository {
    addComment(comment: NewComment): Promise<Comment | null>;
    getCommentsByGameId(
        gameId: string,
        page: number,
        limit: number,
        sort: Sort
    ): Promise<Partial<Comment>[]>;
    getCommentsByUserId(userId: string): Promise<Comment[]>;
    updateComment(
        commentId: string,
        comment: Partial<Comment>
    ): Promise<boolean>;
    increamentCount(
        commentId: string,
        likeCount: number,
        dislikeCount: number,
        replyCount: number,
        activityCount: number
    ): Promise<boolean>;
    deleteComment(commentId: string, userId: string): Promise<boolean>;
    addReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean>;
    removeReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean>;
    updateReaction(
        commentId: string,
        userId: string,
        reaction: Reaction
    ): Promise<boolean>;
    getMyReaction(
        commentId: string,
        userId: string
    ): Promise<CommentReaction | null>;
    getMyReactions(
        commentIdList: string[],
        userId: string
    ): Promise<CommentReaction[] | null>;
    addReply(reply: NewReply): Promise<Comment | null>;
    getRepliesByCommentId(
        commentId: string,
        page: number,
        limit: number
    ): Promise<Partial<Comment>[]>;
    reportComment(
        commentId: string,
        userId: string,
        reason: string
    ): Promise<boolean>;
    getReportedComments(): Promise<Partial<Comment>[]>;
}

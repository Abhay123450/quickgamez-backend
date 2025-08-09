import { Comment, NewComment, NewReply } from "./Comment.js";

export enum Sort {
    NewestFirst = 0,
    OldestFirst = 1,
    PopularFirst = 2
}

export interface CommentService {
    addComment(comment: NewComment): Promise<Comment | null>;
    getCommentsByGameId(
        gameId: string,
        page: number,
        limit: number,
        sort: Sort,
        userId?: string
    ): Promise<Comment[]>;
    getCommentsByUserId(
        userId: string,
        page: number,
        limit: number
    ): Promise<Comment[]>;
    deleteComment(commentId: string, userId: string): Promise<boolean>;
    likeComment(commentId: string, userId: string): Promise<boolean>;
    unlikeComment(commentId: string, userId: string): Promise<boolean>;
    dislikeComment(commentId: string, userId: string): Promise<boolean>;
    undislikeComment(commentId: string, userId: string): Promise<boolean>;
    addReply(reply: NewReply): Promise<Comment | null>;
    getRepliesByCommentId(
        commentId: string,
        page: number,
        limit: number,
        userId?: string
    ): Promise<Partial<Comment>[]>;
    reportComment(
        commentId: string,
        userId: string,
        reason: string
    ): Promise<boolean>;
    getReportedComments(): Promise<any>;
}

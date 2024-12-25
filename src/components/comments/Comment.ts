import { User } from "../users/User.js";

export interface NewComment {
    text: string;
    game: string;
    userId: string;
}

export interface Comment extends Omit<NewComment, "userId"> {
    commentId: string;
    user: Pick<User, "userId" | "username" | "name">;
    replyToComment: Pick<Comment, "commentId" | "user"> | null;
    parentCommentId: string | null;
    likeCount: number;
    dislikeCount: number;
    replyCount: number;
    activityCount: number; // total number of reactions and replies
    createdAt: Date;
    updatedAt: Date;
    myReaction: "like" | "dislike" | null;
}

export interface NewReply extends NewComment {
    replyToCommentId: string;
    parentCommentId: string;
}

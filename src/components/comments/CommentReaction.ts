import { Reaction } from "../../constants/CommentReaction.js";

export interface CommentReaction {
    commentId: string;
    userId: string;
    reaction: Reaction;
}

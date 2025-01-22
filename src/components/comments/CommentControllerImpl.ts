import { NextFunction, Request, Response } from "express";
import { CommentService, Sort } from "./CommentService.js";
import { ServerError, ValidationError } from "../../utils/AppErrors.js";
import { CommentController } from "./CommentController.js";
import { sendResponseSuccess } from "../../utils/sendResponse.js";
import { NewReply } from "./Comment.js";
import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";
import { parse } from "path";
import { matchedData, validationResult } from "express-validator";

export class CommentControllerImpl implements CommentController {
    _commentService: CommentService;

    constructor(commentService: CommentService) {
        this._commentService = commentService;
    }

    async addComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { comment, game } = req.body;

        if (!comment || !game) {
            throw new ValidationError(["Either comment or game is missing"]);
        }

        const commentAdded = await this._commentService.addComment({
            text: comment,
            game,
            userId: req.user.userId
        });

        if (!commentAdded) {
            throw new ServerError("Failed to add comment");
        }

        sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Comment added successfully",
            commentAdded
        );
    }

    async getComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { game, page, limit, sort } = matchedData(req);

        sendResponseSuccess(
            res,
            await this._commentService.getCommentsByGameId(
                game,
                page,
                (limit as number) || 10,
                Sort.OldestFirst,
                req.user?.userId
            )
        );
    }
    async deleteComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async likeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { commentId } = req.params;
        const { userId } = req.user;
        if (!commentId) {
            throw new ValidationError(["Comment id is missing"]);
        }
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const commentLiked = await this._commentService.likeComment(
            commentId,
            userId
        );
        if (!commentLiked) {
            throw new ServerError("Failed to like comment");
        }
        sendResponseSuccess(res, "Comment liked successfully");
    }
    async unlikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { commentId } = req.params;
        const { userId } = req.user;
        if (!commentId) {
            throw new ValidationError(["Comment id is missing"]);
        }
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const commentUnliked = await this._commentService.unlikeComment(
            commentId,
            userId
        );
        if (!commentUnliked) {
            throw new ServerError("Failed to unlike comment");
        }
        sendResponseSuccess(res, "Comment unliked successfully");
    }
    async dislikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { commentId } = req.params;
        const { userId } = req.user;
        if (!commentId) {
            throw new ValidationError(["Comment id is missing"]);
        }
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const commentDisliked = await this._commentService.dislikeComment(
            commentId,
            userId
        );
        if (!commentDisliked) {
            throw new ServerError("Failed to dislike comment");
        }
        sendResponseSuccess(res, "Comment disliked successfully");
    }
    async undislikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { commentId } = req.params;
        const { userId } = req.user;
        if (!commentId) {
            throw new ValidationError(["Comment id is missing"]);
        }
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const commentUndisliked = await this._commentService.undislikeComment(
            commentId,
            userId
        );
        if (!commentUndisliked) {
            throw new ServerError("Failed to undislike comment");
        }
        sendResponseSuccess(res, "Comment undisliked successfully");
    }
    async addReply(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { comment, game, replyToCommentId, parentCommentId } = req.body;
        const { userId } = req.user;
        if (
            !comment ||
            !game ||
            !replyToCommentId ||
            !parentCommentId ||
            !userId
        ) {
            throw new ValidationError(["Either comment or game is missing"]);
        }
        const reply: NewReply = {
            text: comment,
            game,
            replyToCommentId,
            parentCommentId,
            userId
        };
        const replyAdded = await this._commentService.addReply(reply);

        if (!replyAdded) {
            throw new ServerError("Failed to add reply");
        }

        sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Reply added successfully",
            replyAdded
        );
    }
    async getRepliesByCommentId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { commentId } = req.params;
        const { page, limit } = req.query;
        if (!commentId) {
            throw new ValidationError(["Comment id is missing"]);
        }
        const replies = await this._commentService.getRepliesByCommentId(
            commentId,
            page ? parseInt(page as string) : 1,
            limit ? parseInt(limit as string) : 10,
            req.user?.userId
        );
        sendResponseSuccess(res, replies);
    }
}

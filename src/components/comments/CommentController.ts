import { NextFunction, Request, Response } from "express";

export interface CommentController {
    addComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    likeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    unlikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    dislikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    undislikeComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    addReply(req: Request, res: Response, next: NextFunction): Promise<void>;
    getRepliesByCommentId(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    reportComment(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    getReportedComments(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
}

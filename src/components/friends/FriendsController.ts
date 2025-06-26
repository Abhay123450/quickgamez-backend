import { NextFunction, Request, Response } from "express";

export interface FriendController {
    sendFriendRequest: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;
    acceptFriendRequest: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;
    rejectFriendRequest: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;
    removeFriend: (req: Request, res: Response, next: NextFunction) => void;
    getMyFriends: (req: Request, res: Response, next: NextFunction) => void;
}

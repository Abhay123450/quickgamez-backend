import { NextFunction, Request, Response } from "express";

export interface NotificationController {
    addNotification(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    getNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    getUnreadNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    markNotificationAsRead(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    getRecentNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
}

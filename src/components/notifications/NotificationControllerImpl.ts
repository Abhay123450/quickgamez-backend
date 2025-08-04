import { Request, Response, NextFunction } from "express";
import { NotificationController } from "./NotificationController.js";
import { NotificationService } from "./NotificationService.js";
import { matchedData, validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../utils/AppErrors.js";
import { sendResponseSuccess } from "../../utils/sendResponse.js";

export class NotificationControllerImpl implements NotificationController {
    private _notificationService: NotificationService;

    constructor(notificationService: NotificationService) {
        this._notificationService = notificationService;
    }
    async addNotification(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { userId, message, action, payload, type } = req.body;

        const notification =
            await this._notificationService.createNewNotification({
                userId,
                message,
                action,
                payload,
                type
            });

        if (!notification) {
            throw new ServerError("Notification not created");
        }

        sendResponseSuccess(res);
    }
    async getNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages: string[] = errors
            .array()
            .map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { page, limit } = matchedData(req);

        const notifications = await this._notificationService.getNotifications(
            {},
            page,
            limit
        );

        if (!notifications) {
            throw new ValidationError(["Notifications not found"]);
        }

        sendResponseSuccess(res, notifications);
    }
    async getUnreadNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userId = req.user.userId;
        if (!userId) {
            throw new ValidationError(["User Id is required"]);
        }

        const notifications =
            await this._notificationService.getUnreadNotifications(
                userId,
                1,
                25
            );

        if (!notifications) {
            throw new ServerError("Notifications not found");
        }

        sendResponseSuccess(res, notifications);
    }

    async markNotificationAsRead(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const notificationId = req.params.notificationId;
        if (!notificationId) {
            throw new ValidationError(["Notification Id is required"]);
        }

        const notificationMarkedAsRead =
            await this._notificationService.markNotificationAsRead(
                notificationId,
                req.user.userId
            );

        if (!notificationMarkedAsRead) {
            throw new ServerError("Notification not marked as read");
        }

        sendResponseSuccess(res, "Notification marked as read");
    }

    async getRecentNotifications(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const userId = req.user.userId;
        if (!userId) {
            throw new ValidationError(["User Id is required"]);
        }
        const notifications =
            await this._notificationService.getRecentNotifications(
                req.user.userId
            );
        if (!notifications) {
            throw new ServerError("Notifications not found");
        }
        sendResponseSuccess(res, notifications);
    }
}

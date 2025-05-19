import { Types } from "mongoose";
import { NewNotification, Notification } from "./Notification.js";
import {
    NotificationDocument,
    NotificationModel
} from "./notification.model.js";
import { NotificationRepository } from "./NotificationReposiitory.js";

export class NotificationRepositoryImpl implements NotificationRepository {
    async saveNotification(notification: NewNotification): Promise<boolean> {
        const notificationSchema = new NotificationModel(notification);
        const notifcationSaved = await notificationSchema.save();
        if (!notifcationSaved) {
            return false;
        }
        return true;
    }

    async getNotifications(
        filter: Partial<Notification>,
        page: number,
        limit: number
    ): Promise<Notification[]> {
        const _filter: Partial<NotificationDocument> = {};
        if (_filter.userId) _filter.userId = new Types.ObjectId(_filter.userId);
        const notifications = await NotificationModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        return notifications.map((notification) =>
            this._convertToNotification(notification)
        );
    }

    async getRecentNotifications(userId: string): Promise<Notification[]> {
        let notifications = await NotificationModel.find({
            userId,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({
            createdAt: -1
        });
        if (notifications.length > 15) {
            notifications = notifications.filter(
                (notification) => !notification.isRead
            );
        }
        return notifications.map((notification) =>
            this._convertToNotification(notification)
        );
    }

    async markNotificationAsRead(
        notificationId: string,
        userId: string
    ): Promise<boolean> {
        const notification = await NotificationModel.findOneAndUpdate(
            { _id: notificationId, userId },
            { isRead: true }
        );
        if (!notification) return false;
        return true;
    }

    private _convertToNotification(notification: any): Notification {
        return {
            notificationId: notification._id.toString(),
            userId: notification.userId.toString(),
            message: notification.message,
            isRead: notification.isRead,
            action: notification.action,
            payload: notification.payload,
            createdAt: notification.createdAt,
            updatedAt: notification.updatedAt,
            type: notification.type
        };
    }
}

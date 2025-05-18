import { User } from "../users/User.js";
import { NewNotification, Notification } from "./Notification.js";

export interface NotificationRepository {
    saveNotification(notification: NewNotification): Promise<boolean>;
    getNotifications(
        filter: Partial<Notification>,
        page: number,
        limit: number
    ): Promise<Notification[]>;
    getRecentNotifications(userId: User["userId"]): Promise<Notification[]>;
    markNotificationAsRead(
        notificationId: Notification["notificationId"],
        userId: User["userId"]
    ): Promise<boolean>;
}

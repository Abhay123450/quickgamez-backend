import { User } from "../users/User.js";
import { NewNotification, Notification } from "./Notification.js";

export interface NotificationService {
    createNewNotification(notification: NewNotification): Promise<boolean>;
    getNotifications(
        filter: Partial<Notification>,
        page: number,
        Limit: number
    ): Promise<Notification[]>;
    getUnreadNotifications(
        userId: User["userId"],
        page: number,
        Limit: number
    ): Promise<Notification[]>;
    getRecentNotifications(userId: User["userId"]): Promise<Notification[]>;
    markNotificationAsRead(
        notificationId: Notification["notificationId"],
        userId: User["userId"]
    ): Promise<boolean>;
}

import { ClientError } from "../../utils/AppErrors.js";
import { User } from "../users/User.js";
import { NewNotification, Notification } from "./Notification.js";
import { NotificationRepository } from "./NotificationReposiitory.js";
import { NotificationService } from "./NotificationService.js";

export class NotificationServiceImpl implements NotificationService {
    private _notificationRepository: NotificationRepository;
    constructor(notificationRepository: NotificationRepository) {
        this._notificationRepository = notificationRepository;
    }
    async createNewNotification(
        notification: NewNotification
    ): Promise<boolean> {
        const notificationSaved =
            await this._notificationRepository.saveNotification(notification);
        return notificationSaved;
    }
    async getNotifications(
        filter: Partial<Notification>,
        page: number,
        Limit: number
    ): Promise<Notification[]> {
        return await this._notificationRepository.getNotifications(
            filter,
            page,
            Limit
        );
    }
    async getUnreadNotifications(
        userId: User["userId"],
        page: number,
        Limit: number
    ): Promise<Notification[]> {
        const filter: Partial<Notification> = { userId, isRead: false };
        return await this._notificationRepository.getNotifications(
            filter,
            page,
            Limit
        );
    }
    async getRecentNotifications(
        userId: User["userId"]
    ): Promise<Notification[]> {
        return await this._notificationRepository.getRecentNotifications(
            userId
        );
    }
    async markNotificationAsRead(
        notificationId: Notification["notificationId"],
        userId: User["userId"]
    ): Promise<boolean> {
        if (!notificationId)
            throw new ClientError("Notification Id is required");
        if (!userId) throw new ClientError("User Id is required");
        return await this._notificationRepository.markNotificationAsRead(
            notificationId,
            userId
        );
    }
}

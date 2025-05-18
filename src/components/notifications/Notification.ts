export const NotificationActions = {
    OPEN_PROFILE: "open_profile",
    OPEN_COMMENT: "open_comment"
} as const;

export type NotificationAction =
    (typeof NotificationActions)[keyof typeof NotificationActions];

export interface NewNotification {
    userId: string;
    message: string;
    action: NotificationAction;
    payload: any | null | undefined;
    type: "normal" | "important";
}

export interface Notification extends NewNotification {
    notificationId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

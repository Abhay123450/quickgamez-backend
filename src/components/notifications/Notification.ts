export const NotificationActions = {
    OPEN_PROFILE: "open_profile",
    OPEN_COMMENT: "open_comment",
    FRIEND_REQUEST: "friend_request",
    SHOW_FRIENDS: "show_friends"
} as const;

export const notificationTypes = [
    "normal",
    "important",
    "friend_request"
] as const;

export type NotificationAction =
    (typeof NotificationActions)[keyof typeof NotificationActions];

export interface NewNotification {
    userId: string;
    message: string;
    action: NotificationAction;
    payload: any | null | undefined;
    type: (typeof notificationTypes)[number];
}

export interface Notification extends NewNotification {
    notificationId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;
}

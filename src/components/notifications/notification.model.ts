import { Document, model, Schema, Types } from "mongoose";
import {
    Notification,
    NotificationActions,
    notificationTypes
} from "./Notification.js";

export interface NotificationDocument
    extends Omit<Notification, "userId">,
        Document {
    userId: Types.ObjectId;
}

export const notificationSchema = new Schema<NotificationDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true
        },
        isRead: {
            type: Boolean,
            default: false
        },
        action: {
            type: String,
            required: true,
            enum: Object.values(NotificationActions)
        },
        payload: {
            type: Schema.Types.Mixed
        },
        type: {
            type: String,
            required: true,
            enum: notificationTypes,
            default: "normal"
        }
    },
    {
        timestamps: true
    }
);

notificationSchema.methods.toJSON = function () {
    const notification = this.toObject();
    notification.id = notification._id;
    delete notification._id;
    delete notification.__v;
    return notification;
};

export const NotificationModel = model<NotificationDocument>(
    "Notification",
    notificationSchema,
    "notifications"
);

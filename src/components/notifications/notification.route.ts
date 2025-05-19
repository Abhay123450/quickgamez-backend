import { Router } from "express";
import { NotificationRepositoryImpl } from "./NotificationRepositoryImpl.js";
import { NotificationServiceImpl } from "./NotificationServiceImpl.js";
import { validateGetNotificationsReq } from "./notification.validate.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import { NotificationControllerImpl } from "./NotificationControllerImpl.js";
import { authenticateUser } from "../../middlewares/userAuth.middleware.js";

const router = Router();

const notificationRepository = new NotificationRepositoryImpl();
const notificationService = new NotificationServiceImpl(notificationRepository);
const notificationController = new NotificationControllerImpl(
    notificationService
);

router
    .route("/notifications")
    .get(
        validateGetNotificationsReq(),
        catchAsycError(
            notificationController.getNotifications.bind(notificationController)
        )
    )
    .post(
        authenticateUser,
        catchAsycError(
            notificationController.addNotification.bind(notificationController)
        )
    );

router
    .route("/notifications/unread")
    .get(
        authenticateUser,
        catchAsycError(
            notificationController.getUnreadNotifications.bind(
                notificationController
            )
        )
    );

router
    .route("/notifications/recent")
    .get(
        authenticateUser,
        catchAsycError(
            notificationController.getRecentNotifications.bind(
                notificationController
            )
        )
    );

router
    .route("/notifications/:notificationId/read")
    .put(
        authenticateUser,
        catchAsycError(
            notificationController.markNotificationAsRead.bind(
                notificationController
            )
        )
    );

export const notificationRouter = router;

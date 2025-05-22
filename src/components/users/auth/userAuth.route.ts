import { Router } from "express";
import { UserAuthControllerImpl } from "./UserAuthControllerImpl.js";
import { UserRepositoryImpl } from "../UserRepositoryImpl.js";
import { UserAuthServiceImpl } from "./UserAuthServiceImpl.js";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { decodeRefreshToken } from "../../../middlewares/userAuth.middleware.js";
import { blacklistToken } from "../../../middlewares/blacklistToken.middleware.js";
import { validateEmail } from "../user.validate.js";
import { UserServiceImpl } from "../UserServiceImpl.js";
import { EmailServiceImpl } from "../../email/EmailServiceImpl.js";
import { NotificationServiceImpl } from "../../notifications/NotificationServiceImpl.js";
import { NotificationRepositoryImpl } from "../../notifications/NotificationRepositoryImpl.js";
const router = Router();

const userRepository = new UserRepositoryImpl();
const emailService = new EmailServiceImpl();
const notificationRepository = new NotificationRepositoryImpl();
const notificationService = new NotificationServiceImpl(notificationRepository);
const userAuthService = new UserAuthServiceImpl(userRepository, emailService);
const userService = new UserServiceImpl(
    userRepository,
    emailService,
    notificationService
);
const userAuthController = new UserAuthControllerImpl(
    userAuthService,
    userService
);

router
    .route("/auth/login")
    .post(catchAsycError(userAuthController.login.bind(userAuthController)));

router
    .route("/auth/access-token")
    .get(
        decodeRefreshToken,
        catchAsycError(
            userAuthController.getAccessToken.bind(userAuthController)
        )
    );

router
    .route("/auth/forgot-password")
    .post(
        validateEmail(),
        catchAsycError(
            userAuthController.sendOtpToEmail.bind(userAuthController)
        )
    );

router
    .route("/auth/send-email-otp")
    .post(
        validateEmail(),
        catchAsycError(
            userAuthController.sendOtpToEmail.bind(userAuthController)
        )
    );

router
    .route("/auth/verify-email")
    .post(
        catchAsycError(
            userAuthController.verifyEmailWithOtp.bind(userAuthController)
        )
    );

router
    .route("/auth/reset-password")
    .post(
        catchAsycError(
            userAuthController.resetPassword.bind(userAuthController)
        )
    );

router
    .route("/auth/logout")
    .post(
        decodeRefreshToken,
        catchAsycError(userAuthController.logout.bind(userAuthController)),
        catchAsycError(blacklistToken.bind(blacklistToken))
    );

export const userAuthRouter = router;

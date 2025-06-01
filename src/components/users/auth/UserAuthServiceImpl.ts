import { ErrorCode } from "../../../constants/ErrorCode.enum.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { UserAccountStatus } from "../../../constants/userAccountStatus.enum.js";
import {
    AuthenticationError,
    ClientError,
    ServerError
} from "../../../utils/AppErrors.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { generateSecureRandomString } from "../../../utils/generateSecureRandomString.js";
import { generateOtp } from "../../../utils/otpUtil.js";
import { isPasswordMatched } from "../../../utils/passwordUtil.js";
import { EmailService } from "../../email/EmailService.js";
import { NotificationService } from "../../notifications/NotificationService.js";
import { User } from "../User.js";
import { UserRepository } from "../UserRepository.js";
import { UserAuthService } from "./UserAuthService.js";

import jwt from "jsonwebtoken";

export class UserAuthServiceImpl implements UserAuthService {
    private _userRepository: UserRepository;
    private _emailService: EmailService;
    private _notificationService: NotificationService;
    constructor(
        userRepository: UserRepository,
        emailService: EmailService,
        notificationService: NotificationService
    ) {
        this._userRepository = userRepository;
        this._emailService = emailService;
        this._notificationService = notificationService;
    }

    async login(
        userId: string,
        password: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Partial<User>;
    }> {
        const user: Partial<User> | null =
            await this._userRepository.getUserByEmailOrUsername(userId, [
                "password",
                "accountStatus",
                "username",
                "name",
                "email",
                "role",
                "createdAt"
            ]);

        if (!user || !user.password || !user.userId) {
            throw new AuthenticationError(
                "Invalid Username or Password.",
                ErrorCode.INVALID_CREDENTIALS
            );
        }

        const isPasswordCorrect = await isPasswordMatched(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new AuthenticationError(
                "Invalid Username or Password.",
                ErrorCode.INVALID_CREDENTIALS
            );
        }

        switch (user.accountStatus) {
            case UserAccountStatus.UNVERIFIED:
                throw new AuthenticationError(
                    "Please verify your email.",
                    ErrorCode.EMAIL_NOT_VERIFIED
                );
            case UserAccountStatus.BLOCKED:
                throw new AuthenticationError(
                    "Account blocked.",
                    ErrorCode.ACCOUNT_BLOCKED
                );
        }

        const accessToken = await this._generateAccessToken(user.userId);
        const refreshToken = await this._generateRefreshToken(user.userId);

        const isTokenSaved = await this._userRepository.saveRefreshToken(
            user.userId,
            refreshToken
        );

        if (!isTokenSaved) {
            throw new ServerError("Failed to save token.");
        }

        return {
            accessToken,
            refreshToken,
            user: this._deleteSensitiveData(user)
        };
    }

    async signinWithGoogle(
        user: Pick<User, "name" | "email" | "googleId" | "profileImage">
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Partial<User>;
    }> {
        if (!user.googleId || !user.email || !user.name) {
            throw new ClientError(
                "Missing required fields.",
                HttpStatusCode.BAD_REQUEST
            );
        }
        let userExists = await this._userRepository.getUser({
            googleId: user.googleId
        });

        if (!userExists) {
            const emailExists =
                await this._userRepository.getUserByEmailOrUsername(user.email);

            if (emailExists && emailExists.authProvider === "email") {
                throw new ClientError(
                    "Please login with your email and password.",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const username =
                user.name.split(" ")[0].slice(0, 8) +
                generateSecureRandomString(12);

            const newUser = await this._userRepository.addUser({
                username,
                name: user.name,
                email: user.email,
                googleId: user.googleId,
                profileImage: user.profileImage,
                authProvider: "google",
                accountStatus: UserAccountStatus.ACTIVE
            });

            if (!newUser) {
                throw new ServerError("Failed to add user.");
            }

            this._notificationService.createNewNotification({
                type: "important",
                userId: newUser.userId,
                message: "Claim your unique username now!",
                action: "open_profile",
                payload: {}
            });

            userExists = newUser;
        }

        switch (userExists.accountStatus) {
            case UserAccountStatus.UNVERIFIED:
                throw new AuthenticationError(
                    "Please verify your email.",
                    ErrorCode.EMAIL_NOT_VERIFIED
                );
            case UserAccountStatus.BLOCKED:
                throw new AuthenticationError(
                    "Account blocked.",
                    ErrorCode.ACCOUNT_BLOCKED
                );
        }

        if (!userExists || !userExists.userId) {
            throw new ServerError("Failed to get user.");
        }

        const accessToken = await this._generateAccessToken(userExists.userId);
        const refreshToken = await this._generateRefreshToken(
            userExists.userId
        );

        const isTokenSaved = await this._userRepository.saveRefreshToken(
            userExists.userId,
            refreshToken
        );

        if (!isTokenSaved) {
            throw new ServerError("Failed to save token.");
        }

        return {
            accessToken,
            refreshToken,
            user: this._deleteSensitiveData(userExists)
        };
    }

    async logout(userId: string, refreshToken: string) {
        const isTokenDeleted = await this._userRepository.deleteRefreshToken(
            userId,
            refreshToken
        );

        if (!isTokenDeleted) {
            throw new ServerError("Failed to delete token.");
        }

        return true;
    }

    async getAccessToken(userId: string): Promise<string> {
        const fieldsToSelect: (keyof User)[] = [];
        const user: Partial<User> | null =
            await this._userRepository.getUserById(userId, fieldsToSelect);
        if (!user || !user.userId) {
            throw new ClientError("User not found", HttpStatusCode.NOT_FOUND);
        }
        return this._generateAccessToken(user.userId);
    }

    async verifyEmailWithOtp(email: string, otp: number): Promise<boolean> {
        const user: Partial<User> | null =
            await this._userRepository.getUserByEmailOrUsername(email, [
                "userId",
                "accountStatus",
                "email",
                "emailOtp"
            ]);
        if (!user || !user.userId || !user.emailOtp) {
            throw new ClientError(
                `Email: ${email} not found.`,
                HttpStatusCode.NOT_FOUND
            );
        }

        if (
            !this._isOtpValid(otp, user.emailOtp.otp, user.emailOtp.expiresAt)
        ) {
            return false;
        }

        const userUpdated = await this._userRepository.updateUser(user.userId, {
            accountStatus: UserAccountStatus.ACTIVE
        });

        if (!userUpdated) {
            throw new ServerError(
                `Failed to update user after verifying email: ${email}`
            );
        }

        return true;
    }

    async saveAndSendEmailOtp(email: string): Promise<boolean> {
        const otp = generateOtp(6);
        const otpSaved = await this._userRepository.saveOtp(email, otp);
        if (!otpSaved) {
            throw new ServerError(`Failed to save otp for email: ${email}`);
        }
        //  send email
        this._emailService.sendVerificationOTPEmail(email, otp);
        return true;
    }

    async resetPassword(
        email: string,
        otp: number,
        newPassword: string
    ): Promise<boolean> {
        const isPasswordUpdated = await this._userRepository.updatePassword(
            email,
            otp,
            newPassword
        );
        if (isPasswordUpdated) {
            this._emailService.sendPasswordChangedEmail(email);
        }
        return isPasswordUpdated;
    }

    private _isOtpValid(
        otpToCheck: number,
        otp: number,
        expiresAt: Date
    ): boolean {
        return otpToCheck === otp && expiresAt > new Date();
    }

    private async _generateAccessToken(userId: string): Promise<string> {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn:
                Number(process.env.ACCESS_TOKEN_VALIDITY) || 60 * 60 * 1000 // 1 hour
        });
    }

    private async _generateRefreshToken(userId: string): Promise<string> {
        return jwt.sign(
            { userId },
            process.env.REFRESH_TOKEN_SECRET as string,
            {
                expiresIn:
                    Number(process.env.REFRESH_TOKEN_VALIDITY) ||
                    120 * 24 * 60 * 60 * 1000
            }
        );
    }

    private _deleteSensitiveData(user: Partial<User>): Partial<User> {
        delete user.password;
        delete user.refreshTokens;
        delete user.emailOtp;
        delete user.deviceTokens;
        delete user.googleId;
        return user;
    }
}

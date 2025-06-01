import { NextFunction, Request, Response } from "express";
import { UserAuthController } from "./UserAuthController.js";
import { UserAuthService } from "./UserAuthService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import {
    AuthenticationError,
    ClientError,
    ServerError,
    ValidationError
} from "../../../utils/AppErrors.js";
import { matchedData, validationResult } from "express-validator";
import { UserService } from "../UserService.js";
import { OAuth2Client } from "google-auth-library";
export class UserAuthControllerImpl implements UserAuthController {
    private _userAuthService: UserAuthService;
    private _userService: UserService;
    private _googleClient = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID as string
    );
    constructor(userAuthService: UserAuthService, userService: UserService) {
        this._userAuthService = userAuthService;
        this._userService = userService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            throw new ClientError("Invalid credentials");
        }

        const { accessToken, refreshToken, user } =
            await this._userAuthService.login(username || email, password);

        const refreshTokenValidity: number =
            Number(process.env.REFRESH_TOKEN_VALIDITY) ||
            120 * 24 * 60 * 60 * 1000; // 120 days;
        const refreshTokenValidTill: number = Date.now() + refreshTokenValidity;
        const accessTokenValidity: number =
            Number(process.env.ACCESS_TOKEN_VALIDITY) || 60 * 60 * 1000; // 1 hour

        const accessTokenValidTill: number =
            parseInt(Date.now().toString()) +
            parseInt(accessTokenValidity.toString());

        // try {
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenValidity
        })
            .cookie("refreshTokenValidTill", refreshTokenValidTill, {
                httpOnly: false,
                maxAge: refreshTokenValidity
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: accessTokenValidity
            })
            .cookie("accessTokenValidTill", accessTokenValidTill, {
                httpOnly: false,
                maxAge: accessTokenValidity
            })
            .status(HttpStatusCode.OK)
            .json({
                success: true,
                message: "Login successful",
                accessToken,
                accessTokenValidTill,
                refreshToken,
                refreshTokenValidTill,
                user
            });
        return;
    }
    async logout(req: Request, res: Response, next: NextFunction) {
        const refreshToken =
            req.cookies.refreshToken || req.headers["refreshtoken"];
        const accessToken = req.headers["authorization"]?.replace(
            "Bearer ",
            ""
        );
        req.accessToken = accessToken;

        ConsoleLog.info(`req.userId: ${req.userId}`);
        if (refreshToken && req.userId) {
            // remove from db
            const isTokenDeleted = await this._userAuthService.logout(
                req.userId,
                refreshToken
            );
            ConsoleLog.info(`isTokenDeleted: ${isTokenDeleted}`);
        }

        // clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true
        })
            .clearCookie("accessToken", {
                httpOnly: true
            })
            .clearCookie("refreshTokenValidTill")
            .clearCookie("accessTokenValidTill");

        sendResponseSuccess(res, "Logout successful");
        next();
    }
    async getAccessToken(req: Request, res: Response, next: NextFunction) {
        const userId = req.userId;
        if (!userId) {
            throw new AuthenticationError("Login required.");
        }
        const accessToken = await this._userAuthService.getAccessToken(userId);
        const accessTokenValidity: number =
            parseInt(process.env.ACCESS_TOKEN_VALIDITY as string) ||
            60 * 60 * 1000;

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: accessTokenValidity
        })
            .cookie("accessTokenValidTill", Date.now() + accessTokenValidity, {
                httpOnly: false,
                maxAge: accessTokenValidity
            })
            .status(HttpStatusCode.OK)
            .json({
                success: true,
                message: "Access token generated successfully",
                accessToken,
                accessTokenValidity
            });
        return;
    }

    async sendOtpToEmail(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages: string[] = errors
            .array()
            .map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { email } = matchedData(req);
        console.log(`email: ${email}`);

        const user = await this._userService.getUserByEmailOrUsername(email);
        if (!user) {
            throw new ClientError("User not found");
        }

        const isEmailSent = await this._userAuthService.saveAndSendEmailOtp(
            email
        );
        if (!isEmailSent) {
            throw new ServerError(
                "Failed to send OTP. Please try again later."
            );
        }
        sendResponseSuccess(res, "OTP sent successfully");
    }

    async verifyEmailWithOtp(req: Request, res: Response, next: NextFunction) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ClientError("Invalid credentials");
        }

        ConsoleLog.info(`email: ${email}, otp: ${otp}`);
        const isEmailVerified = await this._userAuthService.verifyEmailWithOtp(
            email,
            parseInt(otp)
        );
        ConsoleLog.info(`isEmailVerified: ${isEmailVerified}`);
        if (!isEmailVerified) {
            throw new ClientError(
                "Incorrect OTP. Failed to verify email. Try again."
            );
        }

        sendResponseSuccess(res, "Email verified successfully");
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            throw new ClientError("Invalid credentials");
        }

        const isPasswordReset = await this._userAuthService.resetPassword(
            email,
            otp,
            newPassword
        );

        if (!isPasswordReset) {
            throw new ClientError(
                "Failed to reset password because otp expired. Try again."
            );
        }

        sendResponseSuccess(res, "Password updated successfully");
    }

    async signinWithGoogle(req: Request, res: Response, next: NextFunction) {
        const { idToken } = req.body;
        const credentials = this._decodeJWT(idToken);

        const ticket = await this._googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.WEB_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new ClientError("Payload not found");
        }

        if (!payload.email_verified) {
            throw new ClientError("Email not verified");
        }

        // "iss":"https://accounts.google.com","azp":"231088337140-j5qomdu7q1q1aa2bfmc0kpircbiqt732.apps.googleusercontent.com","aud":"231088337140-j5qomdu7q1q1aa2bfmc0kpircbiqt732.apps.googleusercontent.com","sub":"111837340735816710941","email":"abhay123450@gmail.com","email_verified":true,"nbf":1748164290,"name":"Abhay Anand","picture":"https://lh3.googleusercontent.com/a/ACg8ocKmDHt5lMMlvffbFBf9m7KOz-D8AyzRAhnOhc632P_EA05OHw=s96-c","given_name":"Abhay","family_name":"Anand","iat":1748164590,"exp":1748168190,"jti":"830cf8163af07aba259227a74fc9233ddcfea744"
        const userGoogleId = payload["sub"];
        const name = payload["name"];
        const email = payload["email"];
        const picture = payload["picture"];

        if (!name || !email || !userGoogleId) {
            throw new ClientError("Error in getting user details");
        }

        const { accessToken, refreshToken, user } =
            await this._userAuthService.signinWithGoogle({
                name,
                email,
                googleId: userGoogleId,
                profileImage: picture
            });

        const refreshTokenValidity: number =
            Number(process.env.REFRESH_TOKEN_VALIDITY) ||
            120 * 24 * 60 * 60 * 1000; // 120 days;
        const refreshTokenValidTill: number = Date.now() + refreshTokenValidity;
        const accessTokenValidity: number =
            Number(process.env.ACCESS_TOKEN_VALIDITY) || 60 * 60 * 1000; // 1 hour

        const accessTokenValidTill: number =
            parseInt(Date.now().toString()) +
            parseInt(accessTokenValidity.toString());

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: refreshTokenValidity
        })
            .cookie("refreshTokenValidTill", refreshTokenValidTill, {
                httpOnly: false,
                maxAge: refreshTokenValidity
            })
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: accessTokenValidity
            })
            .cookie("accessTokenValidTill", accessTokenValidTill, {
                httpOnly: false,
                maxAge: accessTokenValidity
            })
            .status(HttpStatusCode.OK)
            .json({
                success: true,
                message: "Login successful",
                accessTokenValidTill,
                refreshTokenValidTill,
                user
            });
    }

    private _decodeJWT(token: any) {
        let base64Url = token.split(".")[1];
        let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        let jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    );
                })
                .join("")
        );
        return JSON.parse(jsonPayload);
    }
}

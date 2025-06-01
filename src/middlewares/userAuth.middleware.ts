import { NextFunction, Request, Response } from "express";
import { sendResponseClientError } from "../utils/sendResponse.js";
import jwt from "jsonwebtoken";
import { UserRole } from "../constants/userRole.enum.js";
import { User } from "../components/users/User.js";
import { UserRepositoryImpl } from "../components/users/UserRepositoryImpl.js";
import { UserAccountStatus } from "../constants/userAccountStatus.enum.js";
import { HttpStatusCode } from "../constants/httpStatusCode.enum.js";
import { TokenBlacklistModel } from "../components/users/auth/tokenBlacklist.model.js";
import { ConsoleLog } from "../utils/ConsoleLog.js";
import { AuthenticationError, AuthorizationError } from "../utils/AppErrors.js";
import { ErrorCode } from "../constants/ErrorCode.enum.js";

const userRepository = new UserRepositoryImpl();

/**
 * Authenticate the user using the access token provided in the request headers or cookies.
 * Verifies the access token and if valid, retrieves the user from the database.
 * Checks if the user is verified and not blocked.
 * If the user is valid, sets the user in the request object and calls the next middleware.
 * If the user is invalid, throws an AuthenticationError or AuthorizationError.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The express next middleware function.
 */
export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let accessToken: string | undefined;

        if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        } else {
            accessToken = req.headers["authorization"]?.replace("Bearer ", "");
        }

        if (!accessToken) {
            throw new AuthenticationError("No access token.Login required.");
        }

        const { userId } = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as { userId: string };

        const fieldsToSelect: (keyof User)[] = ["accountStatus", "role"];
        const user = await userRepository.getUserById(userId, fieldsToSelect);

        if (!user || !user.userId || !user.accountStatus || !user.role) {
            throw new AuthenticationError("Login required.");
        }

        if (user.accountStatus === UserAccountStatus.UNVERIFIED) {
            throw new AuthorizationError(
                "Account not verified.",
                ErrorCode.EMAIL_NOT_VERIFIED
            );
        } else if (user.accountStatus === UserAccountStatus.BLOCKED) {
            throw new AuthorizationError(
                "Account blocked.",
                ErrorCode.ACCOUNT_BLOCKED
            );
        }

        const isTokenBlacklisted: boolean | null =
            await TokenBlacklistModel.findOne({
                token: accessToken
            });

        if (isTokenBlacklisted) {
            throw new AuthenticationError(
                "Session Expired. Please login again.",
                ErrorCode.TOKEN_EXPIRED
            );
        }

        req.user = user as User;
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Use this if user authentication is optional. This middleware checks if the user is authenticated or not. If the user is authenticated, it adds the user object to the request object.
 *
 * It checks if the `accessToken` is present in the request cookies or authorization header.
 * If the token is valid, it fetches the user from the database and checks if the account is verified and not blocked.
 * If the account is verified and not blocked, it adds the user to the request object and calls the next middleware.
 * If the account is not verified or blocked, token is invalid or blacklisted, it calls the next middleware without adding the user to the request object.
 *
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware or route handler
 */
export async function isUserAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let accessToken: string | undefined;

        if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        } else {
            accessToken = req.headers["authorization"]?.replace("Bearer ", "");
        }

        if (!accessToken) {
            return next();
        }

        const { userId } = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as { userId: string };

        const fieldsToSelect: (keyof User)[] = ["accountStatus", "role"];
        const user = await userRepository.getUserById(userId, fieldsToSelect);

        if (!user || !user.userId || !user.accountStatus || !user.role) {
            return next();
        }

        if (user.accountStatus === UserAccountStatus.UNVERIFIED) {
            return next();
        } else if (user.accountStatus === UserAccountStatus.BLOCKED) {
            return next();
        }

        const isTokenBlacklisted: boolean | null =
            await TokenBlacklistModel.findOne({
                token: accessToken
            });

        if (isTokenBlacklisted) {
            return next();
        }

        req.user = user as User;
        next();
    } catch (error) {
        next();
    }
}

export function decodeAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let accessToken: string | undefined;

        if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        } else {
            accessToken = req.headers["authorization"]?.replace("Bearer ", "");
        }

        if (!accessToken) {
            throw new AuthenticationError(
                "Login required.",
                ErrorCode.LOGIN_REQUIRED
            );
        }

        const { userId } = jwt.verify(
            accessToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { userId: string };

        req.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
}

export function decodeRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let refreshToken: string | undefined;

        if (req.cookies?.refreshToken) {
            refreshToken = req.cookies.refreshToken;
        } else {
            refreshToken = Array.isArray(req.headers["refreshtoken"])
                ? req.headers["refreshtoken"][0]
                : req.headers["refreshtoken"];
        }

        if (!refreshToken) {
            throw new AuthenticationError(
                "Login required.",
                ErrorCode.LOGIN_REQUIRED
            );
        }

        const { userId } = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { userId: string };

        req.userId = userId;
        next();
    } catch (error) {
        next(error);
    }
}

export function authorizeRole(roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return sendResponseClientError(
                res,
                HttpStatusCode.FORBIDDEN,
                "Unauthorized"
            );
        }
        next();
    };
}

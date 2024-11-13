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

export async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        let accessToken: string | undefined;

        ConsoleLog.info(`req.cookies ${JSON.stringify(req.cookies)}`);

        if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
            ConsoleLog.info(`accessToken ${accessToken}`);
        } else {
            accessToken = req.headers["authorization"]?.replace("Bearer ", "");
            console.log(`authorizationHeader ${JSON.stringify(accessToken)}`);
        }

        if (!accessToken) {
            throw new AuthenticationError("No access token.Login required.");
        }

        const { userId } = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as { userId: string };

        console.log(`payload ${JSON.stringify(userId)}`);

        const fieldsToSelect: (keyof User)[] = ["accountStatus", "role"];
        const user = await userRepository.getUserById(userId, fieldsToSelect);
        console.log(`user ${JSON.stringify(user)}`);

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

        ConsoleLog.success(`user authenticated`);
        req.user = user as User;
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
            refreshToken = req.headers["authorization"]?.replace("Bearer ", "");
            console.log(`authorizationHeader ${JSON.stringify(refreshToken)}`);
        }
        ConsoleLog.info(`refreshToken ${refreshToken}`);

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

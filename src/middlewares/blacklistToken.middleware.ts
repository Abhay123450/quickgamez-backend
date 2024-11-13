import { Request, Response, NextFunction } from "express";
import { TokenBlacklistModel } from "../components/users/auth/tokenBlacklist.model.js";

export async function blacklistToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.accessToken;

    if (!token) {
        return next();
    }

    const blacklistedToken = new TokenBlacklistModel({
        token: token
    });

    await blacklistedToken.save();
    next();
}

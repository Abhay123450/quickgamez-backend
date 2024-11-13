import { NextFunction, Request, Response } from "express";

export interface UserAuthController {
    login(req: Request, res: Response, next: NextFunction): void;
    logout(req: Request, res: Response, next: NextFunction): void;
    getAccessToken(req: Request, res: Response, next: NextFunction): void;
    sendOtpToEmail(req: Request, res: Response, next: NextFunction): void;
    resetPassword(req: Request, res: Response, next: NextFunction): void;
    verifyEmailWithOtp(req: Request, res: Response, next: NextFunction): void;
}

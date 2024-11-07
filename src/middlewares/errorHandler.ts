import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { HttpStatusCode } from "../constants/httpStatusCode.enum.js";
import { ConsoleLog } from "../utils/ConsoleLog.js";
import {
    AuthenticationError,
    AuthorizationError,
    ClientError,
    ValidationError
} from "../utils/AppErrors.js";
const { TokenExpiredError } = jwt;

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        ConsoleLog.error(err);
        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errorCode: "SOME_ERROR"
            });
        } else if (err instanceof ValidationError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errorCode: err.errorCode,
                errors: err.errors
            });
        } else if (err instanceof TokenExpiredError) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                success: false,
                message: "Session expired. Please login again.",
                errorCode: "TOKEN_EXPIRED"
            });
        } else if (err instanceof AuthenticationError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errorCode: err.errorCode
            });
        } else if (err instanceof AuthorizationError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errorCode: err.errorCode
            });
        } else if (err instanceof ClientError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message,
                errorCode: "CLIENT_ERROR"
            });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal server error",
                errorCode: "INTERNAL_SERVER_ERROR"
            });
        }
    } catch (error) {
        ConsoleLog.error(error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
            errorCode: "INTERNAL_SERVER_ERROR"
        });
    }
};

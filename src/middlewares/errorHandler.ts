import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import {
    sendResponseClientError,
    sendResponseServerError
} from "../utils/sendResponse.js";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (err instanceof AppError) {
            sendResponseClientError(res, err.statusCode, err.message);
        } else if (err instanceof Error) {
            sendResponseClientError(res, err.message);
        }
    } catch (error) {
        console.log(error);
        sendResponseServerError(res);
    }
};

import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

exports.errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (err instanceof AppError) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: err.message || "Internal Server Error"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error has occurred."
        });
    }
};

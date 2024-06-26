import { NextFunction, Request, RequestHandler, Response } from "express";

export const catchAsycError =
    (thisFunction: RequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(thisFunction(req, res, next)).catch(next);
    };

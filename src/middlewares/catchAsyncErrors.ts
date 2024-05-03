import { NextFunction, Request, RequestHandler, Response } from "express";

exports.catchAsycError =
    (thisFunction: RequestHandler): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(thisFunction(req, res, next)).catch(next);
    };

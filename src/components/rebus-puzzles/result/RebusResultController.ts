import { NextFunction, Request, Response } from "express";

export interface RebusResultController {
    addRebusResult: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
    addMultipleRebusResults: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
}

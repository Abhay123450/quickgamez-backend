import { NextFunction, Request, Response } from "express";

export interface GTMResultController {
    getGTMResult: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
    addGTMResult: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
    addMultipleGTMResults: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
}

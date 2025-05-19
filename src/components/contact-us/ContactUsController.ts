import { Request, Response, NextFunction } from "express";

export interface ContactUsController {
    sendMessageToEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
}

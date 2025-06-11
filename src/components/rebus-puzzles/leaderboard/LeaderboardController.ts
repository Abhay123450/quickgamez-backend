import { NextFunction, Request, Response } from "express";

export interface LeaderboardController {
    getLeaderboard(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
}

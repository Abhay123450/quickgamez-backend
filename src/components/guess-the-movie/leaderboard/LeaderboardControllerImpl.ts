import { NextFunction, Request, Response } from "express";
import { LeaderboardController } from "./LeaderboardController.js";
import { matchedData, validationResult } from "express-validator";
import { ValidationError } from "../../../utils/AppErrors.js";
import { LeaderboardService } from "./LeaderboardService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";

export class LeaderboardControllerImpl implements LeaderboardController {
    private _leaderboardService: LeaderboardService;

    constructor(leaderboardService: LeaderboardService) {
        this._leaderboardService = leaderboardService;
    }

    async getLeaderboard(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { time, count } = matchedData(req);

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count
        );

        sendResponseSuccess(res, leaderboard);
    }

    async getBollywoodLeaderboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { time, count } = matchedData(req);

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count,
            "bollywood"
        );

        sendResponseSuccess(res, leaderboard);
    }

    async getHollywoodLeaderboard(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { time, count } = matchedData(req);

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count,
            "hollywood"
        );

        sendResponseSuccess(res, leaderboard);
    }
}

import { NextFunction, Request, Response } from "express";
import { LeaderboardController } from "./LeaderboardController.js";
import { matchedData, validationResult } from "express-validator";
import { ValidationError } from "../../../utils/AppErrors.js";
import { LeaderboardService } from "./LeaderboardService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { Leaderboard } from "./Leaderboard.js";

const ONE_MINUTE = 60 * 1000;
export class LeaderboardControllerImpl implements LeaderboardController {
    private _leaderboardService: LeaderboardService;
    private _cache: Map<
        string,
        {
            leaderboard: Leaderboard;
            timestamp: number;
        }
    > = new Map();

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

        const cacheKey = `${time}-${count}-all`;
        const cachedLeaderboard = this._cache.get(cacheKey);
        if (
            cachedLeaderboard &&
            cachedLeaderboard.timestamp > Date.now() - ONE_MINUTE
        ) {
            return sendResponseSuccess(res, cachedLeaderboard.leaderboard);
        }

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count
        );

        sendResponseSuccess(res, leaderboard);

        this._cache.set(cacheKey, { leaderboard, timestamp: Date.now() });
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

        const cacheKey = `${time}-${count}-bollywood`;
        const cachedLeaderboard = this._cache.get(cacheKey);
        if (
            cachedLeaderboard &&
            cachedLeaderboard.timestamp > Date.now() - ONE_MINUTE
        ) {
            return sendResponseSuccess(res, cachedLeaderboard.leaderboard);
        }

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count,
            "bollywood"
        );

        sendResponseSuccess(res, leaderboard);

        this._cache.set(cacheKey, { leaderboard, timestamp: Date.now() });
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

        const cacheKey = `${time}-${count}-hollywood`;
        const cachedLeaderboard = this._cache.get(cacheKey);
        if (
            cachedLeaderboard &&
            cachedLeaderboard.timestamp > Date.now() - ONE_MINUTE
        ) {
            return sendResponseSuccess(res, cachedLeaderboard.leaderboard);
        }

        const leaderboard = await this._leaderboardService.getLeaderboard(
            time,
            count,
            "hollywood"
        );

        sendResponseSuccess(res, leaderboard);

        this._cache.set(cacheKey, { leaderboard, timestamp: Date.now() });
    }
}

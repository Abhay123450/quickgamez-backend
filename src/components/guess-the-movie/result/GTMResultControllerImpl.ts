import { Request, Response, NextFunction } from "express";
import { GTMResultController } from "./GTMResultController.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { matchedData, validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../../utils/AppErrors.js";
import { GTMResultService } from "./GTMResultService.js";
import { NewGuessTheMovieResult } from "./GTMResult.js";

export class GTMResultControllerImpl implements GTMResultController {
    _gtmResultService: GTMResultService;

    constructor(gtmResultService: GTMResultService) {
        this._gtmResultService = gtmResultService;
    }

    async getGTMResult(req: Request, res: Response, next: NextFunction) {
        console.log(`req.params is ${JSON.stringify(req.params)}`);
        sendResponseSuccess(res, req.params);
    }

    async addGTMResult(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new ValidationError(["User Id is missing"]);
        }

        const gtmResult: any = matchedData(req);
        gtmResult.userId = userId;

        if (!this.isGTMResult(gtmResult)) {
            throw new ValidationError([
                "invalid result for 'Guess the Movie' game."
            ]);
        }

        console.log(
            `startedAt is ${new Date(
                gtmResult.startedAt
            ).toISOString()}\nendedAt is ${new Date(
                gtmResult.endedAt
            ).toISOString()}`
        );

        const result = await this._gtmResultService.addGTMResult(gtmResult);

        if (!result) {
            throw new ServerError("Failed to add result.");
        }

        sendResponseSuccess(res);
    }

    async addMultipleGTMResults(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const userId = req.user?.userId;
        if (!userId) {
            throw new ValidationError(["User Id is missing"]);
        }

        const gtmResults = req.body;
        console.log(`gtmResults `, gtmResults);
        if (!Array.isArray(gtmResults)) {
            throw new ValidationError(["body must be an array of object."]);
        }
        gtmResults.forEach((gtmResult: any) => (gtmResult.userId = userId));

        if (!this.isGtmResultArray(gtmResults)) {
            throw new ValidationError([
                "invalid results for 'Guess the Movie' game."
            ]);
        }

        const results = await this._gtmResultService.addMultipleGTMResults(
            gtmResults
        );

        if (!results) {
            throw new ServerError("Failed to add results.");
        }

        sendResponseSuccess(res);
    }

    private isGTMResult(
        gtmresult: any
    ): gtmresult is Omit<NewGuessTheMovieResult, "score"> {
        return (
            "movieId" in gtmresult &&
            "userId" in gtmresult &&
            "difficulty" in gtmresult &&
            "industry" in gtmresult &&
            "movieNameUnguessed" in gtmresult &&
            "startedAt" in gtmresult &&
            "endedAt" in gtmresult &&
            "livesUsed" in gtmresult &&
            "isTimerOn" in gtmresult &&
            "timeGiven" in gtmresult &&
            "timeLeft" in gtmresult &&
            "result" in gtmresult &&
            "guesses" in gtmresult
        );
    }

    private isGtmResultArray(
        gtmresults: any[]
    ): gtmresults is Omit<NewGuessTheMovieResult, "score">[] {
        return gtmresults.every(this.isGTMResult);
    }
}

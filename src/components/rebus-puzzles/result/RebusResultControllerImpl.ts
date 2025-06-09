import { Request, Response, NextFunction } from "express";
import { NewRebusPuzzleResult } from "./RebusPuzzleResult.js";
import { RebusResultController } from "./RebusResultController.js";
import { matchedData, validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../../utils/AppErrors.js";
import { RebusResultService } from "./RebusResultService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { H } from "../../../public/_app/immutable/chunks/scheduler.CWexU-Gu.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";

export class RebusResultControllerImpl implements RebusResultController {
    private _rebusResultService: RebusResultService;
    constructor(rebusResultService: RebusResultService) {
        this._rebusResultService = rebusResultService;
    }
    async addRebusResult(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        if (!req.user?.userId) {
            throw new ValidationError(["User Id is missing"]);
        }
        const rebusResult: any = matchedData(req);
        rebusResult.userId = req.user.userId;
        if (!this._isRebusResult(rebusResult)) {
            throw new ValidationError(["invalid result for 'Rebus' game."]);
        }
        const result = await this._rebusResultService.addRebusResult(
            rebusResult
        );
        if (!result) {
            throw new ServerError("Failed to add rebus result");
        }
        return sendResponseSuccess(res, HttpStatusCode.CREATED, "Result saved");
    }
    async addMultipleRebusResults(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        if (!req.user?.userId) {
            throw new ValidationError(["User Id is missing"]);
        }
        const rebusResults: any = matchedData(req);
        rebusResults.forEach(
            (result: any) => (result.userId = req.user.userId)
        );
        if (!this._isRebusResultArray(rebusResults)) {
            throw new ValidationError(["invalid result for 'Rebus' game."]);
        }
        const results = await this._rebusResultService.addMultipleRebusResults(
            rebusResults
        );
        if (!results) {
            throw new ServerError("Failed to add rebus results");
        }
        return sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Results saved"
        );
    }

    private _isRebusResult(
        gtmresult: any
    ): gtmresult is Omit<NewRebusPuzzleResult, "score"> {
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

    private _isRebusResultArray(
        gtmresults: any[]
    ): gtmresults is Omit<NewRebusPuzzleResult, "score">[] {
        return gtmresults.every(this._isRebusResult);
    }
}

import { Request, Response, NextFunction } from "express";
import { NewRebusPuzzleResult } from "./RebusPuzzleResult.js";
import { RebusResultController } from "./RebusResultController.js";
import { matchedData, validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../../utils/AppErrors.js";
import { RebusResultService } from "./RebusResultService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";

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
        const { results } = matchedData(req);
        results.forEach((result: any) => (result.userId = req.user.userId));
        if (!this._isRebusResultArray(results)) {
            throw new ValidationError(["invalid result for 'Rebus' game."]);
        }
        const resultsSaved =
            await this._rebusResultService.addMultipleRebusResults(results);
        if (!resultsSaved) {
            throw new ServerError("Failed to add rebus results");
        }
        return sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Results saved"
        );
    }

    private _isRebusResult(
        rebusResult: any
    ): rebusResult is Omit<NewRebusPuzzleResult, "score"> {
        return (
            "rebusId" in rebusResult &&
            "userId" in rebusResult &&
            "difficulty" in rebusResult &&
            "rebusAnswerUnguessed" in rebusResult &&
            "startedAt" in rebusResult &&
            "endedAt" in rebusResult &&
            "livesUsed" in rebusResult &&
            "isTimerOn" in rebusResult &&
            "timeGiven" in rebusResult &&
            "timeLeft" in rebusResult &&
            "result" in rebusResult &&
            "guesses" in rebusResult
        );
    }

    private _isRebusResultArray(
        rebusResult: any[]
    ): rebusResult is Omit<NewRebusPuzzleResult, "score">[] {
        return rebusResult.every(this._isRebusResult);
    }
}

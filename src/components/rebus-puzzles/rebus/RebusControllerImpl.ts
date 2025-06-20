import { Request, Response, NextFunction } from "express";
import { RebusController } from "./RebusController.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { matchedData, validationResult } from "express-validator";
import {
    ClientError,
    ServerError,
    ValidationError
} from "../../../utils/AppErrors.js";
import { RebusService } from "./RebusService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";

export class RebusControllerImpl implements RebusController {
    private _rebusService: RebusService;
    constructor(rebusService: RebusService) {
        this._rebusService = rebusService;
    }
    async addRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { answer, difficulty, explanation } = req.body;

        const rebus = await this._rebusService.addRebus({
            rebusImage: req.file,
            answer,
            difficulty,
            explanation,
            addedBy: req.user.userId
        });

        if (!rebus) {
            throw new ServerError("Failed to add rebus");
        }

        return sendResponseSuccess(res, "Rebus added successfully", rebus);
    }

    async getRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getRebusById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const rebusId = matchedData(req).id as string;
        const rebus = await this._rebusService.getRebusById(rebusId);
        if (!rebus) {
            throw new ClientError("Rebus not found", HttpStatusCode.NOT_FOUND);
        }
        return sendResponseSuccess(res, rebus);
    }
    async getRandomRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { difficulty, count } = matchedData(req);
        const rebus = await this._rebusService.getRandomRebus(
            difficulty,
            count
        );
        if (!rebus) {
            throw new ServerError("Failed to get rebus");
        }
        return sendResponseSuccess(res, rebus);
    }
    async getUnplayedRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { difficulty, count } = matchedData(req);

        const userId = req.user?.userId;
        if (!userId) {
            throw new ValidationError(["User Id is missing. Login required."]);
        }
        const rebuses = await this._rebusService.getUnplayedRebus(
            userId,
            difficulty,
            count
        );
        if (!rebuses) {
            throw new ServerError("Failed to get rebus");
        }
        return sendResponseSuccess(res, rebuses);
    }
    async updateRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async deleteRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const rebusId = matchedData(req).id as string;
        const rebus = await this._rebusService.deleteRebus(rebusId);
        if (!rebus) {
            throw new ServerError("Failed to delete rebus");
        }
        return sendResponseSuccess(res, "Rebus deleted successfully");
    }
}

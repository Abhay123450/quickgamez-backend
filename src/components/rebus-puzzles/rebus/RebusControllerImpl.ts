import { Request, Response, NextFunction } from "express";
import { RebusController } from "./RebusController.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../../utils/AppErrors.js";
import { RebusService } from "./RebusService.js";
import { sendResponseSuccess } from "../../../utils/sendResponse.js";

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
        ConsoleLog.info(JSON.stringify(req.body));
        ConsoleLog.info(JSON.stringify(req.file));

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
        throw new Error("Method not implemented.");
    }
    async getRandomRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async getUnplayedRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }
}

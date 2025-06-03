import { Request, Response, NextFunction } from "express";
import { RebusController } from "./RebusController.js";

export class RebusControllerImpl implements RebusController {
    async addRebus(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        throw new Error("Method not implemented.");
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

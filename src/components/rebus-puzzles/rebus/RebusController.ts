import { NextFunction, Request, Response } from "express";

export interface RebusController {
    addRebus(req: Request, res: Response, next: NextFunction): void;
    getRebus(req: Request, res: Response, next: NextFunction): void;
    getRebusById(req: Request, res: Response, next: NextFunction): void;
    getRandomRebus(req: Request, res: Response, next: NextFunction): void;
    getUnplayedRebus(req: Request, res: Response, next: NextFunction): void;
    updateRebus(req: Request, res: Response, next: NextFunction): void;
    deleteRebus(req: Request, res: Response, next: NextFunction): void;
}

import { NextFunction, Request, Response } from "express";
import { Movie } from "./Movie.js";

export interface MovieController {
    getMovieById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    getRandomMovies(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
    addMovie(req: Request, res: Response, next: NextFunction): Promise<void>;
    addMovies(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateMovie(req: Request, res: Response, next: NextFunction): Promise<void>;
    getUnplayedMovies(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void>;
}

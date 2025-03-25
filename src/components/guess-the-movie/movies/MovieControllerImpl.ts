import { NextFunction, Request, Response } from "express";
import { MovieRepository } from "./interfaces/MovieRepository.js";
import { Industry, Movie } from "./interfaces/Movie.js";
import {
    sendResponseClientError,
    sendResponseServerError,
    sendResponseSuccess
} from "../../../utils/sendResponse.js";
import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { matchedData, validationResult } from "express-validator";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { AppError } from "../../../utils/AppError.js";
import { match } from "assert";
import { MovieController } from "./interfaces/MovieController.js";
import { MovieService } from "./interfaces/MovieService.js";
import { Difficulty } from "../../../constants/Difficulty.js";
import {
    ClientError,
    ServerError,
    ValidationError
} from "../../../utils/AppErrors.js";

export class MovieControllerImpl implements MovieController {
    private _movieService: MovieService;

    constructor(movieRepository: MovieService) {
        this._movieService = movieRepository;
    }

    async addMovie(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        const movie = matchedData(req) as Movie;

        console.log(`movie is ${JSON.stringify(movie)}`);

        const movieSaved = await this._movieService.addMovie(movie);

        if (!movieSaved) {
            throw new AppError("cannot save movie", 500);
        }

        sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Movie saved successfully",
            movie
        );
    }

    async getMovieById(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const movieId = matchedData(req).movieId as string;
        const movie = await this._movieService.getMovieById(movieId);
        if (!movie) {
            throw new ClientError("Movie not found", HttpStatusCode.NOT_FOUND);
        }
        return sendResponseSuccess(res, movie);
    }

    async addMovies(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        const movies = matchedData(req).movies as Movie[];
        console.log(`movies is ${JSON.stringify(movies)}`);
        const moviesSaved = await this._movieService.addMovies(movies);
        if (!moviesSaved) {
            return next(new ServerError("cannot save movies"));
        }
        return sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Movies saved successfully"
        );
    }

    async getMovies(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        const query = matchedData(req);

        ConsoleLog.info(`query is ${JSON.stringify(query)}`);

        const filter: Partial<Movie> = {};

        if (query.industry) {
            filter.industry = query.industry as Industry;
        }
        if (query.difficulty) {
            filter.difficulty = query.difficulty as Difficulty;
        }

        const movies = await this._movieService.getMovies(
            filter,
            query.page,
            query.limit,
            query.sort
        );

        sendResponseSuccess(res, movies);
    }

    async getRandomMovies(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        const industry: Industry = matchedData(req).industry;
        const difficulty: Difficulty = matchedData(req).difficulty;
        const count: number = matchedData(req).count;

        const getRandomMovies: Movie[] =
            await this._movieService.getRandomMovies(
                industry,
                difficulty,
                count
            );

        return sendResponseSuccess(res, getRandomMovies);
    }

    async getUnplayedMovies(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const userId = req.user?.userId;
        if (!userId) {
            res.redirect(
                `./random?industry=${matchedData(req).industry}&difficulty=${
                    matchedData(req).difficulty
                }&count=${matchedData(req).count}`
            );
            return;
        }

        const unplayedMovies: Movie[] =
            await this._movieService.getUnplayedMovies(
                userId,
                matchedData(req).industry,
                matchedData(req).difficulty,
                matchedData(req).count
            );

        return sendResponseSuccess(res, unplayedMovies);
    }

    async updateMovie(req: Request, res: Response, next: NextFunction) {}

    async deleteMovie(req: Request, res: Response, next: NextFunction) {
        const movieId = matchedData(req).movieId;

        const movieDeleted = await this._movieService.deleteMovie(movieId);

        if (!movieDeleted) {
            return next(
                new AppError("An error occurred. Cannot delete movie.")
            );
        }

        sendResponseSuccess(res, "Movie deleted");
    }
}

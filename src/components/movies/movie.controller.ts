import { NextFunction, Request, Response } from "express";
import { MovieRepository } from "./interfaces/MovieRepository.js";
import { Movie } from "./interfaces/Movie.js";
import {
    sendResponseClientError,
    sendResponseServerError,
    sendResponseSuccess
} from "../../utils/sendResponse.js";
import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";
import { matchedData, validationResult } from "express-validator";
import { ConsoleLog } from "../../utils/ConsoleLog.js";
import { AppError } from "../../utils/AppError.js";
import { match } from "assert";

export class MovieController {
    private movieRepository: MovieRepository;

    constructor(movieRepository: MovieRepository) {
        this.movieRepository = movieRepository;
    }

    async addMovie(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            // return sendResponseClientError(res, JSON.stringify(errorMessages));
            console.log(errorMessages);
            // return next(new AppError(JSON.stringify(errorMessages), 404));
        }

        const movie = matchedData(req) as Movie;

        console.log(`movie is ${JSON.stringify(movie)}`);

        const movieSaved = await this.movieRepository.addMovie(movie);

        if (!movieSaved) {
            return next;
        }

        return sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "Movie saved successfully",
            movie
        );
    }

    async addMovies(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            // return sendResponseClientError(res, JSON.stringify(errorMessages));
            // console.log(errorMessages);
            return next(new AppError(JSON.stringify(errorMessages), 404));
        }

        const movies = matchedData(req).movies as Movie[];
        console.log(`movies is ${JSON.stringify(movies)}`);
        const moviesSaved = await this.movieRepository.addMovies(movies);
        if (!moviesSaved) {
            return next(new AppError("cannot save movies", 500));
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
            // return sendResponseClientError(res, JSON.stringify(errorMessages));
            // console.log(errorMessages);
            return next(new AppError(JSON.stringify(errorMessages), 404));
        }

        const query = matchedData(req);

        ConsoleLog.info(`query is ${JSON.stringify(query)}`);

        const movies = await this.movieRepository.getMovies(
            {},
            query.page,
            query.limit,
            query.sort
        );

        sendResponseSuccess(res, movies);
    }

    async getRandomMovie(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            // return sendResponseClientError(res, JSON.stringify(errorMessages));
            // console.log(errorMessages);
            return next(new AppError(JSON.stringify(errorMessages), 404));
        }

        const industry = matchedData(req).industry
            ? matchedData(req).industry
            : undefined;

        // ConsoleLog.info(matchedData(req));

        const getRandomMovie = await this.movieRepository.getRandomMovie(
            industry
        );

        if (!getRandomMovie) {
            return next(
                new AppError("An error occurred. Cannot get random movie.")
            );
        }

        return sendResponseSuccess(res, getRandomMovie as Movie);
    }

    async updateMovie(req: Request, res: Response, next: NextFunction) {}

    async deleteMovie(req: Request, res: Response, next: NextFunction) {
        const movieId = matchedData(req).movieId;

        const movieDeleted = await this.movieRepository.deleteMovie(movieId);

        if (!movieDeleted) {
            return next(
                new AppError("An error occurred. Cannot delete movie.")
            );
        }

        sendResponseSuccess(res, "Movie deleted");
    }
}

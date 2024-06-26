import { Model, SortOrder } from "mongoose";
import { Movie } from "./interfaces/Movie.js";
import { MovieRepository } from "./interfaces/MovieRepository.js";
import { AppError } from "../../utils/AppError.js";
import { MovieModel, MovieDocument } from "./movie.model.js";
import { ConsoleLog } from "../../utils/ConsoleLog.js";

export class MovieRepositoryImpl implements MovieRepository {
    async addMovies(movies: Movie[]): Promise<boolean> {
        // throw new Error("Method not implemented.");
        const moviesSaved = await MovieModel.insertMany(movies);
        console.log("moviesSaved", moviesSaved);
        if (!moviesSaved) {
            return false;
        }
        return true;
    }
    async getMovies(
        filter: Partial<Movie>,
        page: number,
        limit?: number,
        sort?: number
    ): Promise<Movie[]> {
        if (!limit) {
            limit = 10;
        }
        if (!sort) {
            sort = 1;
        }
        let sortBy: { [key: string]: SortOrder } = {};
        switch (sort) {
            case 1:
                sortBy.createdAt = -1;
                break;
            case 2:
                sortBy.createdAt = 1;
                break;
            case 3:
                sortBy.releaseDate = -1;
                break;
            case 4:
                sortBy.releaseDate = 1;
                break;

            default:
                sortBy.createdAt = -1;
                break;
        }
        ConsoleLog.info(`Sort order ${JSON.stringify(sortBy)}`);
        const movies = await MovieModel.find(filter)
            .sort(sortBy)
            .skip((page - 1) * limit)
            .limit(limit);

        if (!movies) {
            return [];
        }
        return movies as Movie[];
    }
    async addMovie(movie: Movie): Promise<boolean> {
        const newMovie = new MovieModel(movie);
        const movieSaved = await newMovie.save();
        if (!movieSaved) {
            return false;
        }
        return true;
    }
    async getRandomMovie(industry?: string): Promise<Movie | null> {
        const filter: { industry?: string } = {};
        if (industry) {
            filter.industry = industry.toLocaleUpperCase();
        }
        const randomMovie = await MovieModel.aggregate([
            { $match: filter },
            { $sample: { size: 1 } }
        ]);
        // ConsoleLog.info(`Random Movie ${JSON.stringify(randomMovie)}`);
        if (randomMovie.length) {
            return randomMovie[0] as Movie;
        }
        return null;
    }
    async updateMovie(id: string, movie: Partial<Movie>): Promise<boolean> {
        const movieUpdated: Movie | null = await MovieModel.findByIdAndUpdate(
            id,
            movie,
            { new: true }
        );
        if (!movieUpdated) {
            return false;
        }
        return true;
    }
    async deleteMovie(id: string): Promise<boolean> {
        const movieDeleted = await MovieModel.findByIdAndDelete(id);
        if (!movieDeleted) {
            return false;
        }
        return true;
    }
}

import { ObjectId, SortOrder, Types } from "mongoose";
import { Industry, Movie } from "./Movie.js";
import { MovieRepository } from "./MovieRepository.js";
import { MovieModel } from "./movie.model.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { Difficulty } from "../../../constants/Difficulty.js";
import { User } from "../../users/User.js";
import { GTMResultModel } from "../result/gtmResult.model.js";

export class MovieRepositoryImpl implements MovieRepository {
    async addMovies(movies: Movie[]): Promise<boolean> {
        const moviesSaved = await MovieModel.insertMany(movies);
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
    async getMovieById(id: string): Promise<Movie | null> {
        const movie = await MovieModel.findById(id);
        if (!movie) {
            return null;
        }
        return movie as Movie;
    }
    async getRandomMovies(
        industry: Industry,
        difficulty: Difficulty,
        limit: number
    ): Promise<Movie[]> {
        const filter = { industry: industry.toUpperCase(), difficulty };
        const randomMovies = await MovieModel.aggregate([
            { $match: filter },
            { $sample: { size: limit } }
        ]);
        randomMovies.forEach((movie) => {
            movie.id = movie._id;
            delete movie._id;
            delete movie.__v;
        });
        return randomMovies;
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
    async getUnplayedMovies(
        userId: User["userId"],
        difficulty: Difficulty,
        industry: Industry,
        count: number
    ): Promise<Movie[]> {
        const playedMovies = await GTMResultModel.find(
            {
                userId: new Types.ObjectId(userId),
                difficulty,
                industry
            },
            "movieId"
        );

        const playedMovieIds: ObjectId[] = playedMovies.map(
            (movie) => movie.movieId
        );

        const unplayedMovies = await MovieModel.aggregate([
            {
                $match: {
                    _id: { $nin: playedMovieIds },
                    industry: industry.toUpperCase(),
                    difficulty: difficulty.toLowerCase()
                }
            },
            { $sample: { size: count } }
        ]);
        unplayedMovies.forEach((movie) => {
            movie.id = movie._id;
            delete movie._id;
            delete movie.__v;
        });
        return unplayedMovies;
    }
}

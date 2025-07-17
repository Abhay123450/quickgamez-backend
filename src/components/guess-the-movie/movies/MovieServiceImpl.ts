import { Difficulty } from "../../../constants/Difficulty.js";
import { ClientError } from "../../../utils/AppErrors.js";
import { User } from "../../users/User.js";
import { Industry, Movie } from "./Movie.js";
import { MovieRepository } from "./MovieRepository.js";
import { MovieService } from "./MovieService.js";

export class MovieServiceImpl implements MovieService {
    _movieRepository: MovieRepository;
    constructor(movieRepository: MovieRepository) {
        this._movieRepository = movieRepository;
    }
    async addMovie(movie: Movie): Promise<boolean> {
        return await this._movieRepository.addMovie(movie);
    }
    async addMovies(movies: Movie[]): Promise<boolean> {
        return await this._movieRepository.addMovies(movies);
    }
    async getMovieById(id: string): Promise<Movie | null> {
        return await this._movieRepository.getMovieById(id);
    }
    async getMovies(
        filter: Partial<Movie>,
        page: number,
        limit: number = 10,
        sort: number = 0
    ): Promise<Movie[]> {
        return this._movieRepository.getMovies(filter, page, limit, sort);
    }
    async getRandomMovies(
        industry: Industry,
        difficulty: Difficulty,
        limit: number
    ): Promise<Movie[]> {
        return await this._movieRepository.getRandomMovies(
            industry,
            difficulty,
            limit
        );
    }
    async updateMovie(id: string, movie: Movie): Promise<boolean> {
        return await this._movieRepository.updateMovie(id, movie);
    }
    async deleteMovie(id: string): Promise<boolean> {
        return await this._movieRepository.deleteMovie(id);
    }
    async getUnplayedMovies(
        userId: User["userId"],
        industry: Industry,
        difficulty: Difficulty,
        count: number
    ): Promise<Movie[]> {
        let unplayedMovies = await this._movieRepository.getUnplayedMovies(
            userId,
            difficulty,
            industry,
            count
        );
        if (unplayedMovies.length === 0) {
            throw new ClientError("You have played all the movies.");
        }
        return unplayedMovies;
    }
}

import { Difficulty } from "../../../../constants/Difficulty.js";
import { User } from "../../../users/User.js";
import { Industry, Movie } from "./Movie.js";

export interface MovieRepository {
    addMovie(movie: Movie): Promise<boolean>;
    addMovies(movies: Movie[]): Promise<boolean>;
    getMovieById(id: string): Promise<Movie | null>;
    getRandomMovies(
        industry: Industry,
        difficulty: Difficulty,
        count: number
    ): Promise<Movie[]>;
    getMovies(
        filter: Partial<Movie>,
        page: number,
        limit?: number,
        sort?: number
    ): Promise<Movie[]>;
    updateMovie(id: string, movie: Partial<Movie>): Promise<boolean>;
    deleteMovie(id: string): Promise<boolean>;
    getUnplayedMovies(
        userId: User["userId"],
        difficulty: Difficulty,
        industry: Industry,
        count: number
    ): Promise<Movie[]>;
}

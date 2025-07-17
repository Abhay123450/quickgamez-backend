import { Difficulty } from "../../../constants/Difficulty.js";
import { User } from "../../users/User.js";
import { Industry, Movie } from "./Movie.js";

export interface MovieService {
    addMovie(movie: Movie): Promise<boolean>;
    addMovies(movies: Movie[]): Promise<boolean>;
    getMovieById(id: string): Promise<Movie | null>;
    getMovies(
        filter: Partial<Movie>,
        page: number,
        limit: number,
        sort: number
    ): Promise<Movie[]>;
    getRandomMovies(
        industry: Industry,
        difficulty: Difficulty,
        limit: number
    ): Promise<Movie[]>;
    updateMovie(id: string, movie: Movie): Promise<boolean>;
    deleteMovie(id: string): Promise<boolean>;
    getUnplayedMovies(
        userId: User["userId"],
        industry: Industry,
        difficulty: Difficulty,
        count: number
    ): Promise<Movie[]>;
}

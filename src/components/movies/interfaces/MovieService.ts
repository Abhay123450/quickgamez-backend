import { Difficulty } from "../../../constants/Difficulty.enum.js";
import { Movie } from "./Movie.js";

export interface MovieService {
    addMovie(movie: Movie): boolean;
    addMovies(movies: Movie[]): boolean;
    getMovieById(id: string): Movie;
    getRandomMovie(industry: string, difficulty: Difficulty): Movie;
    updateMovie(movie: Movie): boolean;
}

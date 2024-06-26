import { Movie } from "./interfaces/Movie.js";

export interface MovieUseCaseUser {
    addMovie(movie: Movie): boolean;
    addMovies(movies: Movie[]): boolean;
    getMovieById(id: string): Movie;
    getRandomMovie(industry?: string, year?: number): Movie;
    updateMovie(movie: Movie): boolean;
}

export interface MovieUseCaseAdmin extends MovieUseCaseUser {}

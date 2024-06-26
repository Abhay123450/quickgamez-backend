import { Movie } from "./Movie.js";

export interface MovieRepository {
    addMovie(movie: Movie): Promise<boolean>;
    addMovies(movies: Movie[]): Promise<boolean>;
    getRandomMovie(industry: string): Promise<Movie | null>;
    getMovies(
        filter: Partial<Movie>,
        page: number,
        limit?: number,
        sort?: number
    ): Promise<Movie[]>;
    updateMovie(id: string, movie: Partial<Movie>): Promise<boolean>;
    deleteMovie(id: string): Promise<boolean>;
}

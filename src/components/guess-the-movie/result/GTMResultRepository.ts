import { GuessTheMovieResult, NewGuessTheMovieResult } from "./GTMResult.js";

export interface GTMResultRepository {
    addGTMResult(result: NewGuessTheMovieResult): Promise<boolean>;
    addMultipleGTMResults(result: NewGuessTheMovieResult[]): Promise<boolean>;
    getGTMResultById(id: string): Promise<Partial<GuessTheMovieResult> | null>;
    /**
     *
     * @param userId
     * @param page
     * @param limit
     * @param sort 0 = latest results first, 1 = oldest results first
     */
    getGTMResultsByUserId(
        userId: string,
        sort: 0 | 1,
        page: number,
        limit: number
    ): Promise<Partial<GuessTheMovieResult>[] | null>;
}

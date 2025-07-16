import { NewGuessTheMovieResult } from "./GTMResult.js";

export interface GTMResultService {
    getGTMResult: () => Promise<void>;
    addGTMResult: (
        result: Omit<NewGuessTheMovieResult, "score">
    ) => Promise<boolean>;
    addMultipleGTMResults: (
        results: Omit<NewGuessTheMovieResult, "score">[]
    ) => Promise<boolean>;
}

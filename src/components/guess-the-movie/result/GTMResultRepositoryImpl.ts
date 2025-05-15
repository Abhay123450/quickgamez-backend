import { GuessTheMovieResult, NewGuessTheMovieResult } from "./GTMResult.js";
import { GTMResultModel } from "./gtmResult.model.js";
import { GTMResultRepository } from "./GTMResultRepository.js";

export class GTMResultRepositoryImpl implements GTMResultRepository {
    async addGTMResult(result: NewGuessTheMovieResult): Promise<boolean> {
        const gtmresult = new GTMResultModel(result);
        const savedGTMResult = await gtmresult.save();
        if (!savedGTMResult) {
            return false;
        }
        return true;
    }
    async addMultipleGTMResults(
        result: NewGuessTheMovieResult[]
    ): Promise<boolean> {
        const savedGTMResults = await GTMResultModel.insertMany(result);
        if (!savedGTMResults) {
            return false;
        }
        return true;
    }
    async getGTMResultById(
        id: string
    ): Promise<Partial<GuessTheMovieResult> | null> {
        const gtmResult: Partial<GuessTheMovieResult> | null =
            await GTMResultModel.findById(id);
        if (!gtmResult) {
            return null;
        }
        return gtmResult;
    }
    async getGTMResultsByUserId(
        userId: string,
        sort: 0 | 1 = 0,
        page: number,
        limit: number = 10
    ): Promise<GuessTheMovieResult[]> {
        throw new Error("Method not implemented.");
    }
}

import {
    NewRebusPuzzleResult,
    RebusPuzzleResult
} from "./RebusPuzzleResult.js";
import { RebusResultModel } from "./rebusResult.model.js";
import { RebusResultRepository } from "./RebusResultRepository.js";

export class RebusResultrepositoryImpl implements RebusResultRepository {
    async addRebusPuzzleResult(result: NewRebusPuzzleResult): Promise<boolean> {
        const RebusResult = new RebusResultModel(result);
        await RebusResult.save();
        return true;
    }
    async addMultipleRebusPuzzleResults(
        results: NewRebusPuzzleResult[]
    ): Promise<boolean> {
        await RebusResultModel.insertMany(results);
        return true;
    }
    async getRebusPuzzleResultById(
        puzzleId: string
    ): Promise<RebusPuzzleResult> {
        throw new Error("Method not implemented");
    }
    async getRebusPuzzleResultsByUserId(
        userId: string
    ): Promise<RebusPuzzleResult[]> {
        const filter: Partial<RebusPuzzleResult> = { userId: userId };
        return await RebusResultModel.find(filter);
    }
}

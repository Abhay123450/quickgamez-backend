import {
    NewRebusPuzzleResult,
    RebusPuzzleResult
} from "./RebusPuzzleResult.js";

export interface RebusResultRepository {
    addRebusPuzzleResult: (result: NewRebusPuzzleResult) => Promise<boolean>;
    addMultipleRebusPuzzleResults: (
        results: NewRebusPuzzleResult[]
    ) => Promise<boolean>;
    getRebusPuzzleResultById: (puzzleId: string) => Promise<RebusPuzzleResult>;
    getRebusPuzzleResultsByUserId: (
        userId: string
    ) => Promise<RebusPuzzleResult[]>;
}

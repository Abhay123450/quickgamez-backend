import {
    NewRebusPuzzleResult,
    RebusPuzzleResult
} from "./RebusPuzzleResult.js";

export interface RebusResultService {
    getRebusResult: () => Promise<RebusPuzzleResult>;
    addRebusResult: (
        result: Omit<NewRebusPuzzleResult, "score">
    ) => Promise<boolean>;
    addMultipleRebusResults: (
        results: Omit<NewRebusPuzzleResult, "score">[]
    ) => Promise<boolean>;
}

import { Difficulty } from "../../../constants/Difficulty.js";
import { User } from "../../users/User.js";
import { Rebus } from "../rebus/Rebus.js";

export interface NewRebusPuzzleResult {
    rebusId: string;
    userId: string;
    difficulty: Difficulty;
    rebusAnswerUnguessed: string;
    startedAt: Date;
    endedAt: Date;
    livesUsed: number;
    score: number;
    isTimerOn: boolean;
    /** In seconds */
    timeGiven: number;
    /** In seconds */
    timeLeft: number;
    result: "win" | "lose";
    guesses: [
        {
            character: string;
            isCorrect: boolean;
            guessedAt: Date;
        }
    ];
}

export interface RebusPuzzleResult extends NewRebusPuzzleResult {
    id: string;
    rebus: Partial<Rebus>;
    user: Partial<User>;
}

export type RebusPuzzleGuesses = RebusPuzzleResult["guesses"];

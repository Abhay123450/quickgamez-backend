import { Difficulty } from "../../../constants/Difficulty.js";
import {
    NewRebusPuzzleResult,
    RebusPuzzleGuesses,
    RebusPuzzleResult
} from "./RebusPuzzleResult.js";
import { RebusResultRepository } from "./RebusResultRepository.js";
import { RebusResultService } from "./RebusResultService.js";

export class RebusResultServiceImpl implements RebusResultService {
    private _rebusResultRepository: RebusResultRepository;
    constructor(rebusResultRepository: RebusResultRepository) {
        this._rebusResultRepository = rebusResultRepository;
    }
    async getRebusResult(): Promise<RebusPuzzleResult> {
        throw new Error("Method not implemented");
    }
    async addRebusResult(
        result: Omit<NewRebusPuzzleResult, "score">
    ): Promise<boolean> {
        const score = this._calculateScore(
            result.difficulty,
            result.isTimerOn,
            result.timeLeft,
            result.timeGiven,
            result.livesUsed,
            result.result,
            result.rebusAnswerUnguessed,
            result.guesses
        );
        return this._rebusResultRepository.addRebusPuzzleResult({
            ...result,
            score
        });
    }
    async addMultipleRebusResults(
        results: Omit<NewRebusPuzzleResult, "score">[]
    ): Promise<boolean> {
        return this._rebusResultRepository.addMultipleRebusPuzzleResults(
            results.map((result) => {
                const score = this._calculateScore(
                    result.difficulty,
                    result.isTimerOn,
                    result.timeLeft,
                    result.timeGiven,
                    result.livesUsed,
                    result.result,
                    result.rebusAnswerUnguessed,
                    result.guesses
                );
                return { ...result, score };
            })
        );
    }

    private _calculateScore(
        difficulty: Difficulty,
        isTimerOn: boolean,
        timeLeft: number,
        timeGiven: number,
        livesUsed: number,
        result: "win" | "lose",
        rebusAnswerUnguessed: string,
        guesses: RebusPuzzleGuesses
    ): number {
        let score = 0;
        if (result === "win") {
            if (difficulty === "easy") {
                score += 100;
            } else if (difficulty === "medium") {
                score += 200;
            } else if (difficulty === "hard") {
                score += 300;
            }

            // for each lives remaining, add 20 points
            // 5 lives given at the start of every game
            score += (5 - livesUsed) * 20;
        }

        if (isTimerOn) {
            // time bonus = percentage of time left
            const timeBonus = Math.ceil((timeLeft / timeGiven) * 100);
            score += timeBonus;
        }

        // combined score for all correct guesses should be 100
        // hence points awarded for each correct guess = (100) / (number of characters to guess)
        // so, if there are 4 characters to guess, 25 points for each correct guess
        // if the points for each correct guess is in decimal form, round it to the nearest integer

        const numberOfCharactersToGuess: number = rebusAnswerUnguessed
            .split("")
            .reduce(
                (acc: number, char: string) => (char === "*" ? acc + 1 : acc),
                0
            );

        const pointsArray = this._getPointsArray(numberOfCharactersToGuess);

        let i = 0;

        guesses.forEach((guess) => {
            if (guess.isCorrect) {
                score += pointsArray[i++];
            }
        });

        console.log(`score : ${score}`);

        return score;
    }

    private _getPointsArray(numberOfUnguessedCharacters: number): number[] {
        const pointsForEachCorrectGuess = 100 / numberOfUnguessedCharacters;
        if (Number.isInteger(pointsForEachCorrectGuess)) {
            return [
                ...Array(numberOfUnguessedCharacters).fill(
                    pointsForEachCorrectGuess
                )
            ];
        } else {
            const floor = Math.floor(pointsForEachCorrectGuess);
            const ceil = Math.ceil(pointsForEachCorrectGuess);
            console.log(`floor ${floor}`);
            console.log(`ceil ${ceil}`);
            for (let i = 2; i <= numberOfUnguessedCharacters; i++) {
                let total =
                    floor * (i - 1) +
                    ceil * (numberOfUnguessedCharacters - i + 1);
                if (total === 100) {
                    return [
                        ...Array(i - 1).fill(floor),
                        ...Array(numberOfUnguessedCharacters - i + 1).fill(ceil)
                    ];
                }
            }
            return Array(numberOfUnguessedCharacters).fill(floor);
        }
    }
}

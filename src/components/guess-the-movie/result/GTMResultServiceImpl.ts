import { Difficulty } from "../../../constants/Difficulty.js";
import { GuessTheMovieGuesses, NewGuessTheMovieResult } from "./GTMResult.js";
import { GTMResultRepository } from "./GTMResultRepository.js";
import { GTMResultService } from "./GTMResultService.js";

export class GTMResultServiceImpl implements GTMResultService {
    private _gtmResultRepository: GTMResultRepository;
    constructor(gtmResultRepository: GTMResultRepository) {
        this._gtmResultRepository = gtmResultRepository;
    }

    async getGTMResult(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async addGTMResult(
        result: Omit<NewGuessTheMovieResult, "score">
    ): Promise<boolean> {
        console.log(`result ${JSON.stringify(result)}`);
        // calculate score
        const score = this.calculateScore(
            result.difficulty,
            result.isTimerOn,
            result.timeLeft,
            result.timeGiven,
            result.livesUsed,
            result.result,
            result.movieNameUnguessed,
            result.guesses
        );

        return this._gtmResultRepository.addGTMResult({ ...result, score });
    }

    async addMultipleGTMResults(
        results: Omit<NewGuessTheMovieResult, "score">[]
    ): Promise<boolean> {
        return this._gtmResultRepository.addMultipleGTMResults(
            results.map((result) => {
                let score = this.calculateScore(
                    result.difficulty,
                    result.isTimerOn,
                    result.timeLeft,
                    result.timeGiven,
                    result.livesUsed,
                    result.result,
                    result.movieNameUnguessed,
                    result.guesses
                );
                return { ...result, score };
            })
        );
    }

    private calculateScore(
        difficulty: Difficulty,
        isTimerOn: boolean,
        timeLeft: number,
        timeGiven: number,
        livesUsed: number,
        result: "win" | "lose",
        movieNameUnguessed: string,
        guesses: GuessTheMovieGuesses
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

        const numberOfCharactersToGuess: number = movieNameUnguessed
            .split("")
            .reduce(
                (acc: number, char: string) => (char === "*" ? acc + 1 : acc),
                0
            );

        const pointsArray = this.getPointsArray(numberOfCharactersToGuess);

        let i = 0;

        guesses.forEach((guess) => {
            if (guess.isCorrect) {
                score += pointsArray[i++];
            }
        });

        return score;
    }

    private getPointsArray(numberOfUnguessedCharacters: number): number[] {
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

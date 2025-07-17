import { Difficulty } from "../../../constants/Difficulty.js";
import { Industry, Movie } from "../movies/Movie.js";
import { User } from "../../users/User.js";

export interface NewGuessTheMovieResult {
    movieId: string;
    userId: string;
    difficulty: Difficulty;
    industry: Industry;
    movieNameUnguessed: string;
    startedAt: Date;
    endedAt: Date;
    livesUsed: number;
    score: number;
    isTimerOn: boolean;
    timeGiven: number; // in seconds
    timeLeft: number; // in seconds
    result: "win" | "lose";
    guesses: [
        {
            character: string;
            isCorrect: boolean;
            guessedAt: Date;
        }
    ];
}

export interface GuessTheMovieResult extends NewGuessTheMovieResult {
    id: string;
    movie: Partial<Movie>;
    user: Partial<User>;
}

export type GuessTheMovieGuesses = GuessTheMovieResult["guesses"];

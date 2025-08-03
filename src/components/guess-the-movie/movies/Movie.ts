import { Difficulty } from "../../../constants/Difficulty.js";

export type Industry = "hollywood" | "bollywood";

export interface Movie {
    id: string;
    name: string;
    industry: Industry; // bollywood, hollywood etc...
    difficulty: Difficulty;
    releaseDate: Date;
    actors: string[];
    director: string;
    genre: string[];
    productionHouse: string;
    boxOfficeStatus: string; // hit, flop etc...
    boxOfficeCollection: number;
    hints: string[];
}

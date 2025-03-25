import { Difficulty } from "../../../../constants/Difficulty.js";

interface ReleaseDate {
    date: number;
    month: number;
    year: number;
}

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
    boxOfficeCollection: string;
    hints: string[];
}

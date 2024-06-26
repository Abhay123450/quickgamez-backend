interface ReleaseDate {
    date: number;
    month: number;
    year: number;
}

export interface Movie {
    name: string;
    industry: string; // bollywood, hollywood etc...
    releaseDate: Date;
    actors: string[];
    director: string;
    genre: string[];
    productionHouse: string;
    boxOfficeStatus: string; // hit, flop etc...
    hints?: string[];
}

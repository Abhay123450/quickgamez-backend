import { User } from "../../users/User.js";

export interface Ranking {
    rank: number;
    user: Pick<User, "userId" | "username" | "name">;
    score: number;
}
export interface Leaderboard {
    game: string;
    time: Timerange;
    rankings: Ranking[];
}

export type Timerange = "daily" | "weekly" | "all-time";

import { Industry } from "../movies/interfaces/Movie.js";
import { Leaderboard, Timerange } from "./Leaderboard.js";

export interface LeaderboardService {
    getLeaderboard(
        time: Timerange,
        count: number,
        industry?: Industry
    ): Promise<Leaderboard>;
}

import { Industry } from "../movies/Movie.js";
import { Leaderboard, Timerange } from "./Leaderboard.js";

export interface LeaderboardService {
    getLeaderboard(
        time: Timerange,
        count: number,
        industry?: Industry
    ): Promise<Leaderboard>;
}

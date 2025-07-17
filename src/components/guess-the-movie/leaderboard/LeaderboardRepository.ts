import { Industry } from "../movies/Movie.js";
import { Leaderboard, Timerange } from "./Leaderboard.js";

export interface LeaderboardRepository {
    getLeaderboard(
        time: Timerange,
        count: number,
        industry?: Industry
    ): Promise<Leaderboard>;
}

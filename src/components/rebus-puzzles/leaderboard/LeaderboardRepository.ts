import { Leaderboard, Timerange } from "./Leaderboard.js";

export interface LeaderboardRepository {
    getLeaderboard(time: Timerange, count: number): Promise<Leaderboard>;
}

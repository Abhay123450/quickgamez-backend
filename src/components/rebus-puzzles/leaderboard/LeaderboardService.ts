import { Leaderboard, Timerange } from "./Leaderboard.js";

export interface LeaderboardService {
    getLeaderboard(time: Timerange, count: number): Promise<Leaderboard>;
}

import { Leaderboard, Timerange } from "./Leaderboard.js";
import { LeaderboardRepository } from "./LeaderboardRepository.js";
import { LeaderboardService } from "./LeaderboardService.js";

export class LeaderboardServiceImpl implements LeaderboardService {
    _leaderboardRepository: LeaderboardRepository;

    constructor(leaderboardRepository: LeaderboardRepository) {
        this._leaderboardRepository = leaderboardRepository;
    }
    async getLeaderboard(time: Timerange, count: number): Promise<Leaderboard> {
        return this._leaderboardRepository.getLeaderboard(time, count);
    }
}

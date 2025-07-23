import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { Industry } from "../movies/Movie.js";
import { GTMResultModel } from "../result/gtmResult.model.js";
import { Leaderboard, Timerange } from "./Leaderboard.js";
import { LeaderboardRepository } from "./LeaderboardRepository.js";

export class LeaderboardRepositoryImpl implements LeaderboardRepository {
    async getLeaderboard(
        time: Timerange,
        count: number,
        industry?: Industry
    ): Promise<Leaderboard> {
        let cutoffTime: number = Date.now();
        const now = new Date();
        switch (time) {
            case "daily":
                const tonightMidnight = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate(),
                        0,
                        0,
                        0,
                        0
                    )
                );
                cutoffTime = tonightMidnight.getTime();
                break;
            case "weekly":
                const oneWeekAgoMidnightGMT = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate() - 7, // Go back 7 days
                        0,
                        0,
                        0,
                        0
                    )
                );
                cutoffTime = oneWeekAgoMidnightGMT.getTime();
                break;
            case "all-time":
                cutoffTime = new Date("2024-01-01").getTime();
                break;
        }

        let cutoffDate = new Date(cutoffTime);

        const filter: any = {
            createdAt: { $gte: cutoffDate },
            isTimerOn: true
        };

        if (industry) {
            filter.industry = industry;
        }

        const rankings: any = await GTMResultModel.aggregate([
            {
                $match: filter
            },
            { $project: { userId: 1, score: 1 } },
            {
                $group: {
                    _id: "$userId",
                    totalScore: { $sum: "$score" },
                    matchesPlayed: { $sum: 1 }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: count },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                name: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$user"
            }
        ]);

        const leaderboard: Leaderboard = {
            game: "guess-the-movie",
            time: time,
            rankings: rankings.map((ranking: any, index: number) => ({
                rank: index + 1,
                user: {
                    userId: ranking._id,
                    username: ranking.user.username,
                    name: ranking.user.name
                },
                totalScore: ranking.totalScore,
                matchesPlayed: ranking.matchesPlayed
            }))
        };
        return leaderboard;
    }
}

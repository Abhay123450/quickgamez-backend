import { ConsoleLog } from "../../../utils/ConsoleLog.js";
import { RebusResultModel } from "../result/rebusResult.model.js";
import { Leaderboard, Timerange } from "./Leaderboard.js";
import { LeaderboardRepository } from "./LeaderboardRepository.js";

export class LeaderboardRepositoryImpl implements LeaderboardRepository {
    async getLeaderboard(time: Timerange, count: number): Promise<Leaderboard> {
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
        ConsoleLog.info(`cutoffDate: ${cutoffDate}`);

        const filter: any = {
            createdAt: { $gte: cutoffDate },
            isTimerOn: true
        };

        const rankings: any = await RebusResultModel.aggregate([
            // Step 1: Filter as needed
            { $match: filter },

            // Step 2: Sort by createdAt ASCENDING — so the oldest is first
            { $sort: { createdAt: 1 } },

            // Step 3: Group by userId + rebusId to get only the oldest document
            {
                $group: {
                    _id: { userId: "$userId", rebusId: "$rebusId" },
                    score: { $first: "$score" }
                }
            },

            // Step 4: Group by userId to aggregate scores and match count
            {
                $group: {
                    _id: "$_id.userId",
                    totalScore: { $sum: "$score" },
                    matchesPlayed: { $sum: 1 }
                }
            },

            // Step 5: Sort by score
            { $sort: { totalScore: -1 } },

            // Step 6: Limit top users
            { $limit: count },

            // Step 7: Lookup user info
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [{ $project: { username: 1, name: 1 } }]
                }
            },

            // Step 8: Unwind the joined user info
            { $unwind: "$user" }
        ]);

        ConsoleLog.info(`rankings for ${time}: ${JSON.stringify(rankings)}`);

        const leaderboard: Leaderboard = {
            game: "rebus-puzzles",
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

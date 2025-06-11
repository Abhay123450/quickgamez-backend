import { Router } from "express";
import { LeaderboardRepositoryImpl } from "./LeaderboardRepositoryImpl.js";
import { LeaderboardServiceImpl } from "./LeaderboardServiceImpl.js";
import { LeaderboardControllerImpl } from "./LeaderboardControllerImpl.js";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { validateGetLeaderboardReq } from "./leaderboard.validate.js";

const router: Router = Router();

const leaderboardRepository = new LeaderboardRepositoryImpl();
const leaderboardService = new LeaderboardServiceImpl(leaderboardRepository);
const leaderboardController = new LeaderboardControllerImpl(leaderboardService);

router
    .route("/games/rebus-puzzles/leaderboard")
    .get(
        validateGetLeaderboardReq(),
        catchAsycError(
            leaderboardController.getLeaderboard.bind(leaderboardController)
        )
    );

export const leaderboardRouter = router;

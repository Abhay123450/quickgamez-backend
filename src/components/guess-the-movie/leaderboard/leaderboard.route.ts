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
    .route("/games/guess-the-movie/leaderboard")
    .get(
        validateGetLeaderboardReq(),
        catchAsycError(
            leaderboardController.getLeaderboard.bind(leaderboardController)
        )
    );

router
    .route("/games/guess-the-movie-hollywood/leaderboard")
    .get(
        validateGetLeaderboardReq(),
        catchAsycError(
            leaderboardController.getHollywoodLeaderboard.bind(
                leaderboardController
            )
        )
    );

router
    .route("/games/guess-the-movie-bollywood/leaderboard")
    .get(
        validateGetLeaderboardReq(),
        catchAsycError(
            leaderboardController.getBollywoodLeaderboard.bind(
                leaderboardController
            )
        )
    );

export const leaderboardRouter = router;

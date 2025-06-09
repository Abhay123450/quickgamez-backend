import { Router } from "express";
import { RebusResultrepositoryImpl } from "./RebusResultRepositoryImpl.js";
import { RebusResultServiceImpl } from "./RebusResultServiceImpl.js";
import { RebusResultControllerImpl } from "./RebusResultControllerImpl.js";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { authenticateUser } from "../../../middlewares/userAuth.middleware.js";
import {
    validateAddMultipleRebusResults,
    validateAddRebusResult
} from "./rebusResult.validate.js";
const router = Router();

const rebusResultRepository = new RebusResultrepositoryImpl();
const rebusResultService = new RebusResultServiceImpl(rebusResultRepository);
const rebusResultController = new RebusResultControllerImpl(rebusResultService);

router
    .route("games/rebus-puzzles/results")
    .post(
        authenticateUser,
        validateAddRebusResult(),
        catchAsycError(
            rebusResultController.addRebusResult.bind(rebusResultController)
        )
    );

router
    .route("games/rebus-puzzles/results/multiple")
    .post(
        authenticateUser,
        validateAddMultipleRebusResults(),
        catchAsycError(
            rebusResultController.addMultipleRebusResults.bind(
                rebusResultController
            )
        )
    );

export const rebusResultRouter = router;

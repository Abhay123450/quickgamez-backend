import { Router } from "express";
import { authenticateUser } from "../../../middlewares/userAuth.middleware.js";
import {
    validateAddGtmResult,
    validateAddMultipleGtmResults
} from "./gtmResult.validate.js";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { GTMResultControllerImpl } from "./GTMResultControllerImpl.js";
import { GTMResultRepositoryImpl } from "./GTMResultRepositoryImpl.js";
import { GTMResultServiceImpl } from "./GTMResultServiceImpl.js";
const router = Router();

const gtmResultRepository = new GTMResultRepositoryImpl();
const gtmResultService = new GTMResultServiceImpl(gtmResultRepository);
const gtmResultController = new GTMResultControllerImpl(gtmResultService);

router
    .route("/games/guess-the-movie/results")
    .post(
        authenticateUser,
        validateAddGtmResult(),
        catchAsycError(
            gtmResultController.addGTMResult.bind(gtmResultController)
        )
    );

router
    .route("/games/guess-the-movie/results/multiple")
    .post(
        authenticateUser,
        validateAddMultipleGtmResults(),
        catchAsycError(
            gtmResultController.addMultipleGTMResults.bind(gtmResultController)
        )
    );

export const gtmResultRouter = router;

import { Router } from "express";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { RebusControllerImpl } from "./RebusControllerImpl.js";
import { handleFile } from "./handleFile.js";
import {
    validateAddRebusReq,
    validateGetRandomRebusReq,
    validateGetRebusByIdReq
} from "./rebus.validate.js";
import { RebusServiceImpl } from "./RebusServiceImpl.js";
import { FileUploadSerivceImpl } from "../../file-upload/FileUploadServiceImpl.js";
import { authenticateUser } from "../../../middlewares/userAuth.middleware.js";
import { RebusRepositoryImpl } from "./RebusRepositoryImpl.js";
import { rebusResultRouter } from "../result/rebusResult.route.js";
import { leaderboardRouter } from "../leaderboard/leaderboard.route.js";
const router = Router();

const fileUpdateService = new FileUploadSerivceImpl();
const rebusRepository = new RebusRepositoryImpl();
const rebusService = new RebusServiceImpl(fileUpdateService, rebusRepository);
const rebusController = new RebusControllerImpl(rebusService);

router.use(rebusResultRouter);
router.use(leaderboardRouter);

router
    .route("/rebus")
    .get(catchAsycError(rebusController.getRebus.bind(rebusController)))
    .post(
        authenticateUser,
        handleFile("rebusImage"),
        validateAddRebusReq(),
        catchAsycError(rebusController.addRebus.bind(rebusController))
    );
router
    .route("/rebus/unplayed")
    .get(
        catchAsycError(rebusController.getUnplayedRebus.bind(rebusController))
    );
router
    .route("/rebus/random")
    .get(
        validateGetRandomRebusReq(),
        catchAsycError(rebusController.getRandomRebus.bind(rebusController))
    );
router
    .route("/rebus/:id")
    .get(
        validateGetRebusByIdReq(),
        catchAsycError(rebusController.getRebusById.bind(rebusController))
    )
    .patch(catchAsycError(rebusController.updateRebus.bind(rebusController)))
    .delete(catchAsycError(rebusController.deleteRebus.bind(rebusController)));

export const rebusRouter = router;

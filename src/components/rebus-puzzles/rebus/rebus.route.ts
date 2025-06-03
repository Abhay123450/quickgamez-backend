import { Router } from "express";
import { catchAsycError } from "../../../middlewares/catchAsyncError.js";
import { RebusControllerImpl } from "./RebusControllerImpl.js";
const router = Router();

const rebusController = new RebusControllerImpl();

router
    .route("/rebus")
    .get(catchAsycError(rebusController.getRebus.bind(rebusController)))
    .post(catchAsycError(rebusController.addRebus.bind(rebusController)));
router
    .route("/rebus/unplayed")
    .get(
        catchAsycError(rebusController.getUnplayedRebus.bind(rebusController))
    );
router
    .route("/rebus/random")
    .get(catchAsycError(rebusController.getRandomRebus.bind(rebusController)));
router
    .route("/rebus/:id")
    .get(rebusController.getRebusById.bind(rebusController))
    .patch(rebusController.updateRebus.bind(rebusController))
    .delete(rebusController.deleteRebus.bind(rebusController));

export const rebusRouter = router;

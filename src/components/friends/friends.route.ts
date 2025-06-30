import { Router } from "express";
import { authenticateUser } from "../../middlewares/userAuth.middleware.js";
import { validateSendFriendRequestReq } from "./friends.validate.js";
import { FriendsRepositoryImpl } from "./FriendsRepositoryImpl.js";
import { FriendsServiceImpl } from "./FriendsServiceImpl.js";
import { NotificationServiceImpl } from "../notifications/NotificationServiceImpl.js";
import { NotificationRepositoryImpl } from "../notifications/NotificationRepositoryImpl.js";
import { FriendsControllerImpl } from "./FriendsControllerImpl.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
const router = Router();

const friendsRepository = new FriendsRepositoryImpl();
const friendsService = new FriendsServiceImpl(friendsRepository);
const friendsController = new FriendsControllerImpl(friendsService);

router
    .route("/friends/requests")
    .post(
        authenticateUser,
        validateSendFriendRequestReq(),
        catchAsycError(
            friendsController.sendFriendRequest.bind(friendsController)
        )
    );
router.route("/friends/requests/:requestId/accept").put();
router.route("/friends/requests/:requestId/reject").put();
router.route("/friends/requests/:requestId").delete();
router.route("/friends/block/:userId").post();
router.route("/friends/unblock/:userId").post();
router.route("/friends/unfriend/:friendUserId").post();
router.route("/friends/requests").get();
router.route("/friends").get();

export const friendsRouter = router;

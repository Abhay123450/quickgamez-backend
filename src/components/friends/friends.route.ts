import { Router } from "express";
import { authenticateUser } from "../../middlewares/userAuth.middleware.js";
import {
    validateAcceptFriendRequestReq,
    validateBlockUserReq,
    validateGetFriendRequestsReq,
    validateGetFriendsReq,
    validateSendFriendRequestReq
} from "./friends.validate.js";
import { FriendsRepositoryImpl } from "./FriendsRepositoryImpl.js";
import { FriendsServiceImpl } from "./FriendsServiceImpl.js";
import { FriendsControllerImpl } from "./FriendsControllerImpl.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import { BlockUserRepositoryImpl } from "./block-users/BlockUserRepositoryImpl.js";
const router = Router();

const friendsRepository = new FriendsRepositoryImpl();
const blockedUsersRepository = new BlockUserRepositoryImpl();
const friendsService = new FriendsServiceImpl(
    friendsRepository,
    blockedUsersRepository
);
const friendsController = new FriendsControllerImpl(friendsService);

router
    .route("/friends/requests/:requestId/accept")
    .put(
        authenticateUser,
        validateAcceptFriendRequestReq(),
        catchAsycError(
            friendsController.acceptFriendRequest.bind(friendsController)
        )
    );
router.route("/friends/requests/:requestId/reject").put();
router.route("/friends/requests/:requestId").delete();
router
    .route("/friends/requests")
    .post(
        authenticateUser,
        validateSendFriendRequestReq(),
        catchAsycError(
            friendsController.sendFriendRequest.bind(friendsController)
        )
    )
    .get(
        authenticateUser,
        validateGetFriendRequestsReq(),
        catchAsycError(
            friendsController.getFriendRequests.bind(friendsController)
        )
    );
router
    .route("/friends/block/:blockedUserId")
    .post(
        authenticateUser,
        validateBlockUserReq(),
        catchAsycError(friendsController.blockUser.bind(friendsController))
    )
    .delete(
        authenticateUser,
        validateBlockUserReq(),
        catchAsycError(friendsController.unblockUser.bind(friendsController))
    );
router.route("/friends/unfriend/:friendUserId").post();
router
    .route("/friends")
    .get(
        authenticateUser,
        validateGetFriendsReq(),
        catchAsycError(friendsController.getMyFriends.bind(friendsController))
    );

export const friendsRouter = router;

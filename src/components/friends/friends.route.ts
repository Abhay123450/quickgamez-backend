import { Router } from "express";
import { authenticateUser } from "../../middlewares/userAuth.middleware.js";
import {
    validateAcceptFriendRequestReq,
    validateBlockUserReq,
    validateCancelFriendRequestReq,
    validateGetFriendRequestsReq,
    validateGetFriendsReq,
    validateRejectFriendRequestReq,
    validateRemoveFriendReq,
    validateSendFriendRequestReq
} from "./friends.validate.js";
import { FriendsRepositoryImpl } from "./FriendsRepositoryImpl.js";
import { FriendsServiceImpl } from "./FriendsServiceImpl.js";
import { FriendsControllerImpl } from "./FriendsControllerImpl.js";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import { BlockUserRepositoryImpl } from "./block-users/BlockUserRepositoryImpl.js";
import { NotificationRepositoryImpl } from "../notifications/NotificationRepositoryImpl.js";
import { NotificationServiceImpl } from "../notifications/NotificationServiceImpl.js";
const router = Router();

const friendsRepository = new FriendsRepositoryImpl();
const blockedUsersRepository = new BlockUserRepositoryImpl();
const notificationService = new NotificationServiceImpl(
    new NotificationRepositoryImpl()
);
const friendsService = new FriendsServiceImpl(
    friendsRepository,
    blockedUsersRepository,
    notificationService
);
const friendsController = new FriendsControllerImpl(friendsService);

router
    .route("/friends/requests/:friendId/accept")
    .put(
        authenticateUser,
        validateAcceptFriendRequestReq(),
        catchAsycError(
            friendsController.acceptFriendRequest.bind(friendsController)
        )
    );
router
    .route("/friends/requests/:friendId/reject")
    .put(
        authenticateUser,
        validateRejectFriendRequestReq(),
        catchAsycError(
            friendsController.rejectFriendRequest.bind(friendsController)
        )
    );
router
    .route("/friends/requests/:requestId/cancel")
    .put(
        authenticateUser,
        validateCancelFriendRequestReq(),
        catchAsycError(
            friendsController.cancelFriendRequest.bind(friendsController)
        )
    );
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
router
    .route("/friends/unfriend/:friendUserId")
    .put(
        authenticateUser,
        validateRemoveFriendReq(),
        catchAsycError(friendsController.removeFriend.bind(friendsController))
    );
router
    .route("/friends")
    .get(
        authenticateUser,
        validateGetFriendsReq(),
        catchAsycError(friendsController.getMyFriends.bind(friendsController))
    );

export const friendsRouter = router;

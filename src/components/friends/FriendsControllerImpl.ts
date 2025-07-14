import { NextFunction, Request, Response } from "express";
import { FriendController } from "./FriendsController.js";
import { FriendsService } from "./FriendsService.js";
import { matchedData, validationResult } from "express-validator";
import { ServerError, ValidationError } from "../../utils/AppErrors.js";
import { sendResponseSuccess } from "../../utils/sendResponse.js";

export class FriendsControllerImpl implements FriendController {
    private _friendsService: FriendsService;
    constructor(friendsService: FriendsService) {
        this._friendsService = friendsService;
    }
    async getFriendRequests(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { page, limit } = matchedData(req);
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const friendRequests = await this._friendsService.getFriendRequests(
            userId,
            page,
            limit
        );
        sendResponseSuccess(res, friendRequests);
    }
    async sendFriendRequest(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { recieverUserId } = matchedData(req);
        const friendRequestSent = await this._friendsService.sendFriendRequest(
            userId,
            recieverUserId
        );
        if (!friendRequestSent) {
            throw new ServerError("Failed to send friend request");
        }
        sendResponseSuccess(res, "Friend request sent successfully");
    }
    async cancelFriendRequest(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { requestId } = matchedData(req);
        const friendRequestCancelled =
            await this._friendsService.cancelFriendRequest(userId, requestId);
        if (!friendRequestCancelled) {
            throw new ServerError("Failed to cancel friend request");
        }
        sendResponseSuccess(res, "Friend request cancelled successfully");
    }
    async acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { requestId } = matchedData(req);
        const friendRequestAccepted =
            await this._friendsService.acceptFriendRequest(userId, requestId);
        if (!friendRequestAccepted) {
            throw new ServerError("Failed to accept friend request");
        }
        sendResponseSuccess(res, "Friend request accepted successfully");
    }
    async rejectFriendRequest(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { requestId } = matchedData(req);
        const friendRequestRejected =
            await this._friendsService.rejectFriendRequest(userId, requestId);
        if (!friendRequestRejected) {
            throw new ServerError("Failed to reject friend request");
        }
        sendResponseSuccess(res, "Friend request rejected successfully");
    }
    async blockUser(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { blockedUserId } = matchedData(req);
        const userBlocked = await this._friendsService.blockUser(
            userId,
            blockedUserId
        );
        if (!userBlocked) {
            throw new ServerError("Failed to block user");
        }
        sendResponseSuccess(res, "User blocked successfully");
    }
    async unblockUser(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { blockedUserId } = matchedData(req);
        const userUnblocked = await this._friendsService.unblockUser(
            userId,
            blockedUserId
        );
        if (!userUnblocked) {
            throw new ServerError("Failed to unblock user");
        }
        sendResponseSuccess(res, "User unblocked successfully");
    }
    async removeFriend(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const { friendUserId } = matchedData(req);
        const friendRemoved = await this._friendsService.removeFriend(
            userId,
            friendUserId
        );
        if (!friendRemoved) {
            throw new ServerError("Failed to remove friend");
        }
        sendResponseSuccess(res, "Friend removed successfully");
    }
    async getMyFriends(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }
        const { page, limit, sort } = matchedData(req);
        const { userId } = req.user;
        if (!userId) {
            throw new ValidationError(["Login Required."]);
        }
        const myFriends = await this._friendsService.getFriends(
            userId,
            page,
            limit,
            sort
        );
        sendResponseSuccess(res, myFriends);
    }
}

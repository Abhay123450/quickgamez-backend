import { Server } from "http";
import { ClientError, ServerError } from "../../utils/AppErrors.js";
import { User } from "../users/User.js";
import { BlockUserRepository } from "./block-users/BlockUserRepository.js";
import { Friend, FriendRequest, Friendship, FriendsSort } from "./Friends.js";
import { FriendsRepository } from "./FriendsRepository.js";
import { FriendsService } from "./FriendsService.js";
import { NotificationService } from "../notifications/NotificationService.js";

export class FriendsServiceImpl implements FriendsService {
    private _friendsRepository: FriendsRepository;
    private _blockedUsersRepository: BlockUserRepository;
    private _notificationService: NotificationService;
    constructor(
        friendsRepository: FriendsRepository,
        blockedUsersRepository: BlockUserRepository,
        notificationService: NotificationService
    ) {
        this._friendsRepository = friendsRepository;
        this._blockedUsersRepository = blockedUsersRepository;
        this._notificationService = notificationService;
    }
    async sendFriendRequest(
        from: User["userId"],
        to: User["userId"]
    ): Promise<boolean> {
        const isUserBlockedByOther =
            await this._blockedUsersRepository.isBlocked(to, from);
        if (isUserBlockedByOther) {
            throw new ClientError(
                "You cannot send a friend request to this user because they have blocked you."
            );
        }
        const hasUserBlockedTheOther =
            await this._blockedUsersRepository.isBlocked(from, to);
        if (hasUserBlockedTheOther) {
            throw new ClientError(
                "You cannot send a friend request to this user because you have blocked them."
            );
        }
        const isFriendRequestSent = await this._friendsRepository.addFriend(
            from,
            to
        );
        if (!isFriendRequestSent) {
            throw new ServerError("Failed to send friend request");
        }
        this._notificationService.createNewNotification({
            userId: to,
            message: `${from} sent you a friend request.`,
            action: "friend_request",
            payload: { from },
            type: "friend_request"
        });
        return true;
    }
    async acceptFriendRequest(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        const friendRequestAccepted =
            await this._friendsRepository.acceptFriendRequest(userId, friendId);
        if (!friendRequestAccepted) {
            throw new ServerError("Failed to accept friend request");
        }
        this._notificationService.createNewNotification({
            userId: friendId,
            message: `${userId} accepted your friend request.`,
            action: "show_friends",
            payload: { from: userId },
            type: "important"
        });
        return true;
    }
    async rejectFriendRequest(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        return await this._friendsRepository.rejectFriendRequest(
            userId,
            friendId
        );
    }
    async cancelFriendRequest(
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        return await this._friendsRepository.cancelFriendRequest(
            userId,
            friendshipId
        );
    }
    async removeFriend(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        return await this._friendsRepository.removeFriend(userId, friendId);
    }
    async getFriendRequests(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<FriendRequest[]> {
        return await this._friendsRepository.getFriendRequests(
            userId,
            page,
            limit
        );
    }
    async getFriends(
        userId: User["userId"],
        page: number,
        limit: number,
        sort: FriendsSort
    ): Promise<Friend[]> {
        return await this._friendsRepository.getFriends(
            userId,
            page,
            limit,
            sort
        );
    }
    async blockUser(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        if (userId === friendId) {
            throw new ClientError("You cannot block yourself.");
        }
        const isUserBlocked = await this._blockedUsersRepository.blockUser(
            userId,
            friendId
        );
        if (!isUserBlocked) {
            throw new Error("Failed to block user");
        }
        return true;
    }
    async unblockUser(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        const isUserBlocked = await this._blockedUsersRepository.unblockUser(
            userId,
            friendId
        );
        if (!isUserBlocked) {
            throw new Error("Failed to unblock user");
        }
        return true;
    }
}

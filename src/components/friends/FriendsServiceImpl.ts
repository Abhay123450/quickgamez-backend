import { ClientError } from "../../utils/AppErrors.js";
import { User } from "../users/User.js";
import { BlockUserRepository } from "./block-users/BlockUserRepository.js";
import { Friend, FriendRequest, Friendship, FriendsSort } from "./Friends.js";
import { FriendsRepository } from "./FriendsRepository.js";
import { FriendsService } from "./FriendsService.js";

export class FriendsServiceImpl implements FriendsService {
    private _friendsRepository: FriendsRepository;
    private _blockedUsersRepository: BlockUserRepository;
    constructor(
        friendsRepository: FriendsRepository,
        blockedUsersRepository: BlockUserRepository
    ) {
        this._friendsRepository = friendsRepository;
        this._blockedUsersRepository = blockedUsersRepository;
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
        return await this._friendsRepository.addFriend(from, to);
    }
    async acceptFriendRequest(
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        return await this._friendsRepository.updateFriendRequestStatus(
            friendshipId,
            userId,
            "accepted"
        );
    }
    async rejectFriendRequest(
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        return await this._friendsRepository.rejectFriendRequest(
            userId,
            friendshipId
        );
    }
    async cancelFriendRequest(
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
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

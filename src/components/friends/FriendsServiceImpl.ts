import { NotificationService } from "../notifications/NotificationService.js";
import { User } from "../users/User.js";
import { Friend, FriendRequest, Friendship } from "./Friends.js";
import { FriendsRepository } from "./FriendsRepository.js";
import { FriendsService } from "./FriendsService.js";

export class FriendsServiceImpl implements FriendsService {
    private _friendsRepository: FriendsRepository;
    constructor(friendsRepository: FriendsRepository) {
        this._friendsRepository = friendsRepository;
    }
    async sendFriendRequest(
        from: User["userId"],
        to: User["userId"]
    ): Promise<boolean> {
        return await this._friendsRepository.addFriend(from, to);
    }
    async acceptFriendRequest(
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async rejectFriendRequest(
        friendshipId: Friendship["id"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
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
        throw new Error("Method not implemented.");
    }
    async getFriendRequests(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<FriendRequest[]> {
        throw new Error("Method not implemented.");
    }
    async getFriends(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<Friend[]> {
        throw new Error("Method not implemented.");
    }
    async blockUser(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async unblockUser(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

import { User } from "../users/User.js";
import { Friend, FriendRequest, Friendship } from "./Friends.js";

export interface FriendsService {
    sendFriendRequest: (
        from: User["userId"],
        to: User["userId"]
    ) => Promise<boolean>;
    acceptFriendRequest: (friendshipId: Friendship["id"]) => Promise<boolean>;
    rejectFriendRequest: (friendshipId: Friendship["id"]) => Promise<boolean>;
    removeFriend: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
    getFriendRequests: (
        userId: User["userId"],
        page: number,
        limit: number
    ) => Promise<FriendRequest[]>;
    getFriends: (
        userId: User["userId"],
        page: number,
        limit: number
    ) => Promise<Friend[]>;
}

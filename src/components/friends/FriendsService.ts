import { User } from "../users/User.js";
import { Friend, FriendRequest, Friendship, FriendsSort } from "./Friends.js";

export interface FriendsService {
    sendFriendRequest: (
        from: User["userId"],
        to: User["userId"]
    ) => Promise<boolean>;
    acceptFriendRequest: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
    rejectFriendRequest: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
    cancelFriendRequest: (
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ) => Promise<boolean>;
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
        limit: number,
        sort: FriendsSort
    ) => Promise<Friend[]>;
    blockUser: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
    unblockUser: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
}

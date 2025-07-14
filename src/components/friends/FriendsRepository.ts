import { User } from "../users/User.js";
import type {
    Friend,
    FriendRequest,
    Friendship,
    FriendshipStatus,
    FriendsSort
} from "./Friends.js";

export interface FriendsRepository {
    addFriend: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
    getFriendRequests: (
        userId: User["userId"],
        page: number,
        limit: number
    ) => Promise<FriendRequest[]>;
    acceptFriendRequest: (
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ) => Promise<boolean>;
    rejectFriendRequest: (
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ) => Promise<boolean>;
    cancelFriendRequest: (
        userId: User["userId"],
        friendshipId: Friendship["id"]
    ) => Promise<boolean>;
    getFriends: (
        userId: User["userId"],
        page: number,
        limit: number,
        sort: FriendsSort
    ) => Promise<Friend[]>;
    removeFriend: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
}

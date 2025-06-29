import { User } from "../users/User.js";
import type {
    Friend,
    FriendRequest,
    Friendship,
    FriendshipStatus
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
    updateFriendRequestStatus: (
        friendshipId: Friendship["id"],
        userId: User["userId"],
        status: FriendshipStatus
    ) => Promise<boolean>;
    getFriends: (
        userId: User["userId"],
        page: number,
        limit: number
    ) => Promise<Friend[]>;
    removeFriend: (
        userId: User["userId"],
        friendId: User["userId"]
    ) => Promise<boolean>;
}

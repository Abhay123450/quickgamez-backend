import { User } from "../users/User.js";

/** friendship (how it looks in the database) */
export interface Friendship {
    id: string;
    userAId: User["userId"];
    userBId: User["userId"];
    /** user who send the friend request */
    requestByUserId: User["userId"];
    createdAt: Date;
    updatedAt: Date;
    status: FriendshipStatus;
    /** date when the friend request was accepted */
    friendSince: Date | null;
    events: {
        createdAt: Date;
        status: FriendshipStatus;
        user:
            | User["userId"]
            | Pick<User, "userId" | "username" | "name" | "avatar">;
        description: string;
    }[];
}

export const friendshipStatus = [
    "pending",
    "accepted",
    "rejected",
    "removed"
] as const;

export type FriendshipStatus = (typeof friendshipStatus)[number];

/** pending friend request */
export type FriendRequest = {
    friendshipId: Friendship["id"];
    from: Pick<User, "userId" | "username" | "name" | "avatar">;
    createdAt: Date;
    status: FriendshipStatus;
};

/** friend */
export type Friend = {
    friendshipId: Friendship["id"];
    user: Pick<User, "userId" | "username" | "name" | "avatar">;
    status: FriendshipStatus;
    friendSince: Date;
};

export const friendsSort = ["newest", "oldest"] as const;
export type FriendsSort = (typeof friendsSort)[number];

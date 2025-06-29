import { User } from "../users/User.js";

/** friendship (how it looks in the database) */
export interface Friendship {
    id: string;
    /*** user who send the friend request */
    userAId: User["userId"];
    /** user who recieves the friend request */
    userBId: User["userId"];
    createdAt: Date;
    updatedAt: Date;
    status: FriendshipStatus;
    /** date when the friend request was accepted */
    friendSince: Date | null;
}

export const friendshipStatus = [
    "pending",
    "accepted",
    "rejected",
    "blocked"
] as const;

export type FriendshipStatus = (typeof friendshipStatus)[number];

/** pending friend request */
export type FriendRequest = {
    friendshipId: Friendship["id"];
    from: Pick<User, "userId" | "username" | "name" | "avatar">;
    createdAt: Date;
};

/** friend */
export type Friend = {
    friendshipId: Friendship["id"];
    user: Pick<User, "userId" | "username" | "name" | "avatar">;
    status: FriendshipStatus;
    friendSince: Date;
};

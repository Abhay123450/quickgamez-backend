import { User } from "../../users/User.js";

export interface BlockUser {
    id: string;
    blockedUserId: string;
    blockerUserId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BlockedUser {
    blockedUserId: string;
    blockedUser: Pick<User, "userId" | "username" | "name" | "avatar">;
    blockedSince: Date;
}

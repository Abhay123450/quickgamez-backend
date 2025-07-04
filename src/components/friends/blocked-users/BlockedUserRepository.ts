import { BlockedUser } from "./BlockedUser.js";

export interface BlockedUserRepository {
    getBlockedUsers(
        userId: string,
        page: number,
        limit: number
    ): Promise<BlockedUser[]>;
    blockUser(blockerUserId: string, blockedUserId: string): Promise<boolean>;
    unblockUser(blockerUserId: string, blockedUserId: string): Promise<boolean>;
    isBlocked(blockerUserId: string, blockedUserId: string): Promise<boolean>;
}

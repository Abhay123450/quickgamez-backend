import { BlockedUser } from "./BlockUser.js";

export interface BlockUserRepository {
    getBlockedUsers(
        userId: string,
        page: number,
        limit: number
    ): Promise<BlockedUser[]>;
    blockUser(blockerUserId: string, blockedUserId: string): Promise<boolean>;
    unblockUser(blockerUserId: string, blockedUserId: string): Promise<boolean>;
    isBlocked(blockerUserId: string, blockedUserId: string): Promise<boolean>;
}

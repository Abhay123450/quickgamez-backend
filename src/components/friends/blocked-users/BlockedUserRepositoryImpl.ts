import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { ClientError, ServerError } from "../../../utils/AppErrors.js";
import { BlockedUser } from "./BlockedUser.js";
import { BlockedUserModel } from "./blockedUser.model.js";
import { BlockedUserRepository } from "./BlockedUserRepository.js";

export class BlockedUserRepositoryImpl implements BlockedUserRepository {
    async getBlockedUsers(
        userId: string,
        page: number,
        limit: number
    ): Promise<BlockedUser[]> {
        throw new Error("Method not implemented.");
    }
    async blockUser(
        blockerUserId: string,
        blockedUserId: string
    ): Promise<boolean> {
        try {
            await BlockedUserModel.create({
                blockerUserId,
                blockedUserId
            });
            return true;
        } catch (error: any) {
            if (error.code === 11000) {
                throw new ClientError(
                    "User already blocked",
                    HttpStatusCode.CONFLICT
                );
            }
            console.error(`Error blocking user: ${JSON.stringify(error)}`);
            throw new ServerError("Failed to block user");
        }
    }
    async unblockUser(
        blockerUserId: string,
        blockedUserId: string
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    async isBlocked(
        blockerUserId: string,
        blockedUserId: string
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}

import { HttpStatusCode } from "../../../constants/httpStatusCode.enum.js";
import { ClientError, ServerError } from "../../../utils/AppErrors.js";
import { BlockedUser } from "./BlockUser.js";
import { BlockUserModel } from "./blockUser.model.js";
import { BlockUserRepository } from "./BlockUserRepository.js";

export class BlockUserRepositoryImpl implements BlockUserRepository {
    async getBlockedUsers(
        userId: string,
        page: number,
        limit: number
    ): Promise<BlockedUser[]> {
        const blockedUsers = await BlockUserModel.find({
            blockerUserId: userId
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("blockedUserId", "username name avatar");
        return blockedUsers.map((blockedUser) => {
            return this._convertToBlockedUser(blockedUser);
        });
    }
    async blockUser(
        blockerUserId: string,
        blockedUserId: string
    ): Promise<boolean> {
        try {
            await BlockUserModel.create({
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
        const blockedUser = await BlockUserModel.findOne({
            blockerUserId,
            blockedUserId
        });
        return !!blockedUser;
    }

    private _convertToBlockedUser(document: any): BlockedUser {
        return {
            blockedUserId: document.blockedUserId,
            blockedUser: {
                userId: document.blockedUserId.userId,
                username: document.blockedUserId.username,
                name: document.blockedUserId.name,
                avatar: document.blockedUserId.avatar
            },
            blockedSince: document.createdAt
        };
    }
}

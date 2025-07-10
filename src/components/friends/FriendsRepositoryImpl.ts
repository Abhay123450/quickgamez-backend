import { Schema } from "mongoose";
import { User } from "../users/User.js";
import {
    Friend,
    FriendRequest,
    Friendship,
    FriendshipStatus,
    FriendsSort
} from "./Friends.js";
import { FreindsDocument, FriendModel } from "./friends.model.js";
import { FriendsRepository } from "./FriendsRepository.js";
import { ClientError, ServerError } from "../../utils/AppErrors.js";
import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";

type PopulatedFriendship = Omit<FreindsDocument, "userAId" | "userBId"> & {
    userAId: Pick<User, "username" | "name" | "avatar"> & {
        _id: Schema.Types.ObjectId;
    };
    userBId: Pick<User, "username" | "name" | "avatar"> & {
        _id: Schema.Types.ObjectId;
    };
};

export class FriendsRepositoryImpl implements FriendsRepository {
    /** send friend request */
    async addFriend(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        const friendshipExists: any = await FriendModel.findOne({
            $or: [
                { userAId: userId, userBId: friendId },
                { userAId: friendId, userBId: userId }
            ]
        });
        if (!friendshipExists) {
            const friendship = new FriendModel({
                userAId: userId,
                userBId: friendId,
                status: "pending",
                events: [
                    {
                        createdAt: new Date(),
                        user: userId,
                        status: "pending",
                        description: "userA sent a friend request"
                    }
                ]
            });
            const friendshipSaved = await friendship.save();
            if (!friendshipSaved) {
                throw new Error("Failed to add friend");
            }
            return true;
        }

        if (friendshipExists.status === "accepted") {
            throw new ClientError(
                "You are already friends",
                HttpStatusCode.CONFLICT
            );
        }

        if (friendshipExists.status === "pending") {
            throw new ClientError(
                "Friend request already sent",
                HttpStatusCode.CONFLICT
            );
        }

        // friend request is either "rejected" or "removed"

        friendshipExists.status = "pending";
        friendshipExists.events.push({
            createdAt: new Date(),
            user: userId,
            status: "pending",
            description: `${
                friendshipExists.userAId.toString() === userId
                    ? "userA"
                    : "userB"
            } sent a friend request`
        });
        const friendshipSaved = await friendshipExists.save();
        if (!friendshipSaved) {
            throw new ServerError("Failed to send friend request");
        }
        return true;
    }
    async getFriendRequests(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<FriendRequest[]> {
        const friendRequests = await FriendModel.find({
            userBId: userId,
            status: "pending"
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate<Pick<User, "userId" | "username" | "name" | "avatar">>(
                "userAId",
                "userId username name avatar"
            );
        return friendRequests.map((friendship) =>
            this._convertToFriendRequest(
                friendship as unknown as PopulatedFriendship
            )
        );
    }
    async updateFriendRequestStatus(
        friendshipId: Friendship["id"],
        userId: User["userId"],
        status: FriendshipStatus
    ) {
        const updateBody: Partial<FreindsDocument> = { status };
        if (status === "accepted") {
            updateBody.friendSince = new Date();
        }
        const accepted = await FriendModel.findByIdAndUpdate(
            {
                _id: friendshipId,
                userBId: userId
            },
            updateBody
        );
        if (!accepted) {
            throw new ClientError("Friend request not found", 404);
        }
        return true;
    }
    async rejectFriendRequest(
        friendshipId: Friendship["id"],
        userId: User["userId"]
    ): Promise<boolean> {
        const rejected: any = await FriendModel.findByIdAndUpdate(
            {
                _id: friendshipId,
                userBId: userId
            },
            {
                status: "rejected",
                $push: {
                    events: {
                        status: "rejected",
                        user: userId,
                        description: "user rejected friend request"
                    }
                }
            }
        );
        if (!rejected) {
            throw new ClientError("Friend request not found", 404);
        }
        return true;
    }
    async getFriends(
        userId: User["userId"],
        page: number,
        limit: number,
        sort: FriendsSort
    ): Promise<Friend[]> {
        const sortObj: { createdAt: 1 | -1 } =
            sort === "newest" ? { createdAt: -1 } : { createdAt: 1 };
        const friendship = await FriendModel.find({
            $or: [{ userAId: userId }, { userBId: userId }],
            status: "accepted"
        })
            .sort(sortObj)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate<Pick<User, "userId" | "username" | "name" | "avatar">>(
                "userAId",
                "userId username name avatar"
            )
            .populate<Pick<User, "userId" | "username" | "name" | "avatar">>(
                "userBId",
                "userId username name avatar"
            );
        return friendship.map((friendship: any) => {
            if (friendship.userAId._id.toString() === userId) {
                return {
                    friendshipId: friendship.id,
                    user: {
                        userId: friendship.userBId._id.toString(),
                        username: friendship.userBId.username,
                        name: friendship.userBId.name,
                        avatar: friendship.userBId.avatar
                    },
                    status: friendship.status,
                    friendSince: friendship.friendSince
                };
            }
            return {
                friendshipId: friendship.id,
                user: {
                    userId: friendship.userAId._id.toString(),
                    username: friendship.userAId.username,
                    name: friendship.userAId.name,
                    avatar: friendship.userAId.avatar
                },
                status: friendship.status,
                friendSince: friendship.friendSince
            };
        });
    }
    async removeFriend(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        const removed = await FriendModel.findOneAndUpdate(
            {
                $or: [
                    { userAId: userId, userBId: friendId },
                    { userAId: friendId, userBId: userId }
                ],
                status: "accepted"
            },
            {
                status: "removed",
                friendSince: null,
                $push: {
                    events: {
                        status: "removed",
                        user: userId,
                        description: "user removed friend"
                    }
                }
            }
        );
        if (!removed) {
            throw new ClientError("Friend not found", 404);
        }
        return true;
    }

    private _convertToFriendRequest(
        friendship: PopulatedFriendship
    ): FriendRequest {
        return {
            friendshipId: friendship.id,
            from: {
                userId: friendship.userAId._id.toString(),
                username: friendship.userAId.username,
                name: friendship.userAId.name,
                avatar: friendship.userAId.avatar
            },
            createdAt: friendship.createdAt,
            status: friendship.status
        };
    }
}

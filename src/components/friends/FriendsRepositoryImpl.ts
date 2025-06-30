import { Schema } from "mongoose";
import { User } from "../users/User.js";
import {
    Friend,
    FriendRequest,
    Friendship,
    FriendshipStatus
} from "./Friends.js";
import { FreindsDocument, FriendModel } from "./friends.model.js";
import { FriendsRepository } from "./FriendsRepository.js";
import { ClientError, ServerError } from "../../utils/AppErrors.js";

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
        const friendship = new FriendModel({
            userAId: userId,
            userBId: friendId
        });
        const friendshipSaved = await friendship.save();
        if (!friendshipSaved) {
            throw new Error("Failed to add friend");
        }
        return true;
    }
    async getFriendRequests(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<FriendRequest[]> {
        const friendRequests = await FriendModel.find({
            userBId: userId
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
        const rejected = await FriendModel.findByIdAndUpdate(
            {
                _id: friendshipId,
                userBId: userId
            },
            { status: "rejected" }
        );
        if (!rejected) {
            throw new ClientError("Friend request not found", 404);
        }
        return true;
    }
    async getFriends(
        userId: User["userId"],
        page: number,
        limit: number
    ): Promise<Friend[]> {
        throw new Error("Method not implemented.");
    }
    async removeFriend(
        userId: User["userId"],
        friendId: User["userId"]
    ): Promise<boolean> {
        throw new Error("Method not implemented.");
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
            createdAt: friendship.createdAt
        };
    }
}

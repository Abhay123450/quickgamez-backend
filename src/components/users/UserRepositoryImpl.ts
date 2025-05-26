import { SortOrder } from "mongoose";
import { hashPassword } from "../../utils/passwordUtil.js";
import { User } from "./User.js";
import { UserRepository } from "./UserRepository.js";
import { UserDocument, UserModel } from "./user.model.js";

export class UserRepositoryImpl implements UserRepository {
    /**
     * Adds a new user to the repository.
     *
     * @param {Pick<User, "name" | "email" | "password" | "username">} user - The user object to add.
     * @return {Promise<User | null>} A promise that resolves to the newly added user, or null if the user was not added.
     */
    async addUser(
        user: Pick<
            User,
            | "name"
            | "email"
            | "password"
            | "username"
            | "accountStatus"
            | "googleId"
            | "profileImage"
            | "authProvider"
        >
    ): Promise<User | null> {
        const newUser = await UserModel.create(user);
        const userAdded = await newUser.save();
        if (!userAdded) {
            return null;
        }
        return this._convertUserDocumentToUser(userAdded);
    }

    async getUsers(
        page: number,
        limit: number,
        sort: number = 1,
        filter?: Partial<User>
    ): Promise<Partial<User>[]> {
        let sortObject: {
            [K in keyof User]?: { [key in K]: SortOrder };
        }[keyof User] = {
            createdAt: "desc"
        };
        switch (sort) {
            case 0: // oldest
                sortObject = {
                    createdAt: "asc"
                };
                break;
            case 1: // newest
                sortObject = {
                    createdAt: "desc"
                };
                break;
            case 2: // alphabetically
                sortObject = {
                    name: "asc"
                };
                break;
            case 3: // reverse alphabetically
                sortObject = {
                    name: "desc"
                };
                break;
            default:
                sortObject = {
                    createdAt: "desc"
                };
                break;
        }
        if (!filter) {
            filter = {};
        }
        const users = await UserModel.find(filter)
            .sort(sortObject)
            .skip((page - 1) * limit)
            .limit(limit);
        if (!users) {
            return [];
        }
        return users.map((user) => this._convertUserDocumentToUser(user));
    }

    async getUserById(userId: string): Promise<User | null>;
    async getUserById(
        userId: string,
        selectFields: (keyof User)[]
    ): Promise<Partial<User> | null>;
    async getUserById(
        userId: string,
        fieldsToSelect?: (keyof User)[]
    ): Promise<User | Partial<User> | null> {
        let fieldsStr: any = "";
        if (fieldsToSelect) {
            fieldsStr = fieldsToSelect.join(" ");
        }
        const user = await UserModel.findById(userId).select(fieldsStr);
        if (!user) {
            return null;
        }
        return this._convertUserDocumentToUser(user);
    }

    /**
     * Retrieves a user by their email or username.
     *
     * @param {string} id - The email or username of the user.
     * @param {Array<keyof User>} [selectFields] - An optional array of fields to select from the user document.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object with the selected fields, or null if not found.
     */
    async getUserByEmailOrUsername(
        id: string,
        selectFields?: (keyof User)[]
    ): Promise<Partial<User> | null> {
        const fieldsStr = selectFields?.join(" ") || "";
        const user: Partial<UserDocument> | null = await UserModel.findOne({
            $or: [
                { email: new RegExp(`^${id}$`, "i") },
                { username: new RegExp(`^${id}$`, "i") }
            ]
        }).select(fieldsStr);
        if (!user) {
            return null;
        }
        return this._convertUserDocumentToUser(user);
    }

    async updateUser(userId: string, user: Partial<User>): Promise<boolean> {
        const userUpdated = await UserModel.findByIdAndUpdate(userId, user);
        if (!userUpdated) {
            return false;
        }
        return true;
    }

    async saveRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<boolean> {
        const userUpdated = await UserModel.findByIdAndUpdate(userId, {
            $push: { refreshTokens: refreshToken }
        });
        if (!userUpdated) {
            return false;
        }
        return true;
    }

    async deleteRefreshToken(
        userId: string,
        refreshToken: string
    ): Promise<boolean> {
        const userUpdated = await UserModel.findByIdAndUpdate(
            userId,
            {
                $pull: { refreshTokens: refreshToken }
            },
            { new: true }
        );
        if (!userUpdated) {
            return false;
        }
        return true;
    }

    async deleteUser(userId: string): Promise<boolean> {
        const userDeleted = await UserModel.findByIdAndDelete(userId);
        if (!userDeleted) {
            return false;
        }
        return true;
    }

    /**
     * Retrieves a user from the repository based on the provided filter.
     *
     * @param {Partial<User>} filter - The filter object to narrow down the search results.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object, or null if not found.
     */
    async getUser(filter: Partial<User>): Promise<Partial<User> | null> {
        const user = await UserModel.findOne(filter);
        if (!user) {
            return null;
        }
        return this._convertUserDocumentToUser(user);
    }

    async saveOtp(email: string, otp: number): Promise<boolean> {
        const userUpdated = await UserModel.findOneAndUpdate(
            {
                email: email
            },
            {
                emailOtp: {
                    otp: otp,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000)
                }
            },
            { new: true }
        );
        if (!userUpdated) {
            return false;
        }
        return true;
    }

    async updatePassword(
        email: string,
        otp: number,
        newPassword: string
    ): Promise<boolean> {
        newPassword = await hashPassword(newPassword);
        const passwordUpdated = await UserModel.findOneAndUpdate(
            {
                email: email,
                "emailOtp.otp": otp,
                "emailOtp.expiresAt": { $gte: Date.now() }
            },
            {
                password: newPassword,
                emailOtp: {
                    otp: null,
                    expiresAt: null
                }
            },
            { new: true }
        );
        if (!passwordUpdated) {
            return false;
        }
        return true;
    }

    /**
     * Converts a UserDocument object to a User object.
     * Used to rename database specific properties to User properties.
     *
     * @param {UserDocument} userDocument - The UserDocument object to be converted.
     * @return {User} The converted User object.
     */
    private _convertUserDocumentToUser(userDocument: UserDocument): User;
    private _convertUserDocumentToUser(
        userDocument: Partial<UserDocument>
    ): Partial<User>;
    private _convertUserDocumentToUser(
        userDocument: UserDocument | Partial<UserDocument>
    ): User | Partial<User> {
        let user: Partial<User> = {};

        if (userDocument._id) user.userId = userDocument._id;
        if (userDocument.username) user.username = userDocument.username;
        if (userDocument.name) user.name = userDocument.name;
        if (userDocument.email) user.email = userDocument.email;
        if (userDocument.phone) user.phone = userDocument.phone;
        if (userDocument.password) user.password = userDocument.password;
        if (userDocument.role) user.role = userDocument.role;
        if (userDocument.accountStatus)
            user.accountStatus = userDocument.accountStatus;
        if (userDocument.googleId) user.googleId = userDocument.googleId;
        if (userDocument.createdAt) user.createdAt = userDocument.createdAt;
        if (userDocument.refreshTokens)
            user.refreshTokens = userDocument.refreshTokens;
        if (userDocument.deviceTokens)
            user.deviceTokens = userDocument.deviceTokens;
        if (userDocument.emailOtp) user.emailOtp = userDocument.emailOtp;
        if (userDocument.avatar) user.avatar = userDocument.avatar;
        if (userDocument.profileImage)
            user.profileImage = userDocument.profileImage;

        return user;
    }
}

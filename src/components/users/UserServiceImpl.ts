import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";
import { UserAccountStatus } from "../../constants/userAccountStatus.enum.js";
import { UserRole } from "../../constants/userRole.enum.js";
import { AppError } from "../../utils/AppError.js";
import { ClientError } from "../../utils/AppErrors.js";
import { ConsoleLog } from "../../utils/ConsoleLog.js";
import { generateOtp } from "../../utils/otpUtil.js";
import { User } from "./User.js";
import { UserRepository } from "./UserRepository.js";
import { UserService } from "./UserService.js";

export class UserServiceImpl implements UserService {
    private _userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this._userRepository = userRepository;
    }
    async addUser(
        name: string,
        email: string,
        password: string,
        username?: string
    ): Promise<User | null> {
        const emailExists = await this._userRepository.getUserByEmailOrUsername(
            email
        );
        if (emailExists) {
            throw new ClientError(
                "Email already registered",
                HttpStatusCode.CONFLICT
            );
        }
        if (!username) {
            username = email.split("@")[0].replace(/\./g, "_");
            username += generateOtp(5);
        }
        const user = {
            name: name,
            email: email,
            password: password,
            username: username,
            role: UserRole.USER,
            accountStatus: UserAccountStatus.UNVERIFIED,
            emailOtp: {
                otp: generateOtp(6),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
            }
        };
        return await this._userRepository.addUser(user);
    }

    async getUsers(
        page: number,
        limit: number,
        sort: number,
        filter?: Partial<User>
    ): Promise<Partial<User>[]> {
        return await this._userRepository.getUsers(page, limit, sort);
    }

    async getUserById(id: string): Promise<Partial<User> | null> {
        const selectFields: (keyof User)[] = [
            "userId",
            "username",
            "email",
            "name",
            "phone",
            "createdAt",
            "accountStatus"
        ];

        console.log(`selectFields is ${JSON.stringify(selectFields)}`);
        return await this._userRepository.getUserById(id, selectFields);
    }

    async getMyProfile(userId: string): Promise<Partial<User> | null> {
        let userDetails: Partial<User> | null =
            await this._userRepository.getUserById(userId);
        if (!userDetails) {
            throw new Error("User not found");
        }
        delete userDetails["password"];
        delete userDetails["refreshTokens"];

        ConsoleLog.info(`User details: ${JSON.stringify(userDetails)}`);

        return userDetails;
    }

    async getUserByEmailOrUsername(id: string): Promise<Partial<User> | null> {
        const selectFields: (keyof User)[] = [
            "userId",
            "username",
            "email",
            "name",
            "phone",
            "createdAt",
            "accountStatus"
        ];
        return await this._userRepository.getUserByEmailOrUsername(
            id,
            selectFields
        );
    }

    async updateUser(
        userId: string,
        fieldsToUpdate: Partial<User>
    ): Promise<boolean> {
        return await this._userRepository.updateUser(userId, fieldsToUpdate);
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this._userRepository.deleteUser(userId);
    }
}

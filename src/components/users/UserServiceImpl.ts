import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";
import { UserAccountStatus } from "../../constants/userAccountStatus.enum.js";
import { UserRole } from "../../constants/userRole.enum.js";
import { ClientError, ServerError } from "../../utils/AppErrors.js";
import { ConsoleLog } from "../../utils/ConsoleLog.js";
import { generateSecureRandomString } from "../../utils/generateSecureRandomString.js";
import { generateOtp } from "../../utils/otpUtil.js";
import { EmailService } from "../email/EmailService.js";
import { NotificationService } from "../notifications/NotificationService.js";
import { User } from "./User.js";
import { UserRepository } from "./UserRepository.js";
import { UserService } from "./UserService.js";

export class UserServiceImpl implements UserService {
    private _userRepository: UserRepository;
    private _emailService: EmailService;
    private _notificationService: NotificationService;
    constructor(
        userRepository: UserRepository,
        emailService: EmailService,
        notificationService: NotificationService
    ) {
        this._userRepository = userRepository;
        this._emailService = emailService;
        this._notificationService = notificationService;
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
            username = name.split(" ")[0].slice(0, 12);
            username += generateSecureRandomString(12);
        }
        const user: Pick<
            User,
            | "name"
            | "email"
            | "password"
            | "username"
            | "role"
            | "accountStatus"
            | "emailOtp"
            | "authProvider"
        > = {
            name: name,
            email: email,
            password: password,
            username: username,
            role: UserRole.USER,
            accountStatus: UserAccountStatus.UNVERIFIED,
            emailOtp: {
                otp: generateOtp(6),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
            },
            authProvider: "email"
        };
        const userAdded = await this._userRepository.addUser(user);
        if (!userAdded) {
            throw new ServerError("Failed to add user");
        }
        this._emailService.sendRegistrationOtpEmail(
            email,
            name,
            user.emailOtp.otp
        );
        this._notificationService.createNewNotification({
            userId: userAdded.userId,
            message: "Claim your unique username now!",
            type: "important",
            payload: null,
            action: "open_profile"
        });
        this._notificationService.createNewNotification({
            userId: userAdded.userId,
            message: "Change your avatar!",
            type: "normal",
            payload: null,
            action: "open_profile"
        });
        return userAdded;
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
            "accountStatus",
            "avatar"
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

    async saveAvatar(userId: string, avatar: string): Promise<boolean> {
        return await this._userRepository.updateUser(userId, { avatar });
    }
}

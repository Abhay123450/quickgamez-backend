import { Request, Response, NextFunction } from "express";
import { UserController } from "./UserController.js";
import { matchedData, validationResult } from "express-validator";
import { sendResponseSuccess } from "../../utils/sendResponse.js";
import { User } from "./User.js";
import { UserService } from "./UserService.js";
import { HttpStatusCode } from "../../constants/httpStatusCode.enum.js";
import { ConsoleLog } from "../../utils/ConsoleLog.js";
import { ClientError, ValidationError } from "../../utils/AppErrors.js";

export class UserControllerImpl implements UserController {
    private userService: UserService;
    constructor(userService: UserService) {
        this.userService = userService;
    }

    async addUser(req: Request, res: Response, next: NextFunction) {
        console.log(`req.body is ${JSON.stringify(req.body)}`);
        const errors = validationResult(req);
        const errorMessages: string[] = errors
            .array()
            .map((error) => error.msg);
        if (!errors.isEmpty()) {
            console.log(errorMessages);
            throw new ValidationError(errorMessages);
        }
        const { name, email, password, username } = matchedData(req);
        ConsoleLog.info(
            `name is ${name} email is ${email} password is ${password} username is ${username}`
        );
        const userSaved = await this.userService.addUser(
            name,
            email,
            password,
            username
        );
        if (!userSaved) {
            throw new Error("Error saving user");
        }
        return sendResponseSuccess(
            res,
            HttpStatusCode.CREATED,
            "User saved successfully",
            {
                user: this._removeSensitiveData(userSaved)
            }
        );
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        console.log(`req.query is ${JSON.stringify(matchedData(req))}`);

        const { page, limit, sort, filter } = matchedData(req);

        const users: Partial<User>[] = await this.userService.getUsers(
            page,
            limit,
            sort
        );

        return sendResponseSuccess(res, users);
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        if (!userId) {
            throw new ClientError("User id is required");
        }
        const user: Partial<User> | null = await this.userService.getUserById(
            userId
        );
        ConsoleLog.info(`user is ${JSON.stringify(user)}`);
        if (!user) {
            throw new ClientError("User not found");
        }
        return sendResponseSuccess(res, user as User);
    }

    async getMyDetails(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.userId;
        if (!userId) {
            throw new ClientError("User id is required");
        }

        const user: Partial<User> | null = await this.userService.getUserById(
            userId
        );

        if (!user) {
            throw new ClientError("User not found");
        }

        return sendResponseSuccess(res, this._removeSensitiveData(user));
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {}

    async deleteUser(req: Request, res: Response, next: NextFunction) {}

    async isUserNameAvailable(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            console.log(errorMessages);
            throw new ValidationError(errorMessages);
        }
        const { username } = matchedData(req);
        if (!username) {
            throw new ValidationError(["Username is required"]);
        }
        const user = await this.userService.getUserByEmailOrUsername(username);
        const isAvailable: boolean = user ? false : true;
        return sendResponseSuccess(res, { isAvailable, username });
    }

    private _removeSensitiveData(user: Partial<User>): Partial<User> {
        delete user.password;
        delete user.refreshTokens;
        delete user.emailOtp;
        delete user.deviceTokens;
        return user;
    }
}
import { User, UserPreferences } from "./User.js";

export interface UserService {
    addUser(
        name: string,
        email: string,
        password: string,
        username?: string
    ): Promise<User | null>;
    getUsers(
        page: number,
        limit: number,
        sort: number,
        filter?: Partial<User>
    ): Promise<Partial<User>[]>;
    getUserById(userId: string): Promise<Partial<User> | null>;
    getMyProfile(userId: string): Promise<Partial<User> | null>;
    getUserByEmailOrUsername(userId: string): Promise<Partial<User> | null>;
    updateUser(userId: string, fieldsToUpdate: Partial<User>): Promise<boolean>;
    updateUserPreferences(
        userId: string,
        fieldsToUpdate: Partial<UserPreferences>
    ): Promise<boolean>;
    deleteUser(userId: string): Promise<boolean>;
    saveAvatar(userId: string, avatar: string): Promise<boolean>;
}

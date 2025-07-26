import { User, UserPreferences } from "./User.js";

export interface UserRepository {
    addUser(
        user: Pick<
            User,
            | "name"
            | "email"
            | "password"
            | "username"
            | "accountStatus"
            | "profileImage"
            | "googleId"
            | "authProvider"
        >
    ): Promise<User | null>;
    /**
     * Retrieves a user from the repository based on the provided filter.
     *
     * @param {Partial<User>} filter - The filter object to narrow down the search results.
     * @param {(keyof User)[]} [selectFields] - An optional array of fields to select from the user document.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object with the selected fields, or null if not found.
     */
    getUser(
        filter: Partial<User>,
        selectFields?: (keyof User)[]
    ): Promise<Partial<User> | null>;
    /**
     * Retrieves a paginated list of users from the repository based on the provided filter, sorting, and pagination parameters.
     *
     * @param {number} page - The page number of the results to retrieve.
     * @param {number} limit - The maximum number of users to retrieve per page.
     * @param {number} sort - The sorting order of the results.
     * @param {Partial<User>} [filter] - An optional filter object to narrow down the search results.
     * @return {Promise<Partial<User>[]>} A promise that resolves to an array of user objects matching the filter and pagination criteria.
     */
    getUsers(
        page: number,
        limit: number,
        sort: number,
        filter?: Partial<User>
    ): Promise<Partial<User>[]>;

    /**
     * Retrieves a user by their ID with selected fields.
     *
     * @param {string} userId - The ID of the user to retrieve.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object with the selected fields, or null if not found.
     */
    getUserById(userId: string): Promise<User | null>;
    /**
     * Retrieves a user by their ID with selected fields.
     *
     * @param {string} userId - The ID of the user to retrieve.
     * @param {(keyof User)[]} selectFields - An array of fields to select from the user document.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object with the selected fields, or null if not found.
     */
    getUserById(
        userId: string,
        selectFields: (keyof User)[]
    ): Promise<Partial<User> | null>;
    /**
     * Retrieves a user from the database by their email or username.
     *
     * @param {string} id - The email or username of the user.
     * @param {Array<keyof User>} [selectFields] - An optional array of fields to select from the user document.
     * @return {Promise<Partial<User> | null>} A promise that resolves to the user object with the selected fields, or null if not found.
     */
    getUserByEmailOrUsername(
        id: string,
        selectFields?: (keyof User)[]
    ): Promise<Partial<User> | null>;
    /**
     * Updates a user with the given ID.
     *
     * @param {string} userId - The ID of the user to update.
     * @param {Partial<User>} fieldsToUpdate - The partial user object containing the updated fields.
     * @return {Promise<boolean>} A Promise that resolves to true if the user was successfully updated, false otherwise.
     */
    updateUser(userId: string, fieldsToUpdate: Partial<User>): Promise<boolean>;

    saveRefreshToken(userId: string, refreshToken: string): Promise<boolean>;
    deleteRefreshToken(userId: string, refreshToken: string): Promise<boolean>;

    /**
     * Deletes a user by their ID.
     *
     * @param {string} userId - The ID of the user to delete.
     * @return {Promise<boolean>} A Promise that resolves to true if the user was successfully deleted, false otherwise.
     */
    deleteUser(userId: string): Promise<boolean>;

    saveOtp(email: string, otp: number): Promise<boolean>;
    updatePassword(
        email: string,
        otp: number,
        newPassword: string
    ): Promise<boolean>;
    updateNotificationSettings(
        userId: string,
        settings: Partial<UserPreferences["notifications"]>
    ): Promise<boolean>;
}

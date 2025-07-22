import { UserRole } from "../../constants/userRole.enum.js";
import { UserAccountStatus } from "../../constants/userAccountStatus.enum.js";

export interface UserAuth {
    refreshTokens: string[];
    deviceTokens: [
        {
            deviceType: string;
            deviceToken: string;
        }
    ];
    emailOtp: {
        otp: number;
        expiresAt: Date;
    };
    googleId?: string;
    authProvider: "google" | "email";
}
export interface UserDetails {
    username: string;
    name: string;
    email: string;
    phone?: number;
    password?: string;
    role: UserRole;
    accountStatus: UserAccountStatus;
    createdAt: Date;
    avatar?: string;
    profileImage?: string | null;
    bio?: string | null;
}
export interface User extends UserDetails, UserAuth {
    userId: string;
}
export type UserInit = Pick<User, "name" | "email" | "password">;

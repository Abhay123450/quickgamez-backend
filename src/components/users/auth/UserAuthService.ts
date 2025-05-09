import { User } from "../User.js";

export interface UserAuthService {
    login(
        userId: string,
        password: string
    ): Promise<{
        accessToken: string;
        refreshToken: string;
        user: Partial<User>;
    }>;
    logout(userId: string, accessToken: string): Promise<boolean>;
    getAccessToken(refreshToken: string): Promise<string>;
    verifyEmailWithOtp(email: string, otp: number): Promise<boolean>;
    saveAndSendEmailOtp(email: string): Promise<boolean>;
    resetPassword(
        email: string,
        otp: number,
        newPassword: string
    ): Promise<boolean>;
}

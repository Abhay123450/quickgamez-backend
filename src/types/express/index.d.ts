import { User } from "../../components/users/User.ts";
import { Express, Request } from "express";

declare global {
    namespace Express {
        export interface Request {
            user: Pick<User, "userId" | "accountStatus" | "role">;
            userId?: string;
            accessToken?: string;
            refreshToken?: string;
        }
    }
}

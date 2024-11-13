import { Schema, Document, model } from "mongoose";
import { User } from "./User.js";
import { UserRole } from "../../constants/userRole.enum.js";
import { UserAccountStatus } from "../../constants/userAccountStatus.enum.js";
import { hashPassword, isPasswordMatched } from "../../utils/passwordUtil.js";
import jwt from "jsonwebtoken";

export interface UserDocument extends User, Document {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

export const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true
        },
        phone: {
            countryCode: String,
            number: String
        },
        password: String,
        role: {
            type: String,
            required: true,
            enum: Object.values(UserRole),
            default: UserRole.USER
        },
        accountStatus: {
            type: String,
            required: true,
            enum: Object.values(UserAccountStatus),
            default: UserAccountStatus.UNVERIFIED
        },
        googleId: String,
        refreshTokens: [String],
        deviceTokens: [
            {
                deviceInfo: String,
                deviceToken: String
            }
        ],
        emailOtp: {
            otp: Number,
            expiresAt: Date
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hashPassword(this.password);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await isPasswordMatched(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
    console.log(process.env.ACCESS_TOKEN_VALIDITY);
    console.log(process.env.ACCESS_TOKEN_SECRET);

    return jwt.sign(
        { _id: this._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_VALIDITY as string
        }
    );
};

userSchema.methods.generateRefreshToken = function (): string {
    console.log(process.env.ACCESS_TOKEN_VALIDITY);
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_VALIDITY as string
        }
    );
};

export const UserModel = model<UserDocument>("User", userSchema, "users");

import { createTransport, Transporter } from "nodemailer";
import { EmailService } from "./EmailService.js";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";

const PRIVACY_POLICY_URL = "https://quickgamez.com/privacy-policy";
const TERMS_OF_USE_URL = "https://quickgamez.com/terms-of-use";
const CONTACT_US_URL = "https://quickgamez.com/contact-us";
const COMPANY_NAME = "QuickGamez";
const CONTACT_EMAIL = "contact@quickgamez.com";

export class EmailServiceImpl implements EmailService {
    private _getTransporter(): Transporter<
        SMTPTransport.SentMessageInfo,
        SMTPTransport.Options
    > {
        return createTransport({
            host: "smtp.hostinger.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(
        to: string,
        subject: string,
        html: string,
        text: string
    ): Promise<void> {
        const transporter = this._getTransporter();
        const info = await transporter.sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to,
            subject,
            html,
            text
        });
        console.log("Message sent: %s", info.messageId);
    }
    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        const html = `<!DOCTYPE html>
                        <html>
                        <head>
                        <meta charset="UTF-8" />
                        <title>Welcome to QuickGamez</title>
                        </head>
                        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #fef9c3;">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden;">
                            <tr>
                            <td style="padding: 20px;">
                                <h2 style="margin-top: 0;">👋 Welcome to QuickGamez!</h2>
                                <p>Thanks for signing up. Here are some featured games you might enjoy:</p>

                                <!-- Item List Start -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                <!-- Item 1 -->
                                <tr>
                                    <td colspan="2" style="padding: 10px 0;">
                                    <a href="https://quickgamez.com/games/guess-the-movie/hollywood" style="text-decoration: none; color: #000; display: flex; align-items: center;">
                                        <img src="https://quickgamez.com/_app/immutable/assets/guess-the-movie-hollywood-thumbnail-480.1PGK6aPT.webp" alt="Guess The Movie - Hollywood" style="width: 20%; max-width: 150px; border-radius: 4px; margin-right: 10px;" />
                                        <div style="width: 80%;">
                                        <strong style="font-size: 16px;">Guess The Movie - Hollywood</strong>
                                        <p style="margin: 5px 0; font-size: 14px; color: #555;">Test your movie knowledge with this movie guessing game.</p>
                                        </div>
                                    </a>
                                    </td>
                                </tr>
                                <!-- Item 2 -->
                                <tr>
                                    <td colspan="2" style="padding: 10px 0;">
                                    <a href="https://quickgamez.com/games/guess-the-movie/bollywood" style="text-decoration: none; color: #000; display: flex; align-items: center;">
                                        <img src="https://quickgamez.com/_app/immutable/assets/guess-the-movie-bollywood-thumbnail-480.DgZdzsVY.webp" alt="Guess The Movie - Hollywood" style="width: 20%; max-width: 150px; border-radius: 4px; margin-right: 10px;" />
                                        <div style="width: 80%;">
                                        <strong style="font-size: 16px;">Guess The Movie - Bollywood</strong>
                                        <p style="margin: 5px 0; font-size: 14px; color: #555;">Test your movie knowledge with this movie guessing game.</p>
                                        </div>
                                    </a>
                                    </td>
                                </tr>
                                <!-- Item 3 -->
                                <tr>
                                    <td colspan="2" style="padding: 10px 0;">
                                    <a href="https://quickgamez.com/geames/rebus-puzzles" style="text-decoration: none; color: #000; display: flex; align-items: center;">
                                        <img src="https://quickgamez.com/_app/immutable/assets/rebus-puzzles-thumbnail-1080.BbKXUlcS.webp" alt="Game 2" style="width: 20%; max-width: 150px; border-radius: 4px; margin-right: 10px;" />
                                        <div style="width: 80%;">
                                        <strong style="font-size: 16px;">Rebus puzzles</strong>
                                        <p style="margin: 5px 0; font-size: 14px; color: #555;">Challenge your brain with these fun and exciting rebus puzzles.</p>
                                        </div>
                                    </a>
                                    </td>
                                </tr>
                                </table>
                                <!-- Item List End -->

                                <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

                                <p style="font-size: 12px; color: #666; text-align: center;">
                                Need help? Contact us at
                                <a href="mailto:contact@quickgamez.com" style="color: #dc2626; text-decoration: none;">
                                    contact@quickgamez.com
                                </a>
                                </p>

                                <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                                <a href="https://quickgamez.com/privacy" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
                                &nbsp;|&nbsp;
                                <a href="https://quickgamez.com/terms" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
                                </p>
                            </td>
                            </tr>
                        </table>
                        </body>
                        </html>`;

        await this.sendEmail(to, "Welcome to QuickGamez", html, "");
    }
    async sendRegistrationOtpEmail(
        to: string,
        name: string,
        otp: number
    ): Promise<void> {
        const html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <title>Email Verification OTP</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                            }
                            .container {
                            background-color: #fef9c3;
                            max-width: 600px;
                            margin: 40px auto;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            h1 {
                            color: #333333;
                            }
                            .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #dc2626;
                            letter-spacing: 4px;
                            margin: 20px 0;
                            }
                            .footer {
                            font-size: 12px;
                            color: #888888;
                            text-align: center;
                            margin-top: 30px;
                            }
                            .button {
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: #4a90e2;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                            }
                            @media (max-width: 600px) {
                            .container {
                                padding: 20px;
                                margin: 20px;
                            }
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Welcome to QuickGamez.com</h1>
                            <p>Hi ${name},</p>
                            <p>Thank you for registering. To complete your sign-up, please use the following One-Time Password (OTP):</p>
                            <div class="otp">${otp}</div>
                            <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
                            <p>If you did not request this, please ignore this email.</p>
                            <div class="footer">
                            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

                            <p style="font-size: 12px; color: #666; text-align: center;">
                            Need help? Contact us at
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626; text-decoration: none;">
                                ${CONTACT_EMAIL}
                            </a>
                            </p>

                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                            <a href="${PRIVACY_POLICY_URL}" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
                            &nbsp;|&nbsp;
                            <a href="${TERMS_OF_USE_URL}" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
                            </p>
                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">&copy; ${new Date().getFullYear()} QuickGamez. All rights reserved.</p>
                            </div>
                        </div>
                        </body>
                        </html>
                        `;
        const text = `To verify your email address, please use the following One-Time Password (OTP): ${otp}. This OTP is valid for the next 10 minutes. Do not share it with anyone.`;

        const info = await this._getTransporter().sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to,
            subject: "Email Verification OTP - QuickGamez.com",
            html,
            text
        });

        console.log("Message sent: ", info);
    }
    async sendVerificationOTPEmail(to: string, otp: number): Promise<void> {
        const html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <title>OTP Verification</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                            }
                            .container {
                            background-color: #fef9c3;
                            max-width: 600px;
                            margin: 40px auto;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            h1 {
                            color: #333333;
                            }
                            .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #dc2626;
                            letter-spacing: 4px;
                            margin: 20px 0;
                            }
                            .footer {
                            font-size: 12px;
                            color: #888888;
                            text-align: center;
                            margin-top: 30px;
                            }
                            .button {
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: #4a90e2;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                            }
                            @media (max-width: 600px) {
                            .container {
                                padding: 20px;
                                margin: 20px;
                            }
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Email Verification OTP - QuickGamez.com</h1>
                            <p>To verify your email address, please use the following One-Time Password (OTP):</p>
                            <div class="otp">${otp}</div>
                            <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
                            <p>If you did not request this, please ignore this email.</p>
                            <div class="footer">
                            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

                            <p style="font-size: 12px; color: #666; text-align: center;">
                            Need help? Contact us at
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626; text-decoration: none;">
                                ${CONTACT_EMAIL}
                            </a>
                            </p>

                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                            <a href="${PRIVACY_POLICY_URL}" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
                            &nbsp;|&nbsp;
                            <a href="${TERMS_OF_USE_URL}" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
                            </p>
                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                            &copy; ${new Date().getFullYear()} QuickGamez. All rights reserved.
                            </p>
                            </div>
                        </div>
                        </body>
                        </html>
                        `;
        const text = `To verify your email address, please use the following One-Time Password (OTP): ${otp}. This OTP is valid for the next 10 minutes. Do not share it with anyone.`;

        const info = await this._getTransporter().sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to,
            subject: "Email Verification OTP - QuickGamez.com",
            html,
            text
        });

        console.log("Message sent: ", info);
    }
    async sendResetPasswordOtpEmail(to: string, otp: number): Promise<void> {
        const html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <title>Reset Password OTP</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                            }
                            .container {
                            background-color: #fef9c3;
                            max-width: 600px;
                            margin: 40px auto;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            h1 {
                            color: #333333;
                            }
                            .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #dc2626;
                            letter-spacing: 4px;
                            margin: 20px 0;
                            }
                            .footer {
                            font-size: 12px;
                            color: #888888;
                            text-align: center;
                            margin-top: 30px;
                            }
                            .button {
                            display: inline-block;
                            padding: 12px 20px;
                            background-color: #4a90e2;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin-top: 20px;
                            }
                            @media (max-width: 600px) {
                            .container {
                                padding: 20px;
                                margin: 20px;
                            }
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Reset password OTP - QuickGamez.com</h1>
                            <p>You have requested to reset your password, please use the following One-Time Password (OTP):</p>
                            <div class="otp">${otp}</div>
                            <p>This OTP is valid for the next 10 minutes. Do not share it with anyone.</p>
                            <p>If you did not request this, please ignore this email.</p>
                            <div class="footer">
                            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

                            <p style="font-size: 12px; color: #666; text-align: center;">
                            Need help? Contact us at
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626; text-decoration: none;">
                                ${CONTACT_EMAIL}
                            </a>
                            </p>

                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                            <a href="${PRIVACY_POLICY_URL}" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
                            &nbsp;|&nbsp;
                            <a href="${TERMS_OF_USE_URL}" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
                            </p>
                            &copy; ${new Date().getFullYear()} QuickGamez. All rights reserved.
                            </div>
                        </div>
                        </body>
                        </html>
                        `;
        const text = `You have requested to reset your password, please use the following One-Time Password (OTP): ${otp}. This OTP is valid for the next 10 minutes. Do not share it with anyone.`;

        const info = await this._getTransporter().sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to,
            subject: "Reset Password OTP - QuickGamez.com",
            html,
            text
        });

        console.log("Message sent: ", info);
    }
    async sendPasswordChangedEmail(to: string): Promise<void> {
        const html = `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <meta charset="UTF-8">
                        <title>Password Changed</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <style>
                            body {
                            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                            background-color: #f4f4f7;
                            margin: 0;
                            padding: 0;
                            }
                            .container {
                            background-color: #fef9c3;
                            max-width: 600px;
                            margin: 40px auto;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            h1 {
                            color: #333333;
                            }
                            .footer {
                            font-size: 12px;
                            color: #888888;
                            text-align: center;
                            margin-top: 30px;
                            }
                            @media (max-width: 600px) {
                            .container {
                                padding: 20px;
                                margin: 20px;
                            }
                            }
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Password Changed - QuickGamez.com</h1>
                            <p>Your password has been changed successfully.</p>
                            <div class="footer">
                            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

                            <p style="font-size: 12px; color: #666; text-align: center;">
                            Need help? Contact us at
                            <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626; text-decoration: none;">
                                ${CONTACT_EMAIL}
                            </a>
                            </p>

                            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
                            <a href="${PRIVACY_POLICY_URL}" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
                            &nbsp;|&nbsp;
                            <a href="${TERMS_OF_USE_URL}" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
                            </p>
                            &copy; ${new Date().getFullYear()} QuickGamez. All rights reserved.
                            </div>
                        </div>
                        </body>
                        </html>
                        `;
        const text = `Your password has been changed successfully.`;

        const info = await this._getTransporter().sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to,
            subject: "Password Changed - QuickGamez.com",
            html,
            text
        });

        console.log("Message sent: ", info);
    }

    async sendContactUsMessageToEmail(
        name: string,
        email: string,
        subject: string,
        message: string
    ): Promise<void> {
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>Email Verification OTP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            margin: 0;
            padding: 0;
            }
            .container {
            background-color: #fef9c3;
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
            color: #333333;
            }
            .otp {
            font-size: 24px;
            font-weight: bold;
            color: #dc2626;
            letter-spacing: 4px;
            margin: 20px 0;
            }
            .footer {
            font-size: 12px;
            color: #888888;
            text-align: center;
            margin-top: 30px;
            }
            .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #4a90e2;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            }
            @media (max-width: 600px) {
            .container {
                padding: 20px;
                margin: 20px;
            }
            }
        </style>
        </head>
        <body>
        <div class="container">
            <h1>Contact Us - QuickGamez.com</h1>
            <p>From: </p>
            <p>Name: ${name}</p>
            <p>Email: ${email}</p>
            <p>Subject: ${subject}</p>
            <p>Message:</p>
            <p>${message}</p>
            <div class="footer">
            <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;" />

            <p style="font-size: 12px; color: #666; text-align: center;">
            Need help? Contact us at
            <a href="mailto:${CONTACT_EMAIL}" style="color: #dc2626; text-decoration: none;">
                ${CONTACT_EMAIL}
            </a>
            </p>

            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 10px;">
            <a href="${PRIVACY_POLICY_URL}" style="color: #dc2626; text-decoration: none;">Privacy Policy</a>
            &nbsp;|&nbsp;
            <a href="${TERMS_OF_USE_URL}" style="color: #dc2626; text-decoration: none;">Terms of Use</a>
            </p>
            &copy; ${new Date().getFullYear()} QuickGamez. All rights reserved.
            </div>
        </div>
        </body>
        </html>
        `;

        const recipients = [CONTACT_EMAIL];
        if (process.env.PERSONAL_EMAIL) {
            recipients.push(process.env.PERSONAL_EMAIL);
        }

        const info = await this._getTransporter().sendMail({
            from: `"QuickGamez" <hello@quickgamez.com>`,
            to: recipients,
            subject: "Contact Us - QuickGamez.com",
            html
        });

        console.log("Email status: ", info);
    }
}

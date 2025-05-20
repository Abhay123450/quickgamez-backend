export interface EmailService {
    sendEmail(
        to: string,
        subject: string,
        html: string,
        text: string
    ): Promise<void>;
    sendWelcomeEmail(to: string, name: string): Promise<void>;
    sendResetPasswordOtpEmail(to: string, otp: number): Promise<void>;
    sendVerificationOTPEmail(to: string, otp: number): Promise<void>;
    sendRegistrationOtpEmail(
        to: string,
        name: string,
        otp: number
    ): Promise<void>;
    sendPasswordChangedEmail(to: string): Promise<void>;
    sendContactUsMessageToEmail(
        name: string,
        email: string,
        subject: string,
        message: string
    ): void;
}

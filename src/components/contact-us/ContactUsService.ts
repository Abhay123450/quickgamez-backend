export interface ContactUsService {
    sendMessageToEmail(
        name: string,
        email: string,
        subject: string,
        message: string
    ): Promise<boolean>;
}

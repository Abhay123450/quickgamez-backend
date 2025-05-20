import { EmailService } from "../email/EmailService.js";
import { ContactUsService } from "./ContactUsService.js";

export class ContactUsServiceImpl implements ContactUsService {
    private _emailService: EmailService;
    constructor(emailService: EmailService) {
        this._emailService = emailService;
    }
    async sendMessageToEmail(
        name: string,
        email: string,
        subject: string,
        message: string
    ): Promise<boolean> {
        this._emailService.sendContactUsMessageToEmail(
            name,
            email,
            subject,
            message
        );
        return true;
    }
}

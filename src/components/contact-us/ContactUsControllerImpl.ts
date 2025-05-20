import { Request, Response, NextFunction } from "express";
import { ContactUsController } from "./ContactUsController.js";
import { matchedData, validationResult } from "express-validator";
import { ValidationError } from "../../utils/AppErrors.js";
import { ContactUsService } from "./ContactUsService.js";
import { sendResponseSuccess } from "../../utils/sendResponse.js";

export class ContactUsControllerImpl implements ContactUsController {
    private _contactUsService: ContactUsService;
    constructor(contactUsService: ContactUsService) {
        this._contactUsService = contactUsService;
    }
    async sendMessageToEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const errors = validationResult(req);
        const errorMessages = errors.array().map((error) => error.msg);
        if (!errors.isEmpty()) {
            throw new ValidationError(errorMessages);
        }

        const { name, email, subject, message } = matchedData(req);

        const isEmailSent = await this._contactUsService.sendMessageToEmail(
            name,
            email,
            subject,
            message
        );
        if (!isEmailSent) {
            throw new Error("Failed to send email. Please try again later");
        }
        return sendResponseSuccess(res, "Email sent successfully");
    }
}

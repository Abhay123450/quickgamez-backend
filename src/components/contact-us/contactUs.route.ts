import { Router } from "express";
import { catchAsycError } from "../../middlewares/catchAsyncError.js";
import { ContactUsControllerImpl } from "./ContactUsControllerImpl.js";
import { validateContactUsReq } from "./contactUs.validate.js";
import { EmailServiceImpl } from "../email/EmailServiceImpl.js";
import { ContactUsServiceImpl } from "./ContactUsServiceImpl.js";

const router = Router();

const emailService = new EmailServiceImpl();
const contactUsService = new ContactUsServiceImpl(emailService);
const contactUsController = new ContactUsControllerImpl(contactUsService);

router
    .route("/contact-us")
    .post(
        validateContactUsReq(),
        catchAsycError(
            contactUsController.sendMessageToEmail.bind(contactUsController)
        )
    );

export const contactUsRouter = router;

import { body } from "express-validator";

export function validateContactUsReq() {
    return [
        body("name")
            .exists()
            .withMessage("Name is required.")
            .isString()
            .trim()
            .escape()
            .isLength({ min: 1 })
            .withMessage("Name cannot be empty."),
        body("email")
            .exists()
            .withMessage("Email is required.")
            .isEmail()
            .withMessage("Email must be a valid email address."),
        body("subject")
            .exists()
            .withMessage("Subject is required.")
            .isString()
            .trim()
            .escape()
            .isLength({ min: 1 })
            .withMessage("Subject cannot be empty."),
        body("message")
            .exists()
            .withMessage("Message is required.")
            .isString()
            .trim()
            .escape()
            .isLength({ min: 1 })
            .withMessage("Message cannot be empty.")
    ];
}

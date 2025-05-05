import { body, oneOf, param, query } from "express-validator";

export const validateAddUserReq = () => [
    body("username")
        .optional()
        .trim()
        .isString()
        .withMessage("User name must be a string.")
        .isLength({ min: 1 })
        .withMessage("User name cannot be empty.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "User name can contain only letters, numbers and underscores(_)"
        ),
    body("email")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Email cannot be empty.")
        .isEmail()
        .withMessage("Email must be a valid email address."),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password cannot be empty.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),
    body("name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Name cannot be empty.")
];

export const validateGetUsersReq = () => [
    query("page")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1 })
        .withMessage("Page must be a integer greater than 0.")
        .toInt()
        .default(1),
    query("limit")
        .optional()
        .trim()
        .escape()
        .isInt({ min: 1 })
        .withMessage("Limit must be a integer greater than 0.")
        .toInt()
        .default(10),
    query("sort")
        .optional()
        .escape()
        .isInt({ min: 0, max: 3 })
        .withMessage("Sort must be a integer between 0 and 3.")
        .toInt()
        .default(1),
    query("filter")
        .optional()
        .trim()
        .escape()
        .isString()
        .withMessage("Filter must be a string.")
];

export const validateUpdateUserReq = () => [
    param("userId")
        .exists()
        .withMessage("User ID is required.")
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid User ID."),
    oneOf(
        [
            body("username")
                .trim()
                .isString()
                .withMessage("User name must be a string.")
                .isLength({ min: 1 })
                .withMessage("User name cannot be empty.")
                .matches(/^[a-zA-Z0-9_]+$/)
                .withMessage(
                    "User name can contain only letters, numbers and underscores(_)"
                ),
            body("name")
                .trim()
                .escape()
                .isLength({ min: 1 })
                .withMessage("Name cannot be empty."),
            body("avatar")
                .trim()
                .escape()
                .isLength({ min: 1 })
                .withMessage("Avatar cannot be empty.")
        ],
        {
            message: "username or name is required."
        }
    )
];

export const validateUsername = () => [
    query("username")
        .isLength({ min: 1 })
        .withMessage("User name cannot be empty.")
        .trim()
        .escape()
        .isLength({ max: 20 })
        .withMessage("User name cannot be longer than 20 characters.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            "User name can contain only letters, numbers, and underscores(_) with no spaces."
        )
];

export const validateEmail = () => [
    body("email")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Email cannot be empty.")
        .isEmail()
        .withMessage("Email must be a valid email address.")
];

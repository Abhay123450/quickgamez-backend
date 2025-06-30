import { body, query } from "express-validator";

export const validateGetFriendRequestsReq = () => [
    query("page")
        .exists()
        .withMessage("page is required.")
        .isNumeric()
        .withMessage("page must be a number.")
        .custom((page) => page > 0)
        .withMessage("page must be a number greater than 0."),
    query("limit")
        .exists()
        .withMessage("limit is required.")
        .isNumeric()
        .withMessage("limit must be a number.")
        .custom((limit) => limit > 0 && limit <= 100)
        .withMessage("limit must be from 1 to 100.")
];

export const validateSendFriendRequestReq = () => [
    body("recieverUserId")
        .exists()
        .withMessage("recieverUserId is required.")
        .trim()
        .escape()
        .isMongoId()
        .withMessage("Invalid recieverUserId.")
];

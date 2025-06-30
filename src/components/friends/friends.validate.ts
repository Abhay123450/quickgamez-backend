import { body, query } from "express-validator";

export const validateGetFriendsReq = () => [query("userId").isMongoId()];

export const validateSendFriendRequestReq = () => [
    body("recieverUserId")
        .exists()
        .withMessage("recieverUserId is required.")
        .trim()
        .escape()
        .isMongoId()
        .withMessage("Invalid recieverUserId.")
];

import { body, param, query } from "express-validator";
import { friendsSort } from "./Friends.js";

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

export const validateAcceptFriendRequestReq = () => [
    param("requestId")
        .exists()
        .withMessage("requestId is required.")
        .trim()
        .escape()
        .isMongoId()
        .withMessage("Invalid requestId.")
];

export const validateGetFriendsReq = () => [
    query("page")
        .exists()
        .withMessage("page is required.")
        .isNumeric()
        .withMessage("page must be a number.")
        .custom((page) => page > 0)
        .withMessage("page must be a number greater than 0.")
        .toInt(),
    query("limit")
        .exists()
        .withMessage("limit is required.")
        .isNumeric()
        .withMessage("limit must be a number.")
        .custom((limit) => limit > 0 && limit <= 100)
        .withMessage("limit must be from 1 to 100.")
        .toInt(),
    query("sort")
        .exists()
        .withMessage("sort is required.")
        .isString()
        .withMessage("sort must be a string.")
        .custom((sort) => {
            return Object.values(friendsSort).includes(sort);
        })
        .withMessage(`sort must be one of ${Object.values(friendsSort)}`)
];

export const validateBlockUserReq = () => [
    param("blockedUserId")
        .exists()
        .withMessage("blockedUserId is required.")
        .trim()
        .escape()
        .isMongoId()
        .withMessage("Invalid blockedUserId.")
];

export const validateRemoveFriendReq = () => [
    param("friendUserId")
        .exists()
        .withMessage("friendUserId is required.")
        .trim()
        .escape()
        .isMongoId()
        .withMessage("Invalid friendUserId.")
];

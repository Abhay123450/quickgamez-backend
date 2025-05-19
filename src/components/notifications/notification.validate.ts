import { query } from "express-validator";

export const validateGetNotificationsReq = () => [
    query("page")
        .isNumeric()
        .withMessage("'page' is required")
        .custom((page) => page > 0)
        .withMessage("'page' must be a number greater than 0")
        .customSanitizer((page) => Number(page)),
    query("limit")
        .isNumeric()
        .withMessage("'limit' is required")
        .custom((limit) => limit > 0 && limit <= 100)
        .withMessage("'limit' must be from 1 to 100")
        .customSanitizer((limit) => Number(limit))
];

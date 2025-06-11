import { query } from "express-validator";

export const validateGetLeaderboardReq = () => [
    query("time")
        .isString()
        .withMessage("'time' is required")
        .custom((time) => ["daily", "weekly", "all-time"].includes(time))
        .withMessage("'time' must be 'daily', 'weekly' or 'all-time'"),
    query("count")
        .isNumeric()
        .withMessage("'count' is required")
        .custom((count) => count > 0 && count <= 100)
        .withMessage("'count' must be from 1 to 100")
        .customSanitizer((count) => Number(count))
];

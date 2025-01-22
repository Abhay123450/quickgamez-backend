import { query } from "express-validator";

export const validateGetCommentsReq = () => [
    query("game")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage('"game" is missing')
        .isString()
        .withMessage('"game" must be a string')
        .custom((game) => {
            const games = ["guess-the-movie"];
            if (!games.includes(game)) {
                throw new Error(
                    `"game" must be one of the following: ${games}`
                );
            }
            return true;
        }),
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
        .default(1)
];

import { body } from "express-validator";
import { Difficulty } from "../../../constants/Difficulty.js";
import { isValidDateString } from "../../../utils/dateUtil.js";

export const validateAddGtmResult = () => [
    body("movieId")
        .exists()
        .withMessage("'movieId' is required.")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid 'movieId'"),
    body("difficulty")
        .exists()
        .isString()
        .withMessage("'difficulty' is required.")
        .trim()
        .escape()
        .custom((difficulty: string) => difficulty in Difficulty)
        .withMessage("difficulty must be 'easy', 'medium' or 'hard'."),
    body("industry")
        .exists()
        .withMessage("'industry' is required.")
        .isString()
        .trim()
        .escape()
        .custom((industry) =>
            ["hollywood", "bollywood"].includes(industry.toLowerCase())
        )
        .withMessage("industry must be 'hollywood' or 'bollywood'."),
    body("movieNameUnguessed")
        .exists()

        .withMessage("'movieNameUnguessed' is required.")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("'movieNameUnguessed' is required."),
    body("startedAt")
        .exists()
        .withMessage("startedAt is required.")
        .isNumeric()
        // if startedAt is in the last 24 hours
        // and not in the future
        .custom(
            (startedAt) =>
                startedAt > Date.now() - 24 * 60 * 60 * 1000 &&
                startedAt < Date.now()
        )
        .withMessage("startedAt must be a valid date."),
    body("endedAt")
        .exists()
        .withMessage("endedAt is required.")
        .isNumeric()
        // if endedAt is in the last 24 hours
        // and not in the future
        .custom(
            (endedAt) =>
                endedAt > Date.now() - 24 * 60 * 60 * 1000 &&
                endedAt < Date.now()
        )
        .withMessage("endedAt must be a valid date."),
    body("livesUsed")
        .exists()
        .withMessage("livesUsed is required.")
        .isNumeric()
        .custom((livesUsed) => !(livesUsed < 0 || livesUsed > 5))
        .withMessage("livesUsed must be a number greater -1 and less than 6."),
    body("isTimerOn")
        .exists()
        .isBoolean()
        .withMessage("'isTimerOn' is required and must be a boolean")
        .customSanitizer((istiemrOn) => Boolean(istiemrOn)),
    body("timeGiven")
        .exists()
        .withMessage("timeGiven is required (in seconds).")
        .isNumeric()
        .custom((timeGiven) => timeGiven > 0)
        .withMessage("timeGiven must be a number greater than 0."),
    body("timeLeft")
        .exists()
        .withMessage("timeLeft is required.")
        .isNumeric()
        .custom((timeLeft) => timeLeft >= 0)
        .withMessage("timeLeft must be a number greater than or equal to 0."),
    body("result")
        .exists()
        .isString()
        .withMessage("'result' is required.")
        .trim()
        .escape()
        .custom((result) => ["win", "lose"].includes(result.toLowerCase()))
        .withMessage("result must be 'win' or 'lose'."),
    body("guesses")
        .exists()
        .withMessage("'guesses' is required.")
        .isArray()
        .custom((guesses) => guesses.length > 0)
        .withMessage("guesses must have at least one element."),
    body("guesses.*.character")
        .exists()
        .isString()
        .withMessage("guesses.character is required.")
        .trim()
        .escape()
        .isLength({ min: 1, max: 1 })
        .withMessage("guesses.character must be a single character."),
    body("guesses.*.isCorrect")
        .exists()
        .isBoolean()
        .withMessage("guesses.isCorrect is required."),
    body("guesses.*.guessedAt")
        .exists()
        .withMessage("guesses.guessedAt is required.")
        .custom((guessedAt) => isValidDateString(guessedAt))
        .withMessage("guesses.guessedAt must be a valid date.")
];

export const validateAddMultipleGtmResults = () => [
    body().isArray().withMessage("body must be an array."),
    body("*.movieId")
        .exists()
        .withMessage("'movieId' is required.")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid 'movieId'"),
    body("*.difficulty")
        .exists()
        .isString()
        .withMessage("'difficulty' is required.")
        .trim()
        .escape()
        .custom((difficulty: string) => difficulty in Difficulty)
        .withMessage("difficulty must be 'easy', 'medium' or 'hard'."),
    body("*.industry")
        .exists()
        .withMessage("'industry' is required.")
        .isString()
        .trim()
        .escape()
        .custom((industry) =>
            ["hollywood", "bollywood"].includes(industry.toLowerCase())
        )
        .withMessage("industry must be 'hollywood' or 'bollywood'."),
    body("*.movieNameUnguessed")
        .exists()

        .withMessage("'movieNameUnguessed' is required.")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("'movieNameUnguessed' is required."),
    body("*.startedAt")
        .exists()
        .withMessage("startedAt is required.")
        .isNumeric()
        // if startedAt is in the last 24 hours
        // and not in the future
        .custom((startedAt) => startedAt < Date.now())
        .withMessage("startedAt must be a valid date."),
    body("*.endedAt")
        .exists()
        .withMessage("endedAt is required.")
        .isNumeric()
        // if endedAt is in the last 24 hours
        // and not in the future
        .custom((endedAt) => endedAt < Date.now())
        .withMessage("endedAt must be a valid date."),
    body("*.livesUsed")
        .exists()
        .withMessage("livesUsed is required.")
        .isNumeric()
        .custom((livesUsed) => !(livesUsed < 0 || livesUsed > 5))
        .withMessage("livesUsed must be a number greater -1 and less than 6."),
    body("*.isTimerOn")
        .exists()
        .isBoolean()
        .withMessage("'isTimerOn' is required and must be a boolean")
        .customSanitizer((istiemrOn) => Boolean(istiemrOn)),
    body("*.timeGiven")
        .exists()
        .withMessage("timeGiven is required (in seconds).")
        .isNumeric()
        .custom((timeGiven) => timeGiven > 0)
        .withMessage("timeGiven must be a number greater than 0."),
    body("*.timeLeft")
        .exists()
        .withMessage("timeLeft is required.")
        .isNumeric()
        .custom((timeLeft) => timeLeft >= 0)
        .withMessage("timeLeft must be a number greater than or equal to 0."),
    body("*.result")
        .exists()
        .isString()
        .withMessage("'result' is required.")
        .trim()
        .escape()
        .custom((result) => ["win", "lose"].includes(result.toLowerCase()))
        .withMessage("result must be 'win' or 'lose'."),
    body("*.guesses")
        .exists()
        .withMessage("'guesses' is required.")
        .isArray()
        .custom((guesses) => guesses.length > 0)
        .withMessage("guesses must have at least one element."),
    body("*.guesses.*.character")
        .exists()
        .isString()
        .withMessage("guesses.character is required.")
        .trim()
        .escape()
        .isLength({ min: 1, max: 1 })
        .withMessage("guesses.character must be a single character."),
    body("*.guesses.*.isCorrect")
        .exists()
        .isBoolean()
        .withMessage("guesses.isCorrect is required."),
    body("*.guesses.*.guessedAt")
        .exists()
        .withMessage("guesses.guessedAt is required.")
        .custom((guessedAt) => isValidDateString(guessedAt))
        .withMessage("guesses.guessedAt must be a valid Date.")
];

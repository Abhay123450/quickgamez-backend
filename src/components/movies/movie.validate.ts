import { body, CustomValidator, query } from "express-validator";
import { isValidDate } from "../../utils/dateUtil.js";

export const validateGetRandomMovieReq = () => [
    query("industry")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("industry name cannot be empty.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("industry name must be a string.")
];

export const validateGetMoviesReq = () => [
    query("industry")
        .optional()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("industry name cannot be empty.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("industry name must be a string."),
    query("page")
        .isNumeric()
        .withMessage("page is required.")
        .custom((page) => page > 0)
        .withMessage("page must be a number greater than 0.")
        .customSanitizer((value) => parseInt(value, 10)),
    query("limit")
        .optional()
        .isNumeric()
        .custom((limit) => limit > 0)
        .withMessage("limit must be a number greater than 0.")
        .customSanitizer((value) => parseInt(value, 10)),
    query("sort")
        .optional()
        .isNumeric()
        .custom((sort) => sort > 0)
        .withMessage("sort must be a number greater than 0.")
        .customSanitizer((value) => parseInt(value, 10))
];

export const validateAddMovieReq = () => [
    body("name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Movie name cannot be empty.")
        .matches(/^[a-zA-Z0-9\-_/: ]+$/)
        .withMessage("Movie name must be alphanumeric."),

    body("industry")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Industry cannot be empty.")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Industry name can only contain letters."),

    body("releaseDate")
        .trim()
        .escape()
        .custom(isValidDate as CustomValidator)
        .withMessage("Invalid date format. Date must be in dd-mm-yyyy format.")
        .customSanitizer((date) => {
            const parts = date.split("-");

            // Extract the day, month, and year from the parts
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Adjust month to zero-based index
            const year = parseInt(parts[2], 10);

            // Create and return the date object
            return new Date(Date.UTC(year, month, day));
        }),

    body("actors")
        .isArray()
        .withMessage("Actors must be an array")
        .custom((actors: string[]) =>
            actors.every(
                (actor) => typeof actor === "string" && actor.trim().length > 2
            )
        )
        .withMessage(
            "Each actor's name must be a string and longer than 2 characters."
        ),

    body("director")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Director name is required.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("Director name can only contain letters."),

    body("genre")
        .isArray()
        .withMessage("Genre must be an array")
        .custom((genres: string[]) =>
            genres.every(
                (genre) => typeof genre === "string" && genre.trim().length > 2
            )
        )
        .withMessage(
            "Each genre must be a string and longer than 2 characters."
        ),

    body("productionHouse")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Production house cannot be empty.")
        .matches(/^[a-zA-Z0-9_ ]+$/)
        .withMessage("Production house name can be alphanumeric only."),

    body("boxOfficeStatus")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Box office status cannot be empty.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("Box office status can only contain letters."),

    body("hints")
        .optional()
        .isArray()
        .withMessage("Hints must be an array")
        .custom((hints: string[]) =>
            hints.every(
                (hint) => typeof hint === "string" && hint.trim().length > 2
            )
        )
        .withMessage("Each hint must be a string and longer than 2 characters.")
];

export const validateAddMoviesReq = () => [
    body("movies.*.name")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Movie name cannot be empty."),

    body("movies.*.industry")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Industry cannot be empty.")
        .matches(/^[a-zA-Z]+$/)
        .withMessage("Industry name can only contain letters."),

    body("movies.*.releaseDate")
        .trim()
        .escape()
        .custom(isValidDate as CustomValidator)
        .withMessage("Invalid date format. Date must be in dd-mm-yyyy format.")
        .customSanitizer((date) => {
            const parts = date.split("-");

            // Extract the day, month, and year from the parts
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Adjust month to zero-based index
            const year = parseInt(parts[2], 10);

            // Create and return the date object
            return new Date(Date.UTC(year, month, day));
        }),

    body("movies.*.actors")
        .isArray()
        .withMessage("Actors must be an array")
        .custom((actors: string[]) =>
            actors.every(
                (actor) => typeof actor === "string" && actor.trim().length > 2
            )
        )
        .withMessage(
            "Each actor's name must be a string and longer than 2 characters."
        ),

    body("movies.*.director")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Director name is required.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("Director name can only contain letters."),

    body("movies.*.genre")
        .isArray()
        .withMessage("Genre must be an array")
        .custom((genres: string[]) =>
            genres.every(
                (genre) => typeof genre === "string" && genre.trim().length > 2
            )
        )
        .withMessage(
            "Each genre must be a string and longer than 2 characters."
        ),

    body("movies.*.productionHouse")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Production house cannot be empty.")
        .matches(/^[a-zA-Z0-9_ ]+$/)
        .withMessage("Production house name can be alphanumeric only."),

    body("movies.*.boxOfficeStatus")
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("Box office status cannot be empty.")
        .matches(/^[a-zA-Z ]+$/)
        .withMessage("Box office status can only contain letters."),

    body("movies.*.hints")
        .optional()
        .isArray()
        .withMessage("Hints must be an array")
        .custom((hints: string[]) =>
            hints.every(
                (hint) => typeof hint === "string" && hint.trim().length > 2
            )
        )
        .withMessage("Each hint must be a string and longer than 2 characters.")
];

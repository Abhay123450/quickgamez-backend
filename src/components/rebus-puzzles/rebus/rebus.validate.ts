import { body, param, query } from "express-validator";
import { Difficulty } from "../../../constants/Difficulty.js";
import { set } from "mongoose";

export const validateAddRebusReq = () => [
    body("rebusImage").custom(async (value, { req }) => {
        if (!req.file) {
            throw new Error("rebusImage is required");
        }
        const allowedFileTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
            "image/svg+xml"
        ];
        if (!allowedFileTypes.includes(req.file.mimetype)) {
            throw new Error(
                "Invalid file type. Only JPEG, PNG, JPG, WEBP and SVG files are allowed."
            );
        }
        return true;
    }),
    body("answer").isString().withMessage("answer is required"),
    body("difficulty")
        .exists()
        .withMessage("difficulty is required")
        .isString()
        .withMessage("difficulty must be a string.")
        .trim()
        .escape()
        .custom((difficulty: string) => difficulty in Difficulty)
        .withMessage("difficulty must be 'easy', 'medium' or 'hard'."),
    body("explanation")
        .exists()
        .withMessage("explanation is required")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("explanation cannot be empty.")
];

export const validateGetRandomRebusReq = () => [
    query("difficulty")
        .isString()
        .trim()
        .escape()
        .isLength({ min: 1 })
        .withMessage("difficulty is required.")
        .custom((difficulty: string) => difficulty in Difficulty)
        .withMessage("difficulty must be 'easy', 'medium' or 'hard'."),
    query("count")
        .isNumeric()
        .withMessage("count is required.")
        .custom((count) => count > 0)
        .withMessage("count must be a number greater than 0.")
        .customSanitizer((value) => parseInt(value, 10))
];

export const validateRebusIdParam = () => [
    param("id")
        .exists()
        .withMessage("rebusId is required.")
        .isLength({ min: 24, max: 24 })
        .withMessage("Invalid rebusId.")
];

export const validateGetUnplayedRebusesReq = () => [
    query("difficulty")
        .isString()
        .withMessage("Difficulty is required.")
        .trim()
        .escape()
        .custom((difficulty: string) => difficulty in Difficulty)
        .withMessage("difficulty must be 'easy', 'medium' or 'hard'."),
    query("count")
        .isNumeric()
        .withMessage("count is required.")
        .custom((count) => count > 0)
        .withMessage("count must be a number greater than 0.")
        .customSanitizer((value) => parseInt(value, 10))
];

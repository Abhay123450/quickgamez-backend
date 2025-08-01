import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import { ValidationError } from "../../../utils/AppErrors.js";
import { ConsoleLog } from "../../../utils/ConsoleLog.js";

let allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/svg+xml"
];

function fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) {
    ConsoleLog.info(`file: ${JSON.stringify(file)}`);
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ValidationError([
                "Invalid file type: Only JPEG, PNG, JPG, WEBP and SVG files are allowed."
            ])
        );
    }
}

/**
 *
 * @param fieldName
 * @param allowedMimeTypes - deafults to image (jpeg, png, jpg, webp, svg)
 * @returns
 */
export function handleFile(fieldName: string, allowedMimeTypes?: string[]) {
    if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        allowedTypes = allowedMimeTypes;
    }
    return multer({
        storage: multer.memoryStorage(),
        fileFilter: fileFilter
    }).single(fieldName);
}

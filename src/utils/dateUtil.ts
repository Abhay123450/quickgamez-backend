import { CustomValidator } from "express-validator";

/**
 * Validates if a given date string is in the format dd-mm-yyyy and represents an actual calendar date.
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} True if valid, otherwise throws an error.
 */
export const isValidDateDDMMYYYY: CustomValidator = (
    dateString: string
): boolean => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const parts = dateString.match(regex);

    if (!parts) {
        throw new Error("Date must be in dd-mm-yyyy format");
    }

    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed in JavaScript Date
    const year = parseInt(parts[3], 10);

    if (year < 1000 || year > 3000 || month < 0 || month > 11) {
        throw new Error("Date is out of valid range");
    }

    const date = new Date(year, month, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        throw new Error("Invalid date");
    }

    return true;
};

export function isValidDateString(value: any): boolean {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

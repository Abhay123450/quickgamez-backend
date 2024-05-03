import { Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode.enum";

type ResponseObject = { [key: string]: ResponseObject | any };
type ResponseArray = Array<any>;
type ResponseData = ResponseObject | ResponseArray;

const defaultMessageSuccess = "SUCCESS";
const defaultMessageClientError = "CLIENT ERROR";
const defaultMessageServerError = "SERVER ERROR";

// Success Response
export function sendResponseSuccess(res: Response): void;
export function sendResponseSuccess(
    res: Response,
    statusCode: HttpStatusCode
): void;
export function sendResponseSuccess(res: Response, message: string): void;
export function sendResponseSuccess(res: Response, data: ResponseData): void;
export function sendResponseSuccess(
    res: Response,
    statusCode: number,
    message: string
): void;
export function sendResponseSuccess(
    res: Response,
    statusCode: number,
    data: ResponseData
): void;
export function sendResponseSuccess(
    res: Response,
    message: string,
    data: ResponseData
): void;
export function sendResponseSuccess(
    res: Response,
    statusCode: number,
    message: string,
    data: ResponseData
): void;
export function sendResponseSuccess(res: Response, ...rest: any[]) {
    if (rest.length === 0) {
        return res
            .status(200)
            .json({ success: true, message: defaultMessageSuccess, data: {} });
    } else if (rest.length === 1) {
        if (typeof rest[0] === "number") {
            //statusCode
            return res.status(rest[0]).json({
                success: true,
                message: defaultMessageSuccess,
                data: {}
            });
        } else if (typeof rest[0] === "string") {
            // message
            return res
                .status(200)
                .json({ success: true, message: rest[0], data: {} });
        } else {
            // ResponseData
            return res.status(200).json({
                success: true,
                message: defaultMessageSuccess,
                data: rest[0]
            });
        }
    } else if (rest.length === 2) {
        if (typeof rest[0] === "number" && typeof rest[1] === "string") {
            // status code, message
            return res
                .status(rest[0])
                .json({ success: true, message: rest[1], data: {} });
        } else if (typeof rest[0] === "string") {
            // message, data
            return res
                .status(200)
                .json({ success: true, message: rest[0], data: rest[1] });
        } else if (typeof rest[0] === "number") {
            // statusCode, data
            return res.status(rest[0]).json({
                success: true,
                message: defaultMessageSuccess,
                data: rest[1]
            });
        }
    } else if (rest.length === 3) {
        // statusCode, message, data
        return res
            .status(rest[0])
            .json({ success: true, message: rest[1], data: rest[2] });
    }
}

// Client Error Response
export function sendResponseClientError(res: Response): void;
export function sendResponseClientError(
    res: Response,
    statusCode: HttpStatusCode
): void;
export function sendResponseClientError(res: Response, message: string): void;
export function sendResponseClientError(
    res: Response,
    statusCode: HttpStatusCode,
    message: string
): void;
export function sendResponseClientError(res: Response, ...rest: any[]) {
    if (rest.length === 0) {
        return res
            .status(HttpStatusCode.BAD_REQUEST)
            .json({ success: false, message: defaultMessageClientError });
    } else if (rest.length === 1) {
        if (typeof rest[0] === "number") {
            //statusCode
            return res
                .status(rest[0])
                .json({ success: true, message: defaultMessageClientError });
        } else if (typeof rest[0] === "string") {
            // message
            return res
                .status(HttpStatusCode.BAD_REQUEST)
                .json({ success: true, message: rest[0] });
        }
    } else if (rest.length === 2) {
        return res.status(rest[0]).json({ success: false, message: rest[1] });
    }
}

// Server Error Response
export function sendResponseServerError(res: Response): void;
export function sendResponseServerError(
    res: Response,
    statusCode: HttpStatusCode
): void;
export function sendResponseServerError(res: Response, message: string): void;
export function sendResponseServerError(
    res: Response,
    statusCode: HttpStatusCode,
    message: string
): void;
export function sendResponseServerError(res: Response, ...rest: any[]) {
    if (rest.length === 0) {
        return res
            .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: defaultMessageServerError });
    } else if (rest.length === 1) {
        if (typeof rest[0] === "number") {
            //statusCode
            return res
                .status(rest[0])
                .json({ success: true, message: defaultMessageServerError });
        } else if (typeof rest[0] === "string") {
            // message
            return res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ success: true, message: rest[0] });
        }
    } else if (rest.length === 2) {
        return res.status(rest[0]).json({ success: false, message: rest[1] });
    }
}

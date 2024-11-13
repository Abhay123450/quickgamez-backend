import { ErrorCode } from "../constants/ErrorCode.enum.js";
import { HttpStatusCode } from "../constants/httpStatusCode.enum.js";

export class ClientError extends Error {
    // Declare properties with types
    statusCode: number;

    /**
     * Constructs the ErrorHandler instance.
     * @param message The error message.
     * @param statusCode The HTTP status code, defaulting to 400.
     */
    constructor(message: string, statusCode: number = 400) {
        super(message); // Pass the message to the Error base class
        this.statusCode = statusCode;

        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ServerError extends Error {
    // Declare properties with types
    statusCode: number;

    /**
     * Constructs the ErrorHandler instance.
     * @param message The error message.
     * @param statusCode The HTTP status code, defaulting to 500.
     */
    constructor(message: string, statusCode: number = 500) {
        super(message); // Pass the message to the Error base class
        this.statusCode = statusCode;

        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthenticationError extends Error {
    statusCode: number;
    errorCode: ErrorCode;
    constructor(message: string, errorCode = ErrorCode.TOKEN_EXPIRED) {
        super(message); // Pass the message to the Error base class
        this.statusCode = HttpStatusCode.UNAUTHORIZED;
        this.errorCode = errorCode;
        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthorizationError extends Error {
    statusCode: number;
    errorCode: ErrorCode;
    constructor(message: string, errorCode = ErrorCode.FORBIDDEN) {
        super(message); // Pass the message to the Error base class
        this.statusCode = HttpStatusCode.FORBIDDEN;
        this.errorCode = errorCode;

        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends Error {
    statusCode: number;
    errorCode: ErrorCode;
    errors: string[];
    constructor(errors: string[]) {
        const statusCode = HttpStatusCode.BAD_REQUEST;
        const message = "Validation error";

        super(message); // Pass the message to the Error base class
        this.statusCode = statusCode;
        this.errorCode = ErrorCode.VALIDATION_ERROR;
        this.errors = errors;
        // Captures the stack trace, excluding the constructor call from it.
        Error.captureStackTrace(this, this.constructor);
    }
}

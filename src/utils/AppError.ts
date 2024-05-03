export class AppError extends Error {
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

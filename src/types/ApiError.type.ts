export class ApiError extends Error {
    result: boolean;
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.result = false;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }
}

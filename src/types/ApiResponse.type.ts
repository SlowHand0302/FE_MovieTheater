export interface ApiResponse<T> {
    result: boolean;
    message: string;
    statusCode: 0;
    data: T[] | T;
}

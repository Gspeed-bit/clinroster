export enum StatusCodes {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  UNAUTHORIZED = 403,
  NOT_FOUND = 404,
  INVALID_INPUT = 406,
  INTERNAL_SERVER_ERROR = 500,
}
export type StatusCodesType = 200 | 400 | 401 | 403 | 404 | 406 | 500;

export class ApiError {
  statusCode: StatusCodesType;
  message: string;
  data?: unknown;
  constructor(statusCode: StatusCodesType, message: string, data?: unknown) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

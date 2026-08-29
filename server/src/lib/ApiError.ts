export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "ACCOUNT_LOCKED"
  | "INTERNAL";

/** Errors we intentionally surface to the client, in the shape the spec defines. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: ErrorCode,
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }

  static badRequest(msg: string, fields?: Record<string, string>) {
    return new ApiError(400, "VALIDATION_ERROR", msg, fields);
  }
  static unauthorized(msg = "Authentication required") {
    return new ApiError(401, "UNAUTHORIZED", msg);
  }
  static forbidden(msg = "You do not have permission to perform this action") {
    return new ApiError(403, "FORBIDDEN", msg);
  }
  static notFound(msg = "Resource not found") {
    return new ApiError(404, "NOT_FOUND", msg);
  }
  static conflict(msg: string) {
    return new ApiError(409, "CONFLICT", msg);
  }
  static locked(msg: string) {
    return new ApiError(423, "ACCOUNT_LOCKED", msg);
  }
}

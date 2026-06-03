interface Problem {
  title: string;
  statusCode: number;
  detail?: string;
  errors?: { title: string; description: string }[];
  success?: boolean;
}

interface BadRequestError extends Problem {
  errorType: "BadRequest";
} //400 error

interface UnauthorizedError extends Problem {
  errorType: "Unauthorized";
} //403 error

interface ValidationError extends Problem {
  errorType: "ValidationError";
  fieldErrors?: Record<string, string>;
} //422 error

interface NotFoundError extends Problem {
  errorType: "NotFound";
} //404 error

interface UnhandledExeception extends Problem {
  errorType: "UnhandledException";
} //500 error

interface NetworkError extends Problem {
  errorType: "NetworkError";
} //Network error

export type {
  Problem,
  BadRequestError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  UnhandledExeception,
  NetworkError,
};

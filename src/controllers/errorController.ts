import { AxiosError } from "axios";

export default class ErrorController {
  handleError(params: { error: unknown }) {
    const { error } = params;

    if (error instanceof AxiosError) {
      if (error.response) {
        const status = error.response.status;
        const errorDetail =
          error.response.data?.error || "No se especifica el error";
        throw new CustomError("Server Error", status, errorDetail, error);
      } else if (error.request) {
        throw new CustomError(
          "No response received from server",
          undefined,
          undefined,
          error,
        );
      } else {
        throw new CustomError(
          `Axios Error: ${error.message}`,
          undefined,
          undefined,
          error,
        );
      }
    } else if (error instanceof Error) {
      throw new CustomError(
        `General Error: ${error.message}`,
        undefined,
        undefined,
        error,
      );
    } else {
      throw new CustomError("An unknown error occurred", undefined, undefined);
    }
  }
}

class CustomError extends Error {
  public status?: number;
  public errorDetail?: string;

  constructor(
    message: string,
    status?: number,
    errorDetail?: string,
    cause?: Error,
  ) {
    super(message);
    this.status = status;
    this.errorDetail = errorDetail;
    if (cause) {
      this.cause = cause;
    }
  }
}

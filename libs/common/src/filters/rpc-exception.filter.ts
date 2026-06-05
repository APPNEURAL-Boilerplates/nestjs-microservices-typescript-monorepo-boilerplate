import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable, throwError } from "rxjs";

interface RpcErrorPayload {
  statusCode: number;
  code: string;
  message: string | string[];
}

@Catch()
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: unknown): Observable<never> {
    return throwError(() => toRpcErrorPayload(exception));
  }
}

function toRpcErrorPayload(exception: unknown): RpcErrorPayload {
  if (exception instanceof RpcException) {
    const error = exception.getError();

    if (typeof error === "object" && error !== null) {
      const payload = error as Partial<RpcErrorPayload>;
      return {
        statusCode: payload.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
        code: payload.code ?? "RPC_ERROR",
        message: payload.message ?? "RPC request failed",
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: "RPC_ERROR",
      message: String(error),
    };
  }

  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    const statusCode = exception.getStatus();
    const message =
      typeof response === "object" && response !== null && "message" in response
        ? (response as { message: string | string[] }).message
        : exception.message;

    return {
      statusCode,
      code:
        statusCode === Number(HttpStatus.BAD_REQUEST)
          ? "VALIDATION_ERROR"
          : "HTTP_ERROR",
      message,
    };
  }

  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: "INTERNAL_ERROR",
    message:
      exception instanceof Error ? exception.message : "Internal server error",
  };
}

import { HttpException, HttpStatus } from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

interface RpcErrorPayload {
  statusCode?: number;
  message?: string | string[];
  code?: string;
}

export async function callRpc<TResponse, TPayload>(
  client: ClientProxy,
  pattern: string,
  payload: TPayload,
  timeoutMs: number,
): Promise<TResponse> {
  try {
    return await firstValueFrom(
      client
        .send<TResponse, TPayload>(pattern, payload)
        .pipe(timeout(timeoutMs)),
    );
  } catch (error) {
    throw toHttpException(error);
  }
}

export function toHttpException(error: unknown): HttpException {
  const payload = normalizeRpcError(error);
  const statusCode = payload.statusCode ?? HttpStatus.BAD_GATEWAY;

  return new HttpException(
    {
      ok: false,
      error: {
        statusCode,
        code: payload.code ?? "MICROSERVICE_ERROR",
        message: payload.message ?? "Microservice request failed",
      },
    },
    statusCode,
  );
}

function normalizeRpcError(error: unknown): RpcErrorPayload {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      response?: RpcErrorPayload;
    } & RpcErrorPayload;
    return maybeError.response ?? maybeError;
  }

  return {
    statusCode: HttpStatus.BAD_GATEWAY,
    message: "Microservice request failed",
  };
}

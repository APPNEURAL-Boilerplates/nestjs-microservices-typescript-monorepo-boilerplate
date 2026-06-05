import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { randomUUID } from "node:crypto";
import { firstValueFrom, timeout } from "rxjs";
import { getEnvNumber, USERS_SERVICE } from "@app/common";
import {
  CreateOrderDto,
  FindUserByIdDto,
  OrderDto,
  UserDto,
  USERS_PATTERNS,
} from "@app/contracts";

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, OrderDto>();
  private readonly timeoutMs = getEnvNumber("RPC_TIMEOUT_MS", 5000);

  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async create(dto: CreateOrderDto): Promise<OrderDto> {
    await this.assertUserExists(dto.userId);

    const order: OrderDto = {
      id: randomUUID(),
      userId: dto.userId,
      items: dto.items,
      status: "created",
      createdAt: new Date().toISOString(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  findOne(id: string): OrderDto {
    const order = this.orders.get(id);

    if (!order) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        code: "ORDER_NOT_FOUND",
        message: `Order ${id} not found`,
      });
    }

    return order;
  }

  private async assertUserExists(userId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.usersClient
          .send<
            UserDto,
            FindUserByIdDto
          >(USERS_PATTERNS.FIND_ONE, { id: userId })
          .pipe(timeout(this.timeoutMs)),
      );
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        throw new RpcException(error);
      }

      throw new RpcException({
        statusCode: HttpStatus.BAD_GATEWAY,
        code: "USERS_SERVICE_UNAVAILABLE",
        message: "Could not validate user before creating order",
      });
    }
  }
}

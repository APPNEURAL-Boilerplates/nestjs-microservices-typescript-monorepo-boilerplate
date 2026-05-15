import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callRpc, getEnvNumber, ORDERS_SERVICE } from '@app/common';
import {
  CreateOrderDto,
  FindOrderByIdDto,
  OrderDto,
  ORDERS_PATTERNS,
} from '@app/contracts';

@Controller('orders')
export class OrdersController {
  private readonly timeoutMs = getEnvNumber('RPC_TIMEOUT_MS', 5000);

  constructor(@Inject(ORDERS_SERVICE) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<OrderDto> {
    return callRpc<OrderDto, CreateOrderDto>(
      this.ordersClient,
      ORDERS_PATTERNS.CREATE,
      dto,
      this.timeoutMs,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderDto> {
    return callRpc<OrderDto, FindOrderByIdDto>(
      this.ordersClient,
      ORDERS_PATTERNS.FIND_ONE,
      { id },
      this.timeoutMs,
    );
  }
}

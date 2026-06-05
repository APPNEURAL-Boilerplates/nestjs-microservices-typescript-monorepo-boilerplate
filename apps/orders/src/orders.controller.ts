import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  CreateOrderDto,
  FindOrderByIdDto,
  OrderDto,
  ORDERS_PATTERNS,
} from "@app/contracts";
import { OrdersService } from "./orders.service";

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern(ORDERS_PATTERNS.HEALTH)
  health() {
    return {
      ok: true,
      service: "orders",
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(ORDERS_PATTERNS.CREATE)
  create(@Payload() dto: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.create(dto);
  }

  @MessagePattern(ORDERS_PATTERNS.FIND_ONE)
  findOne(@Payload() dto: FindOrderByIdDto): OrderDto {
    return this.ordersService.findOne(dto.id);
  }
}

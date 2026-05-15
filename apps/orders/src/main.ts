import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe, getEnvString, RpcExceptionFilter } from '@app/common';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrdersModule, {
    transport: Transport.NATS,
    options: {
      servers: [getEnvString('NATS_URL', 'nats://localhost:4222')],
      queue: getEnvString('ORDERS_QUEUE', 'orders-service'),
    },
  });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen();
  console.log('Orders microservice is listening over NATS');
}

void bootstrap();

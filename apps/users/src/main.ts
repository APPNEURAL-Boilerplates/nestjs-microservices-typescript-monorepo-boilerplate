import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { createValidationPipe, getEnvString, RpcExceptionFilter } from '@app/common';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.NATS,
    options: {
      servers: [getEnvString('NATS_URL', 'nats://localhost:4222')],
      queue: getEnvString('USERS_QUEUE', 'users-service'),
    },
  });

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());

  await app.listen();
  console.log('Users microservice is listening over NATS');
}

void bootstrap();

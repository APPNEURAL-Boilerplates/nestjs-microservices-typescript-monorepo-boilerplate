import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionFilter, createValidationPipe } from '@app/common';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`Gateway listening on http://localhost:${port}`);
}

void bootstrap();

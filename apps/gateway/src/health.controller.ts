import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get()
  root() {
    return {
      ok: true,
      service: "gateway",
      message: "NestJS microservices monorepo is running",
    };
  }

  @Get("health")
  health() {
    return {
      ok: true,
      service: "gateway",
      status: "healthy",
      timestamp: new Date().toISOString(),
    };
  }
}

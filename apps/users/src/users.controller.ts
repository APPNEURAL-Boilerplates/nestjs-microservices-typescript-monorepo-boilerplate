import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  FindUserByIdDto,
  UserDto,
  USERS_PATTERNS,
} from '@app/contracts';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USERS_PATTERNS.HEALTH)
  health() {
    return {
      ok: true,
      service: 'users',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(USERS_PATTERNS.CREATE)
  create(@Payload() dto: CreateUserDto): UserDto {
    return this.usersService.create(dto);
  }

  @MessagePattern(USERS_PATTERNS.FIND_ONE)
  findOne(@Payload() dto: FindUserByIdDto): UserDto {
    return this.usersService.findOne(dto.id);
  }
}

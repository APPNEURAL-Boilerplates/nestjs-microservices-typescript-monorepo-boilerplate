import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callRpc, getEnvNumber, USERS_SERVICE } from '@app/common';
import {
  CreateUserDto,
  FindUserByIdDto,
  UserDto,
  USERS_PATTERNS,
} from '@app/contracts';

@Controller('users')
export class UsersController {
  private readonly timeoutMs = getEnvNumber('RPC_TIMEOUT_MS', 5000);

  constructor(@Inject(USERS_SERVICE) private readonly usersClient: ClientProxy) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserDto> {
    return callRpc<UserDto, CreateUserDto>(
      this.usersClient,
      USERS_PATTERNS.CREATE,
      dto,
      this.timeoutMs,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {
    return callRpc<UserDto, FindUserByIdDto>(
      this.usersClient,
      USERS_PATTERNS.FIND_ONE,
      { id },
      this.timeoutMs,
    );
  }
}

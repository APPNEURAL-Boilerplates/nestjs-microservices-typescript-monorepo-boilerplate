import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { CreateUserDto, UserDto } from '@app/contracts';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, UserDto>();

  create(dto: CreateUserDto): UserDto {
    const duplicate = Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === dto.email.toLowerCase(),
    );

    if (duplicate) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        code: 'USER_EMAIL_EXISTS',
        message: 'A user with this email already exists',
      });
    }

    const user: UserDto = {
      id: randomUUID(),
      email: dto.email,
      name: dto.name,
      createdAt: new Date().toISOString(),
    };

    this.users.set(user.id, user);
    return user;
  }

  findOne(id: string): UserDto {
    const user = this.users.get(id);

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        code: 'USER_NOT_FOUND',
        message: `User ${id} not found`,
      });
    }

    return user;
  }
}

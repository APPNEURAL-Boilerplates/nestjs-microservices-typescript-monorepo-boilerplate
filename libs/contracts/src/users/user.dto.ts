import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;
}

export class FindUserByIdDto {
  @IsString()
  @IsNotEmpty()
  id!: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

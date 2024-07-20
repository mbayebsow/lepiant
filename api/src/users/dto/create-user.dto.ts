import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { User } from "./user.dto";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsString()
  email: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsBoolean, IsInt } from "class-validator";

export class User {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  // @ApiProperty()
  // @IsEmail()
  // email: string;

  // @ApiProperty()
  // @IsEnum(["ADMIN", "USER"])
  // role: "ADMIN" | "USER";

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  language: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  // @ApiProperty()
  // @IsBoolean()
  // isActive: boolean;

  @ApiProperty()
  @IsEnum(["News", "Radios"])
  defaultStartedPage: "News" | "Radios";

  @ApiProperty()
  @IsInt()
  defaultArticleCategorie: number;

  @ApiProperty()
  @IsBoolean()
  allowNotifications: boolean;
}

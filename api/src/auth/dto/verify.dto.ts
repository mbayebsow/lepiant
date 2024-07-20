import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, Matches } from "class-validator";

export class VerifyDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^\d{6}$/, { message: "OTP must be 6 digits" })
  code: string;
}

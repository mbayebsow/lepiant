import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  categorieId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  link: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  published: Date;
}

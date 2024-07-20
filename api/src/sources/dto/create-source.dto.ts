import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class CreateSourceDto {
  @IsString()
  @Matches(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    { message: "The source url must be a valid url" }
  )
  url: string;

  @IsNotEmpty()
  @IsNumber()
  categorieId: number;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}

import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

const IMAGE_URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export class CreateQuotidienDto {
  @IsNotEmpty()
  @IsString()
  @Matches(IMAGE_URL_REGEX, {
    message: "The image url must be a valid url",
  })
  images: string;

  @IsOptional()
  @Matches(IMAGE_URL_REGEX, {
    message: "The image url must be a valid url",
  })
  thumbnailUrl?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: "The date must be in the format yyyy-mm-dd",
  })
  publishedAt: string;
}

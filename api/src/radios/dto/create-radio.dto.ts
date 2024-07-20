import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

const URL_REGEX =
  /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

export class CreateRadioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(URL_REGEX, {
    message: "The source url must be a valid url",
  })
  source: string;

  @IsString()
  @IsNotEmpty()
  @Matches(URL_REGEX, {
    message: "The image url must be a valid url",
  })
  image: string;

  @IsNumber()
  @IsNotEmpty()
  categorieId: number;
}

import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateRevueDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-(). ]+$/, {
    message: "The name must not contain special characters",
  })
  name: string;

  @IsNotEmpty()
  @Matches(
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    {
      message: "The audio url must be a valid url",
    }
  )
  audio: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: "The date must be in the format yyyy-mm-dd",
  })
  publishedAt: string;
}

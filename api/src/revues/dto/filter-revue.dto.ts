import { IsOptional, IsString, Matches } from "class-validator";

export class FilterRevueDto {
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: "The date must be in the format yyyy-mm-dd",
  })
  publishedAt?: string;
}

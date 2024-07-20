import { Controller, Get, Query } from "@nestjs/common";
import { AverageColorService } from "src/common/helpers/average-color/average-color.service";

@Controller("functions")
export class FunctionsController {
  constructor(private readonly averageColorService: AverageColorService) {}

  @Get("averageColor")
  async averageColor(@Query("imageUrl") imageUrl: string) {
    return this.averageColorService.getColor(imageUrl);
  }
}

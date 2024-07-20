import { Module } from "@nestjs/common";
import { FunctionsService } from "./functions.service";
import { FunctionsController } from "./functions.controller";
import { AverageColorModule } from "src/common/helpers/average-color/average-color.module";

@Module({
  imports: [AverageColorModule],
  controllers: [FunctionsController],
  providers: [FunctionsService],
})
export class FunctionsModule {}

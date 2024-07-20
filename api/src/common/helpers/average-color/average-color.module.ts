import { Module } from "@nestjs/common";
import { AverageColorService } from "./average-color.service";

@Module({
  providers: [AverageColorService],
  exports: [AverageColorService],
})
export class AverageColorModule {}

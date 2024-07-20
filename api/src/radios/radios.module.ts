import { Module } from "@nestjs/common";
import { RadiosService } from "./radios.service";
import { RadiosController } from "./radios.controller";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [RadiosController],
  providers: [RadiosService],
})
export class RadiosModule {}

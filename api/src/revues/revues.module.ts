import { Module } from "@nestjs/common";
import { RevuesService } from "./revues.service";
import { RevuesController } from "./revues.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [RevuesController],
  providers: [RevuesService, PrismaService],
})
export class RevuesModule {}

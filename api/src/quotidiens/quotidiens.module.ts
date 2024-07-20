import { Module } from "@nestjs/common";
import { QuotidiensService } from "./quotidiens.service";
import { QuotidiensController } from "./quotidiens.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [QuotidiensController],
  providers: [QuotidiensService, PrismaService],
})
export class QuotidiensModule {}

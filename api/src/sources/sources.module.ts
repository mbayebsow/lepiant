import { Module } from "@nestjs/common";
import { SourcesService } from "./sources.service";
import { SourcesController } from "./sources.controller";
import { PrismaService } from "src/database/prisma.service";

@Module({
  controllers: [SourcesController],
  providers: [SourcesService, PrismaService],
})
export class SourcesModule {}

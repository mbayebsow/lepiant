import { Module } from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { ArticlesController } from "./articles.controller";
import { HttpModule } from "@nestjs/axios";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}

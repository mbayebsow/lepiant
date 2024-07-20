import { Module } from "@nestjs/common";
import { RedisModule } from "@nestjs-modules/ioredis";
import { APP_GUARD } from "@nestjs/core";
import { ArticlesModule } from "./articles/articles.module";
import { PrismaService } from "./database/prisma.service";
import { UsersModule } from "./users/users.module";
import { PrismaModule } from "./database/prisma.module";
import { ChannelsModule } from "./channels/channels.module";
import { QuotidiensModule } from "./quotidiens/quotidiens.module";
import { DateShorterService } from "./common/helpers/date-shorter/date-shorter.service";
import { RevuesModule } from "./revues/revues.module";
import { SourcesService } from "./sources/sources.service";
import { SourcesModule } from "./sources/sources.module";
import { AuthModule } from "./auth/auth.module";
import { SessionModule } from "./auth/session/session.module";
import { AuthGuard } from "./common/guards/auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { RadiosModule } from "./radios/radios.module";
import { AverageColorService } from "./common/helpers/average-color/average-color.service";
import { AverageColorModule } from "./common/helpers/average-color/average-color.module";
import { FunctionsModule } from "./functions/functions.module";

@Module({
  imports: [
    RedisModule.forRoot({
      type: "single",
      url: process.env.REDIS_URL,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 3,
      },
    ]),
    ArticlesModule,
    UsersModule,
    PrismaModule,
    ChannelsModule,
    QuotidiensModule,
    RevuesModule,
    SourcesModule,
    AuthModule,
    SessionModule,
    RadiosModule,
    AverageColorModule,
    FunctionsModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    DateShorterService,
    SourcesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AverageColorService,
  ],
})
export class AppModule {}

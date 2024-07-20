import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "30d" },
    }),
    PrismaModule,
  ],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}

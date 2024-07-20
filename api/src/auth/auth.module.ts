import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { SessionModule } from "./session/session.module";
import { PrismaModule } from "src/database/prisma.module";

@Module({
  imports: [UsersModule, SessionModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

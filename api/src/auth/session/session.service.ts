import { v4 as uuidv4 } from "uuid";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Redis } from "ioredis";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/database/prisma.service";

interface Session {
  id: number;
  userId: number;
  sessionKey: string;
  sessionData: string;
  userAgent: string;
  lastActivity: Date;
  createAt: Date;
  expireAt: Date;
}

@Injectable()
export class SessionService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}

  async addSession(user: User, headers: Headers) {
    try {
      const sessionKey = uuidv4();
      const payload = {
        userId: user.id,
        sessionKey,
        sessionData: "",
        userAgent: headers["user-agent"],
        lastActivity: new Date(),
        createAt: new Date(),
        expireAt:
          user.role === "ADMIN"
            ? new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 7)
            : new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 360),
      };
      // const addEntry = await this.redis.rpush("SESSION", JSON.stringify(payload));

      await this.prisma.session.create({
        data: payload,
      });
      return sessionKey;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async verifySession(sessionKey: string): Promise<Session | false> {
    try {
      const entry = await this.prisma.session.findUnique({
        where: {
          sessionKey,
        },
      });

      return entry;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

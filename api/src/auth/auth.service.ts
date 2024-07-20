import {
  BadGatewayException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { VerifyDto } from "./dto/verify.dto";
import { PrismaService } from "src/database/prisma.service";
import { OtpCodeType } from "src/types";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { UsersService } from "src/users/users.service";
import { SessionService } from "./session/session.service";
import { UpdateUserDto } from "src/users/dto/update-user.dto";

interface OtpVerifyBody {
  email: string;
  code: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly sessionService: SessionService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async sendOTP(email: string) {
    const bodyP = {
      senderName: "L'Épiant",
      senderMail: "noreply-lepiant@teldoogroup.com",
      receiverMail: email,
    };

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyP),
    };

    try {
      const ifCodeExist = await this.redis.get(`OTP:${email}`);
      if (ifCodeExist) await this.redis.del(`OTP:${email}`);

      const otp: OtpCodeType | null = {
        status: "succes",
        code: "123456",
      };
      // await fetch(
      //   "http://email-sender-agent.teldoo.workers.dev/sendOTP",
      //   options
      // ).then((response) => response.json() as Promise<OtpCodeType>);

      await this.redis.set(`OTP:${email}`, otp.code, "EX", 60);

      return {
        success: true,
        message: "OTP sent",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async verify(verifyDto: VerifyDto, headers: Headers) {
    try {
      const optCache = await this.redis.get(`OTP:${verifyDto.email}`);
      if (!optCache || optCache !== verifyDto.code) throw new NotFoundException("Code invalid");

      let USER = await this.prismaService.user.findUnique({
        where: { email: verifyDto.email },
      });

      if (!USER) {
        USER = await this.usersService.create({
          email: verifyDto.email,
          firstName: "",
          lastName: "",
        });
      }

      const session = await this.sessionService.addSession(USER, headers);
      await this.redis.del(`OTP:${verifyDto.email}`);

      return {
        success: true,
        session,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async updateMe(id: number, UpdateUserDto: UpdateUserDto) {
    // delete UpdateUserDto?.role;
    // delete UpdateUserDto?.email; // TODO: check if this is needed

    if (!id) throw new NotFoundException("User not found");
    if (Object.values(UpdateUserDto).length === 0)
      throw new NotAcceptableException("No data to update");

    try {
      await this.usersService.update(id, UpdateUserDto);
      return {
        success: true,
        message: "User updated",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

import {
  Controller,
  Post,
  Body,
  Get,
  ValidationPipe,
  Req,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { VerifyDto } from "./dto/verify.dto";
import { Public } from "src/common/decorators/public.decorator";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { UsersService } from "src/users/users.service";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "src/users/dto/user.dto";

@ApiBearerAuth("access-token")
@ApiTags("authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Public()
  @Post("/login")
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.sendOTP(loginDto.email);
  }

  @Public()
  @Post("/verify")
  verify(@Req() req: Request, @Body(ValidationPipe) verifyDto: VerifyDto) {
    const headers = req.headers;
    return this.authService.verify(verifyDto, headers);
  }

  @Post("/updateMe")
  @ApiBody({ type: User })
  updateMe(@Req() req, @Body(ValidationPipe) UpdateUserDto: UpdateUserDto) {
    const id = req?.userId;
    if (!id) throw new NotFoundException("User not found");
    return this.authService.updateMe(id, UpdateUserDto);
  }

  @Get("/me")
  @ApiResponse({
    status: 200,
    description: "The user object",
    type: User,
  })
  async getUser(@Req() req) {
    const id = req?.userId;
    if (!id) throw new NotFoundException("User not found");
    const user = await this.userService.findOne(id);
    return user;
  }
}

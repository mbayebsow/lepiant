import {
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const ifUserExists = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (ifUserExists) throw new ConflictException("User already exists");

    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    const user = this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        language: true,
        country: true,
        defaultStartedPage: true,
        allowNotifications: true,
        categorie: {
          select: {
            id: true,
            name: true,
          },
        },
        channelsSubscribed: {
          select: {
            id: true,
            channelId: true,
          },
        },
        articlesSaved: {
          select: {
            id: true,
            articleId: true,
          },
        },
        radiosLiked: {
          select: {
            id: true,
            radioId: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }
}

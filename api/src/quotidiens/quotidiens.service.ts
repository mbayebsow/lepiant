import { BadGatewayException, Injectable } from "@nestjs/common";
import { CreateQuotidienDto } from "./dto/create-quotidien.dto";
import { UpdateQuotidienDto } from "./dto/update-quotidien.dto";
import { PrismaService } from "src/database/prisma.service";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
import { Prisma } from "@prisma/client";

@Injectable()
export class QuotidiensService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private prisma: PrismaService
  ) {}

  async create(createQuotidienDto: CreateQuotidienDto) {
    try {
      const entry = await this.prisma.quotidien.create({
        data: createQuotidienDto,
      });

      return entry;
    } catch (error) {
      throw new BadGatewayException("Error creating quotidien");
    }
  }

  async createMany(createQuotidienDto: CreateQuotidienDto[]) {
    try {
      const entry = await this.prisma.quotidien.createMany({
        data: createQuotidienDto,
        skipDuplicates: true,
      });
      return entry;
    } catch (error) {
      throw new BadGatewayException("Error creating many quotidiens");
    }
  }

  async findAll(publishedAt: string) {
    const lastQuotidienDate = await this.prisma.quotidien.findMany({
      take: 1,
      orderBy: {
        id: "desc",
      },
    });

    return this.prisma.quotidien.findMany({
      where: {
        publishedAt: publishedAt ? publishedAt : lastQuotidienDate[0].publishedAt,
      },
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} quotidien`;
  // }

  update(id: number, updateQuotidienDto: UpdateQuotidienDto) {
    return this.prisma.quotidien.update({
      where: {
        id: id,
      },
      data: updateQuotidienDto,
    });
  }

  remove(id: number) {
    return this.prisma.quotidien.delete({
      where: {
        id: id,
      },
    });
  }
}

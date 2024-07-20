import { Injectable } from "@nestjs/common";
import { CreateSourceDto } from "./dto/create-source.dto";
import { UpdateSourceDto } from "./dto/update-source.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class SourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSourceDto: CreateSourceDto) {
    return this.prisma.source.create({
      data: createSourceDto,
    });
  }

  async findAll() {
    return this.prisma.source.findMany();
  }

  async findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  async update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  async remove(id: number) {
    return `This action removes a #${id} source`;
  }
}

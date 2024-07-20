import { Injectable } from "@nestjs/common";
import { CreateRevueDto } from "./dto/create-revue.dto";
import { UpdateRevueDto } from "./dto/update-revue.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class RevuesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRevueDto: CreateRevueDto) {
    return this.prisma.revue.create({
      data: createRevueDto,
    });
  }

  findAll(publishedAt: string) {
    return this.prisma.revue.findMany();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} revue`;
  // }

  update(id: number, updateRevueDto: UpdateRevueDto) {
    return this.prisma.revue.update({
      where: {
        id: id,
      },
      data: updateRevueDto,
    });
  }

  remove(id: number) {
    return this.prisma.revue.delete({
      where: {
        id: id,
      },
    });
  }
}

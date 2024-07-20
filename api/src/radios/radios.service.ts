import { BadGatewayException, Injectable } from "@nestjs/common";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class RadiosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRadioDto: CreateRadioDto) {
    return this.prisma.radio.create({
      data: createRadioDto,
    });
  }

  async findAll() {
    try {
      const entry = await this.prisma.radio.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          image: true,
          source: true,
          // categorieId: true,
          categorie: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return entry;
    } catch (error) {
      console.log(error);
      throw new BadGatewayException(error);
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} radio`;
  // }

  update(id: number, updateRadioDto: UpdateRadioDto) {
    return this.prisma.radio.update({
      where: { id: id },
      data: updateRadioDto,
    });
  }

  remove(id: number) {
    return this.prisma.radio.delete({
      where: { id: id },
    });
  }

  // Liked radios
  async findLiked(userId: number) {
    return this.prisma.radio_liked.findMany({
      where: { userId: userId },
      select: {
        id: true,
        radioId: true,
      },
    });
  }

  async toggleLike(
    userId: number,
    radioId: number
  ): Promise<{ create?: boolean; delete?: boolean; message: string }> {
    try {
      const ifRadiosSavedExist = await this.prisma.radio_liked.findMany({
        where: {
          radioId,
          userId,
        },
      });

      if (ifRadiosSavedExist.length > 0) {
        await this.prisma.radio_liked.delete({
          where: {
            id: ifRadiosSavedExist[0].id,
          },
        });

        return {
          delete: true,
          message: "Radio removed from saved",
        };
      } else {
        await this.prisma.radio_liked.create({
          data: {
            radioId,
            userId,
          },
        });

        return {
          create: true,
          message: "Radio saved",
        };
      }
    } catch (error) {
      console.log(error);
      throw new BadGatewayException("Error saving radio");
    }
  }
}

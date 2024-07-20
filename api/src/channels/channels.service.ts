import { BadGatewayException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createChannelDto: CreateChannelDto) {
    return "This action adds a new channel";
  }

  findAll() {
    return this.prisma.channel.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        fullLogo: true,
        language: true,
        country: true,
        webSite: true,
        sources: {
          select: {
            categorieId: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        language: true,
        country: true,
        logo: true,
        fullLogo: true,
        webSite: true,
        sources: {
          select: {
            categorieId: true,
          },
        },
      },
    });
    if (!channel) throw new NotFoundException("Channel not found");
    return channel;
  }

  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }

  async findSubscribed(userId: number) {
    return this.prisma.channel_subscribed.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        channelId: true,
      },
    });
  }

  async toggleSubscribe(
    channelId: number,
    userId: number
  ): Promise<{ create?: boolean; delete?: boolean; message: string }> {
    try {
      const ifChannelsSavedExist = await this.prisma.channel_subscribed.findMany({
        where: {
          channelId,
          userId,
        },
      });

      if (ifChannelsSavedExist.length > 0) {
        await this.prisma.channel_subscribed.delete({
          where: {
            id: ifChannelsSavedExist[0].id,
          },
        });

        return {
          delete: true,
          message: "Channel removed from saved",
        };
      } else {
        await this.prisma.channel_subscribed.create({
          data: {
            channelId,
            userId,
          },
        });

        return {
          create: true,
          message: "Channel saved",
        };
      }
    } catch (error) {
      console.log(error);

      throw new BadGatewayException("Error subscribing to channel");
    }
  }
}

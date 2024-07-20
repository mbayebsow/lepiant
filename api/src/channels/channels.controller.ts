import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Req,
  NotFoundException,
} from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { UpdateChannelDto } from "./dto/update-channel.dto";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth("access-token")
@ApiTags("channels")
@Controller("channels")
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get("subscribed")
  findSaved(@Req() req) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.channelsService.findSubscribed(+userId);
  }

  @Post("subscribed/:id")
  toggleSave(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.channelsService.toggleSubscribe(id, +userId);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createChannelDto: CreateChannelDto) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.channelsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Roles(Role.ADMIN)
  @Patch(":id")
  remove(@Param("id") id: string) {
    return this.channelsService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
  Req,
  NotFoundException,
} from "@nestjs/common";
import { RadiosService } from "./radios.service";
import { CreateRadioDto } from "./dto/create-radio.dto";
import { UpdateRadioDto } from "./dto/update-radio.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@ApiBearerAuth("access-token")
@ApiTags("radios")
@Controller("radios")
export class RadiosController {
  constructor(private readonly radiosService: RadiosService) {}

  @Get("liked")
  findSaved(@Req() req) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.radiosService.findLiked(+userId);
  }

  @Post("liked/:id")
  toggleSave(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.radiosService.toggleLike(+userId, id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body(ValidationPipe) createRadioDto: CreateRadioDto) {
    return this.radiosService.create(createRadioDto);
  }

  @Get()
  findAll() {
    return this.radiosService.findAll();
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.radiosService.findOne(+id);
  // }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id", ParseIntPipe) id: number, @Body() updateRadioDto: UpdateRadioDto) {
    return this.radiosService.update(id, updateRadioDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.radiosService.remove(id);
  }
}

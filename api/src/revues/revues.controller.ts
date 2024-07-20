import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { RevuesService } from "./revues.service";
import { CreateRevueDto } from "./dto/create-revue.dto";
import { UpdateRevueDto } from "./dto/update-revue.dto";
import { FilterRevueDto } from "./dto/filter-revue.dto";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth("access-token")
@ApiTags("revues")
@Controller("revues")
export class RevuesController {
  constructor(private readonly revuesService: RevuesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body(ValidationPipe) createRevueDto: CreateRevueDto) {
    return this.revuesService.create(createRevueDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) query: FilterRevueDto) {
    return this.revuesService.findAll(query.publishedAt);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.revuesService.findOne(+id);
  // }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body(ValidationPipe) updateRevueDto: UpdateRevueDto) {
    return this.revuesService.update(+id, updateRevueDto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.revuesService.remove(+id);
  }
}

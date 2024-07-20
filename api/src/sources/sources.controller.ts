import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SourcesService } from "./sources.service";
import { CreateSourceDto } from "./dto/create-source.dto";
import { UpdateSourceDto } from "./dto/update-source.dto";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth("access-token")
@ApiTags("sources")
@Controller("sources")
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createSourceDto: CreateSourceDto) {
    return this.sourcesService.create(createSourceDto);
  }

  @Get()
  findAll() {
    return this.sourcesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sourcesService.findOne(+id);
  // }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSourceDto: UpdateSourceDto) {
    return this.sourcesService.update(+id, updateSourceDto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.sourcesService.remove(+id);
  }
}

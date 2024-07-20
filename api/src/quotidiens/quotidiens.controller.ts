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
  UsePipes,
  ParseIntPipe,
} from "@nestjs/common";
import { QuotidiensService } from "./quotidiens.service";
import { CreateQuotidienDto } from "./dto/create-quotidien.dto";
import { UpdateQuotidienDto } from "./dto/update-quotidien.dto";
import { FilterQuotidienDto } from "./dto/filter-quotidien.dto";
import { Role } from "@prisma/client";
import { Roles } from "src/common/decorators/roles.decorator";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth("access-token")
@ApiTags("quotidiens")
@Controller("quotidiens")
export class QuotidiensController {
  constructor(private readonly quotidiensService: QuotidiensService) {}

  @Roles(Role.ADMIN, Role.CRONAGENT)
  @Post()
  create(@Body(ValidationPipe) createQuotidienDto: CreateQuotidienDto) {
    return this.quotidiensService.create(createQuotidienDto);
  }

  @Roles(Role.ADMIN, Role.CRONAGENT)
  @Post("/many")
  async createMany(@Body() createQuotidienDto: CreateQuotidienDto[]) {
    return await this.quotidiensService.createMany(createQuotidienDto);
  }

  @Get()
  @UsePipes(ValidationPipe)
  findAll(@Query(ValidationPipe) query: FilterQuotidienDto) {
    return this.quotidiensService.findAll(query.publishedAt);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.quotidiensService.findOne(+id);
  // }

  @Roles(Role.ADMIN)
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateQuotidienDto: UpdateQuotidienDto) {
    return this.quotidiensService.update(+id, updateQuotidienDto);
  }

  @Roles(Role.ADMIN)
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.quotidiensService.remove(id);
  }
}

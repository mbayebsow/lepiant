import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  ParseIntPipe,
  ValidationPipe,
  NotFoundException,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

//@Controller({ path: "articles", version: "1" })
@ApiTags("articles")
@Controller("articles")
@ApiBearerAuth("access-token")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get("live")
  getLiveNews(@Req() req) {
    const userId = req?.userId;
    return this.articlesService.getLiveNews(+userId);
  }

  @Get("categories")
  findAllCategories() {
    return this.articlesService.findAllCategories();
  }

  @Get("saved")
  findSaved(@Req() req) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.articlesService.findSaved(+userId);
  }

  @Post("saved/:id")
  toggleSave(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const userId = req?.userId;
    return this.articlesService.toggleSave(id, +userId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.CRONAGENT)
  create(@Body(ValidationPipe) createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Post("many")
  @Roles(Role.ADMIN, Role.CRONAGENT)
  @ApiBody({ type: [CreateArticleDto] })
  createMany(@Body(ValidationPipe) createArticleDto: CreateArticleDto[]) {
    return this.articlesService.createMany(createArticleDto);
  }

  @Get()
  findAll(
    @Req() req,
    @Query("categorie") categorie: number,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("channel") channel: number
  ) {
    const userId = req?.userId;
    if (!userId) throw new NotFoundException("User not found");
    return this.articlesService.findAll(userId, categorie, page, limit, channel);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.articlesService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.articlesService.remove(+id);
  }
}

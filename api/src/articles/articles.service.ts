import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateArticleDto } from "./dto/create-article.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";
import { PrismaService } from "src/database/prisma.service";
import { HttpService } from "@nestjs/axios";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Redis } from "ioredis";
// import { AxiosResponse } from "@nestjs/terminus/dist/health-indicator/http/axios.interfaces";
// import { LiveNews, NewsResponse } from "src/types";
// import { Article } from "@prisma/client";

@Injectable()
export class ArticlesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    @InjectRedis() private readonly redis: Redis
  ) {}

  async getLiveNews(userId: number) {
    const newsSource =
      "https://serpapi.com/search.json?engine=google_news&gl=sn&api_key=a4002568ecdc175297de61dc8e4901ab7991704c8aa0b08c88565fabc0d06b0f";
    //"http://api.mediastack.com/v1/news?access_key=4140ce79139d7f499d0ca4bf9dc216e7&countries=sn";

    try {
      const article = this.prisma.article.findMany({
        orderBy: {
          published: "desc",
        },
        take: 10,
      });
      return article;
      // const cacheLiveNews = await this.redis.get("liveNews");
      // if (cacheLiveNews) return JSON.parse(cacheLiveNews);

      // const entry: AxiosResponse<LiveNews> = await this.httpService.axiosRef.get(newsSource);

      // const liveNews = entry.data.news_results.map((result) => {
      //   let RESULTS: NewsResponse;

      //   if (result.stories && result.highlight) {
      //     RESULTS = {
      //       title: result.highlight.title,
      //       thumbnail: result.highlight.thumbnail,
      //       source: result.highlight.source,
      //       date: result.highlight.date,
      //       link: result.highlight.link,
      //     };

      //     result.stories.map((storie) => {
      //       RESULTS = {
      //         title: storie.title,
      //         thumbnail: storie.thumbnail,
      //         source: storie.source,
      //         date: storie.date,
      //         link: storie.link,
      //       };
      //     });
      //   } else {
      //     RESULTS = {
      //       title: result.title,
      //       thumbnail: result.thumbnail,
      //       source: result.source,
      //       date: result.date,
      //       link: result.link,
      //     };
      //   }
      //   return RESULTS;
      // });

      // await this.redis.set("liveNews", JSON.stringify(liveNews), "EX", 7200);
      // return liveNews;
    } catch (e) {
      console.log("getLiveNews", e);
      throw new BadGatewayException("Error to getting live news");
    }
  }

  async create(createArticleDto: CreateArticleDto) {
    try {
      const entry = await this.prisma.article.create({
        data: createArticleDto,
      });
      return entry;
    } catch (error) {
      throw new BadGatewayException("Error creating many article");
    }
  }

  async createMany(createQuotidienDto: CreateArticleDto[]) {
    try {
      const entry = await this.prisma.article.createMany({
        data: createQuotidienDto,
        skipDuplicates: true,
      });
      return entry;
    } catch (error) {
      throw new BadGatewayException("Error creating many articles");
    }
  }

  async findAll(userId: number, categorie: number, page = 1, limit: number = 10, channel: number) {
    const skip = (page - 1) * limit;

    if (userId) {
      try {
        const channelsSubscribed = await this.prisma.channel_subscribed.findMany({
          where: {
            userId,
          },
          select: {
            channelId: true,
          },
        });

        let filter: any = {
          channelId: +channel || { in: channelsSubscribed.map((channel) => channel.channelId) },
        };

        if (categorie) filter = { ...filter, categorieId: +categorie };

        if (channelsSubscribed.length > 0) {
          const articles = await this.prisma.article.findMany({
            where: filter,
            orderBy: {
              published: "desc",
            },
            select: {
              id: true,
              channelId: true,
              categorieId: true,
              title: true,
              description: true,
              image: true,
              published: true,
            },
            skip,
            take: +limit,
          });
          return articles;
        }
      } catch (error) {
        throw new InternalServerErrorException("Error fetching articles");
      }
    }

    return await this.prisma.article.findMany({
      take: 10,
    });
  }

  findAllCategories() {
    return this.prisma.article_categorie.findMany();
  }

  async findOne(id: number) {
    // let articleContent: string;
    const cache = await this.redis.get(`Article:${id}`);
    if (cache) return JSON.parse(cache);

    const article = await this.prisma.article.findUnique({
      where: {
        id,
      },
      select: {
        link: true,
        title: true,
        description: true,
        image: true,
        published: true,
      },
    });

    try {
      const fetchContent = await this.httpService.axiosRef.get(
        `https://extractor-lepiant.deno.dev/?url=${article.link}`
      );

      const articleResult = {
        ...fetchContent.data,
        content: this.stripHTML(fetchContent.data.content),
      };
      await this.redis.set(`Article:${id}`, JSON.stringify(articleResult));

      return articleResult;
    } catch (error) {
      throw new ServiceUnavailableException("Article content not available");
    }
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: {
        id,
      },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: {
        id,
      },
    });
  }

  async findSaved(userId: number) {
    try {
      const entry = await this.prisma.article_saved.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          articleId: true,
          article: {
            select: {
              id: true,
              channelId: true,
              categorieId: true,
              title: true,
              description: true,
              image: true,
              published: true,
              updatedAt: true,
              createdAt: true,
            },
          },
        },
      });
      return entry;
    } catch (error) {
      throw new BadGatewayException("Error fetching saved articles");
    }
  }
  async toggleSave(
    articleId: number,
    userId: number
  ): Promise<{ create?: boolean; delete?: boolean; message: string }> {
    try {
      const ifArticlesSavedExist = await this.prisma.article_saved.findMany({
        where: {
          articleId,
          userId,
        },
      });

      if (ifArticlesSavedExist.length > 0) {
        await this.prisma.article_saved.delete({
          where: {
            id: ifArticlesSavedExist[0].id,
          },
        });

        return {
          delete: true,
          message: "Article removed from saved",
        };
      } else {
        await this.prisma.article_saved.create({
          data: {
            articleId,
            userId,
          },
        });

        return {
          create: true,
          message: "Article saved",
        };
      }
    } catch (error) {
      throw new BadGatewayException("Error saving article");
    }
  }

  private stripHTML(html: string) {
    let stripped = html.replace(/<\/?[^>]+(>|$)/g, "");
    stripped = stripped.replace(/[\n\t]/g, "");
    stripped = stripped.replace(/\s\s+/g, " ");
    return stripped;
  }
}

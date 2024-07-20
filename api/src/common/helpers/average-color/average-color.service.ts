import { Injectable } from "@nestjs/common";
import { getAverageColor } from "fast-average-color-node";
import { FastAverageColorResult } from "fast-average-color";
import { Redis } from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";

@Injectable()
export class AverageColorService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async getColor(
    imageUrl: string
  ): Promise<{ success: boolean; color?: FastAverageColorResult; message?: string }> {
    try {
      const cache = await this.redis.get(imageUrl);
      if (cache) return { success: true, color: JSON.parse(cache) };

      const color = await getAverageColor(imageUrl);
      await this.redis.set(imageUrl, JSON.stringify(color));
      return { success: true, color };
    } catch (error) {
      return { success: false, message: "error to get color" };
    }
  }
}

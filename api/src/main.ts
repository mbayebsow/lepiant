import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json } from "body-parser";
import { VersioningType } from "@nestjs/common";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(json({ limit: "1mb" }));
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: "GET,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    // exposedHeaders: ["Authorization"],
    credentials: true,
  });
  app.enableVersioning({
    defaultVersion: "1", //["1", "2"]
    type: VersioningType.URI,
  });

  if (process.env.NODE_ENV === "development") {
    const config = new DocumentBuilder()
      .setTitle("L'epiant API")
      .setDescription("Documentation de l'API")
      .setVersion("1.0.0")
      .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);
  }

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is running on: http://localhost:3000/api-docs`);
}
bootstrap();

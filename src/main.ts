import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix("api");

  app.enableVersioning({
    prefix: "v",
    defaultVersion: "1",
    type: VersioningType.URI,
  });

  const allowedOrigins = [
    "https://mtiskari.ge",
    "https://www.mtiskari.ge",
    "http://localhost:3000",
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Serve uploaded files as static assets
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads",
  });

  console.log(`aplication v1 is running , running time ${new Date()}`);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
